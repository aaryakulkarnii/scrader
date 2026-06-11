import hashlib
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
from app.core.database import AsyncSessionLocal
from app.models.models import Snapshot, Competitor
from app.repositories.repositories import snapshot_repo, competitor_repo
import asyncio

async def clean_html(html_content: str) -> str:
    soup = BeautifulSoup(html_content, 'lxml')
    # Remove script, style, nav, footer
    for elem in soup(['script', 'style', 'nav', 'footer', 'noscript']):
        elem.extract()
    return soup.get_text(separator=' ', strip=True)

async def scout_agent(ctx, competitor_id: str, url: str):
    """
    Scout Agent uses Playwright to load the page, extract text, and save a Snapshot.
    """
    print(f"[SCOUT] Starting scout for {url}")
    
    # We use our own DB session inside the worker context
    async with AsyncSessionLocal() as db:
        try:
            competitor = await competitor_repo.get(db, id=competitor_id)
            if not competitor:
                print(f"[SCOUT] Competitor {competitor_id} not found.")
                return

            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await page.goto(url, wait_until="networkidle", timeout=30000)
                html_content = await page.content()
                await browser.close()

            clean_text = await clean_html(html_content)
            content_hash = hashlib.sha256(clean_text.encode('utf-8')).hexdigest()

            # Check if latest snapshot has the same hash to avoid duplicates
            latest = await snapshot_repo.get_latest_for_competitor(db, competitor_id)
            if latest and latest.content_hash == content_hash:
                print(f"[SCOUT] No changes detected for {url}")
                return

            # Save new snapshot
            snapshot_in = {
                "competitor_id": competitor.id,
                "url": url,
                "raw_html": html_content,
                "clean_text": clean_text,
                "content_hash": content_hash
            }
            new_snapshot = await snapshot_repo.create(db=db, obj_in=snapshot_in)
            print(f"[SCOUT] Saved snapshot {new_snapshot.id} for {url}")

            # Enqueue Diff Agent if we have a previous snapshot
            if latest:
                # Trigger Diff Agent via arq
                redis = ctx['redis']
                await redis.enqueue_job('diff_agent', competitor_id, str(latest.id), str(new_snapshot.id))

        except Exception as e:
            print(f"[SCOUT ERROR] {e}")

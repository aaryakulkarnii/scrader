import httpx
from bs4 import BeautifulSoup
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.repositories import competitor_repo

async def discover_competitor_pages(ctx, competitor_id: str, domain: str):
    print(f"[DISCOVERY] Starting discovery for {domain}")
    from app.core.database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        url = f"https://{domain}" if not domain.startswith("http") else domain
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0, follow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            links = soup.find_all('a', href=True)
            
            discovered = {
                "pricing": None,
                "features": None,
                "blog": None,
                "careers": None,
                "changelog": None
            }
            
            for link in links:
                href = link['href']
                text = link.get_text().lower()
                
                if not discovered["pricing"] and ("pricing" in href or "pricing" in text):
                    discovered["pricing"] = href
                if not discovered["features"] and ("features" in href or "product" in href):
                    discovered["features"] = href
                if not discovered["blog"] and ("blog" in href):
                    discovered["blog"] = href
                if not discovered["careers"] and ("careers" in href or "jobs" in href):
                    discovered["careers"] = href
                if not discovered["changelog"] and ("changelog" in href or "updates" in href):
                    discovered["changelog"] = href

            competitor = await competitor_repo.get(db, id=competitor_id)
            if competitor:
                metadata = competitor.metadata_json or {}
                metadata["discovered_pages"] = discovered
                await competitor_repo.update(db=db, db_obj=competitor, obj_in={"metadata_json": metadata})

            # Enqueue Scout Agent for the discovered pages or homepage
            redis = ctx.get('redis')
            if redis:
                await redis.enqueue_job('scout_agent', competitor_id, url)
                # If we discovered a pricing page, scout that too
                if discovered["pricing"]:
                    full_url = discovered["pricing"] if discovered["pricing"].startswith("http") else f"{url}{discovered['pricing']}"
                    await redis.enqueue_job('scout_agent', competitor_id, full_url)

                # Trigger the other AI agents
                await redis.enqueue_job('hiring_agent', competitor_id)
                await redis.enqueue_job('sentiment_agent', competitor_id)

    except Exception as e:
        print(f"[DISCOVERY ERROR] for {domain}: {e}")

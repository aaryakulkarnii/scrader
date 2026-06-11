import asyncio
from app.core.database import AsyncSessionLocal
from app.models.models import HiringEvent, Competitor
from app.repositories.repositories import competitor_repo
import random

async def hiring_agent(ctx, competitor_id: str):
    """
    Simulates checking a competitor's career page for new job postings.
    In a real app, this would use Playwright to scrape the careers page,
    then Groq to extract the exact roles and categorize them.
    For this MVP, we simulate the detection of new roles based on threat scores.
    """
    print(f"[HIRING AGENT] Scanning career pages for {competitor_id}")
    
    roles = ["Senior Software Engineer", "Product Manager", "Director of Sales", "Machine Learning Researcher", "Growth Marketer"]
    categories = ["Engineering", "Product", "Sales", "AI/Research", "Marketing"]
    
    async with AsyncSessionLocal() as db:
        competitor = await competitor_repo.get(db, id=competitor_id)
        if not competitor:
            return

        # Randomly decide if a new job was posted
        if random.random() > 0.3:
            idx = random.randint(0, len(roles)-1)
            event = HiringEvent(
                competitor_id=competitor.id,
                role_title=roles[idx],
                team_category=categories[idx],
                count=random.randint(1, 5)
            )
            db.add(event)
            await db.commit()
            print(f"[HIRING AGENT] Detected {event.count} new open roles for {event.role_title} at {competitor.name}.")
            
            # Trigger opportunity agent
            redis = ctx.get('redis')
            if redis:
                await redis.enqueue_job('opportunity_agent', str(competitor.project_id))

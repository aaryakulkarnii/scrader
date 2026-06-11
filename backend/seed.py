import asyncio
from app.core.database import AsyncSessionLocal
from app.models.models import Project, Competitor, User
from sqlalchemy import select
from arq import create_pool
from arq.connections import RedisSettings
from app.core.config import settings

async def seed():
    async with AsyncSessionLocal() as db:
        # Get or create a default user
        result = await db.execute(select(User).limit(1))
        user = result.scalars().first()
        if not user:
            user = User(email="demo@example.com", password_hash="dummy")
            db.add(user)
            await db.commit()
            
        # Get or create a project
        result = await db.execute(select(Project).filter(Project.user_id == user.id).limit(1))
        project = result.scalars().first()
        if not project:
            project = Project(name="Demo Project", user_id=user.id)
            db.add(project)
            await db.commit()
            
        # Companies to add
        companies = [
            {"name": "Figma", "domain": "figma.com"},
            {"name": "X (Twitter)", "domain": "x.com"},
            {"name": "Vercel", "domain": "vercel.com"},
            {"name": "Stripe", "domain": "stripe.com"},
            {"name": "Notion", "domain": "notion.so"}
        ]
        
        redis = await create_pool(RedisSettings(host=settings.REDIS_HOST, port=settings.REDIS_PORT))
        
        for c in companies:
            # Check if exists
            result = await db.execute(select(Competitor).filter(Competitor.project_id == project.id, Competitor.domain == c["domain"]))
            existing = result.scalars().first()
            if not existing:
                print(f"Adding {c['name']}...")
                comp = Competitor(project_id=project.id, name=c["name"], domain=c["domain"])
                db.add(comp)
                await db.commit()
                await db.refresh(comp)
                # Enqueue discovery task
                await redis.enqueue_job('discover_competitor_pages', str(comp.id), comp.domain)
            else:
                print(f"Already have {c['name']}")
                
        print("Seed complete. ARQ worker will now scrape these sites!")
        
if __name__ == "__main__":
    asyncio.run(seed())

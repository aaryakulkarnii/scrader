import asyncio
from app.core.database import AsyncSessionLocal
from app.models.models import SentimentData, Competitor
from app.repositories.repositories import competitor_repo
import random

async def sentiment_agent(ctx, competitor_id: str):
    """
    Simulates pulling reviews/complaints from a Reddit/ProductHunt API.
    In a real app, this would use Groq to read 100s of raw tweets and extract the
    top complaints and calculate a sentiment score.
    """
    print(f"[SENTIMENT AGENT] Analyzing social sentiment for {competitor_id}")
    
    complaints = [
        "Users are complaining about slow load times",
        "Frustration around the new pricing model",
        "Missing enterprise SSO features",
        "Bugs in the reporting dashboard",
        "Poor customer support response times"
    ]
    sources = ["Reddit", "ProductHunt", "Twitter", "G2"]
    
    async with AsyncSessionLocal() as db:
        competitor = await competitor_repo.get(db, id=competitor_id)
        if not competitor:
            return

        score = random.uniform(2.0, 4.8) # out of 5
        text = random.choice(complaints) if score < 3.5 else "Users love the new UI update and speed improvements."

        event = SentimentData(
            competitor_id=competitor.id,
            source=random.choice(sources),
            score=score,
            text=text
        )
        db.add(event)
        await db.commit()
        print(f"[SENTIMENT AGENT] Sentiment score {score:.1f}/5 detected on {event.source}.")
        
        # Trigger opportunity agent
        redis = ctx.get('redis')
        if redis:
            await redis.enqueue_job('opportunity_agent', str(competitor.project_id))

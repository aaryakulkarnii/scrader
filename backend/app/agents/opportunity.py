import asyncio
import json
from groq import AsyncGroq
from app.core.database import AsyncSessionLocal
from app.models.models import MarketOpportunity, Project, Competitor
from app.repositories.repositories import project_repo
from sqlalchemy import select
from app.models.models import HiringEvent, SentimentData
from app.core.config import settings

groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY else "gsk_dummy")

SYSTEM_PROMPT = """
You are a brilliant startup strategist. Look at the recent hiring trends and customer sentiment 
for the competitors in this market.

Generate exactly ONE compelling "Market Opportunity" based on these data points.
Output ONLY valid JSON:
{
  "title": "Short catchy title for the opportunity (e.g. 'Capitalize on Acme's Support Failures')",
  "description": "2-3 sentences explaining exactly what we should build or do to steal market share.",
  "score": 85 (integer 1-100 indicating confidence)
}
"""

async def opportunity_agent(ctx, project_id: str):
    print(f"[OPPORTUNITY AGENT] Synthesizing market opportunities for project {project_id}")
    
    async with AsyncSessionLocal() as db:
        project = await project_repo.get(db, id=project_id)
        if not project:
            return

        # Fetch recent hiring and sentiment data across all competitors in this project
        hiring_results = await db.execute(
            select(HiringEvent, Competitor.name)
            .join(Competitor)
            .filter(Competitor.project_id == project_id)
            .order_by(HiringEvent.detected_at.desc())
            .limit(10)
        )
        hiring_data = [{"company": row[1], "role": row[0].role_title, "count": row[0].count} for row in hiring_results.all()]

        sentiment_results = await db.execute(
            select(SentimentData, Competitor.name)
            .join(Competitor)
            .filter(Competitor.project_id == project_id)
            .order_by(SentimentData.extracted_at.desc())
            .limit(10)
        )
        sentiment_data = [{"company": row[1], "source": row[0].source, "score": row[0].score, "text": row[0].text} for row in sentiment_results.all()]

        if not hiring_data and not sentiment_data:
            print("[OPPORTUNITY AGENT] Not enough data yet.")
            return

        prompt_context = f"Hiring Trends:\n{json.dumps(hiring_data)}\n\nCustomer Sentiment:\n{json.dumps(sentiment_data)}"

        try:
            response = await groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_context}
                ],
                model="llama3-70b-8192",
                temperature=0.6,
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)

            opp = MarketOpportunity(
                project_id=project.id,
                title=result.get("title", "New Opportunity"),
                description=result.get("description", ""),
                score=float(result.get("score", 70.0)),
                evidence_json={"hiring": hiring_data[:2], "sentiment": sentiment_data[:2]}
            )
            db.add(opp)
            await db.commit()
            print(f"[OPPORTUNITY AGENT] Created opportunity: {opp.title} (Score: {opp.score})")
            
        except Exception as e:
            print(f"[OPPORTUNITY ERROR] {e}")

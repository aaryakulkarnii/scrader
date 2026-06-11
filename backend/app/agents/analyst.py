import json
import asyncio
from groq import AsyncGroq
from app.core.database import AsyncSessionLocal
from app.models.models import Event, Signal, Competitor
from app.repositories.repositories import event_repo, signal_repo, competitor_repo
from app.core.config import settings

# Initialize Groq client
# Fallback to dummy key to avoid crashes if not configured
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY else "gsk_dummy")

SYSTEM_PROMPT = """
You are a competitive intelligence analyst. You are provided with website diffs representing changes a competitor made.
Analyze the additions and deletions.

Output ONLY a valid JSON object matching this schema:
{
  "summary": "1-2 sentences summarizing the change",
  "threat_score": 1-100 (integer representing threat severity to our business),
  "recommended_actions": ["action 1", "action 2"],
  "strategic_implication": "1-2 sentences on long-term impact"
}
"""

async def analyst_agent(ctx, competitor_id: str, event_id: str):
    print(f"[ANALYST] Starting analysis for event {event_id}")
    
    async with AsyncSessionLocal() as db:
        try:
            event = await event_repo.get(db, id=event_id)
            competitor = await competitor_repo.get(db, id=competitor_id)
            if not event or not competitor:
                print("[ANALYST] Event or Competitor not found.")
                return

            # Construct prompt payload
            diff_text = json.dumps(event.raw_data, indent=2)
            user_prompt = f"Competitor: {competitor.name}\nChanges:\n{diff_text}"

            # Call Groq LLM
            # Catch Auth errors if dummy key is used
            try:
                response = await groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    model="llama3-70b-8192",
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                analysis_result = json.loads(response.choices[0].message.content)
            except Exception as llm_error:
                print(f"[ANALYST] Groq API Error: {llm_error}. Using fallback dummy analysis.")
                analysis_result = {
                    "summary": f"Detected {event.raw_data.get('total_additions', 0)} additions and {event.raw_data.get('total_deletions', 0)} deletions.",
                    "threat_score": 50,
                    "recommended_actions": ["Review changes manually"],
                    "strategic_implication": "Potential product update or pricing shift."
                }

            # Create Signal
            signal_in = {
                "event_id": event.id,
                "signal_type": "automated_analysis",
                "confidence": 0.9,
                "implication": analysis_result.get("strategic_implication", ""),
                "threat_delta": float(analysis_result.get("threat_score", 50))
            }
            new_signal = await signal_repo.create(db=db, obj_in=signal_in)
            print(f"[ANALYST] Created signal {new_signal.id} with threat delta {signal_in['threat_delta']}")

            # Publish to Redis Pub/Sub for WebSockets
            redis = ctx['redis']
            channel = f"project_signals_{competitor.project_id}"
            message = json.dumps({
                "type": "new_signal",
                "signal_id": str(new_signal.id),
                "title": analysis_result.get("summary", "New Activity Detected")[:200],
                "threat_level": signal_in['threat_delta']
            })
            await redis.publish(channel, message)
            print(f"[ANALYST] Published signal to {channel}")

        except Exception as e:
            print(f"[ANALYST ERROR] {e}")

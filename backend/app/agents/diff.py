from difflib import ndiff
from app.core.database import AsyncSessionLocal
from app.models.models import Snapshot, Event
from app.repositories.repositories import snapshot_repo, event_repo
import asyncio
import json

async def diff_agent(ctx, competitor_id: str, old_snapshot_id: str, new_snapshot_id: str):
    """
    Diff Agent compares two snapshots and generates an Event if there are meaningful changes.
    """
    print(f"[DIFF] Starting diff for competitor {competitor_id}")
    
    async with AsyncSessionLocal() as db:
        try:
            old_snap = await snapshot_repo.get(db, id=old_snapshot_id)
            new_snap = await snapshot_repo.get(db, id=new_snapshot_id)
            
            if not old_snap or not new_snap:
                print("[DIFF] Snapshots not found")
                return

            # Basic text diffing
            diff = list(ndiff(old_snap.clean_text.splitlines(), new_snap.clean_text.splitlines()))
            additions = [line[2:] for line in diff if line.startswith('+ ')]
            deletions = [line[2:] for line in diff if line.startswith('- ')]

            # Check if there are substantial changes to warrant an event
            if not additions and not deletions:
                print("[DIFF] No meaningful text changes detected.")
                return

            # Package differences into an event
            raw_data = {
                "url": new_snap.url,
                "additions": additions[:50], # Limit to avoid massive payloads
                "deletions": deletions[:50],
                "total_additions": len(additions),
                "total_deletions": len(deletions)
            }

            event_in = {
                "competitor_id": competitor_id,
                "event_type": "website_update",
                "title": f"Website Update Detected",
                "raw_data": raw_data
            }
            
            new_event = await event_repo.create(db=db, obj_in=event_in)
            print(f"[DIFF] Created event {new_event.id} with {len(additions)} additions.")

            # Enqueue Analyst Agent
            redis = ctx['redis']
            await redis.enqueue_job('analyst_agent', competitor_id, str(new_event.id))

        except Exception as e:
            print(f"[DIFF ERROR] {e}")

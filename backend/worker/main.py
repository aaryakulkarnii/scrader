from arq.connections import RedisSettings
import sys
import os

# Add the backend directory to Python path so 'app' imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.services.discovery import discover_competitor_pages
from app.agents.scout import scout_agent
from app.agents.diff import diff_agent
from app.agents.analyst import analyst_agent
from app.agents.hiring import hiring_agent
from app.agents.sentiment import sentiment_agent
from app.agents.opportunity import opportunity_agent

async def startup(ctx):
    print("Worker starting up...")

async def shutdown(ctx):
    print("Worker shutting down...")

class WorkerSettings:
    functions = [
        discover_competitor_pages, 
        scout_agent, 
        diff_agent, 
        analyst_agent,
        hiring_agent,
        sentiment_agent,
        opportunity_agent
    ]
    redis_settings = RedisSettings(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
    on_startup = startup
    on_shutdown = shutdown

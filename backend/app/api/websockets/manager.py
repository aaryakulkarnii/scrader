from fastapi import WebSocket
import json
import asyncio
from typing import Dict, List
from redis.asyncio import Redis
from app.core.config import settings

class ConnectionManager:
    def __init__(self):
        # Map project_id to list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.redis: Redis = None
        self.pubsub_tasks: Dict[str, asyncio.Task] = {}

    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
            await self._start_redis_listener(project_id)
        self.active_connections[project_id].append(websocket)

    def disconnect(self, websocket: WebSocket, project_id: str):
        if project_id in self.active_connections:
            self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
                self._stop_redis_listener(project_id)

    async def _start_redis_listener(self, project_id: str):
        if not self.redis:
            self.redis = Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
        
        async def listen():
            pubsub = self.redis.pubsub()
            await pubsub.subscribe(f"project_signals_{project_id}")
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = message["data"].decode("utf-8")
                    await self.broadcast(data, project_id)

        task = asyncio.create_task(listen())
        self.pubsub_tasks[project_id] = task

    def _stop_redis_listener(self, project_id: str):
        if project_id in self.pubsub_tasks:
            self.pubsub_tasks[project_id].cancel()
            del self.pubsub_tasks[project_id]

    async def broadcast(self, message: str, project_id: str):
        if project_id in self.active_connections:
            for connection in self.active_connections[project_id]:
                await connection.send_text(message)

manager = ConnectionManager()

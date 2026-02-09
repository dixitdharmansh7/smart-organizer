import sys
import asyncio
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path to import smart_cleaner
sys.path.append(str(Path(__file__).parent.parent))

from smart_cleaner import SmartCleaner

app = FastAPI()

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify usually "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CleanRequest(BaseModel):
    path: str
    simulate: bool = True
    ai_mode: bool = False
    remove_empty: bool = True

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/clean")
async def start_cleaning(request: CleanRequest):
    folder_path = Path(request.path)
    if not folder_path.exists() or not folder_path.is_dir():
        return {"status": "error", "message": "Invalid folder path"}

    def on_log(message: str):
        # Broadcast log message via websocket
        asyncio.run(manager.broadcast({"type": "log", "message": message}))

    def on_progress(filename: str, category: str):
         # Broadcast progress via websocket
        asyncio.run(manager.broadcast({"type": "progress", "filename": filename, "category": category}))

    # Run cleaning in a background thread to avoid blocking the event loop
    loop = asyncio.get_event_loop()
    
    # Wrapper to run the synchronous clean method
    def run_cleaner():
        cleaner = SmartCleaner(
            base_path=folder_path,
            simulate=request.simulate,
            ai_mode=request.ai_mode,
            remove_empty=request.remove_empty,
            on_log=on_log,
            on_progress=on_progress
        )
        cleaner.clean()
        return cleaner

    try:
        cleaner = await loop.run_in_executor(None, run_cleaner)
        return {
            "status": "success",
            "message": "Cleaning complete",
            "stats": {
                "duplicates_removed": cleaner.duplicates_removed,
                "space_saved_mb": round(cleaner.space_saved / (1024*1024), 2)
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/scan")
async def scan_directory(request: CleanRequest):
    folder_path = Path(request.path)
    if not folder_path.exists():
        return {"status": "error", "message": "Path not found"}
    
    # Run scan in background to allow WS updates
    loop = asyncio.get_event_loop()
    
    def run_scan():
        files = []
        total_size = 0
        categories = {}
        cleaner = SmartCleaner(folder_path) # Utilize existing map logic light-weight
        
        count = 0
        # Iterate and report progress
        for f in folder_path.rglob("*"):
            if f.is_file():
                files.append(f)
                size = f.stat().st_size
                total_size += size
                
                cat = cleaner._get_category(f)
                categories[cat] = categories.get(cat, 0) + 1
                
                count += 1
                if count % 10 == 0: # Update every 10 files for smooth "real-time" feel
                    asyncio.run(manager.broadcast({
                        "type": "scan_progress", 
                        "count": count, 
                        "current_file": f.name
                    }))
        
        return files, total_size, categories

    files, total_size, categories = await loop.run_in_executor(None, run_scan)

    return {
        "status": "success",
        "total_files": len(files),
        "total_size_mb": round(total_size / (1024*1024), 2),
        "categories": categories
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

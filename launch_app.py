import subprocess
import time
import webbrowser
import os
import sys

def main():
    print("🚀 Starting SmartClean...")

    # Start Backend
    print("📦 Starting Backend (FastAPI)...")
    backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
        cwd=os.getcwd(),
        shell=True
    )

    # Start Frontend
    print("🎨 Starting Frontend (Vite)...")
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    frontend = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True
    )

    print("✅ Servers started!")
    print("👉 Backend: http://localhost:8000")
    print("👉 Frontend: http://localhost:5173")

    time.sleep(3)
    webbrowser.open("http://localhost:5173")

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        backend.terminate()
        frontend.terminate()

if __name__ == "__main__":
    main()

# SmartClean 🚀

**AI-Powered File Organizer & Cleaner**

SmartClean creates order out of chaos. It scans your cluttered directories, identifies duplicates, and intelligently sorts files into organized categories using local AI models. Now with a beautiful, modern web interface!

## Features ✨

- **Smart Organization**: Automatically sorts files into `Documents`, `Images`, `Music`, `Code`, etc.
- **AI-Powered Classification**: Uses BERT & Summarization models to understand file content (optional).
- **Duplicate Removal**: Identifies and removes duplicate files using SHA-256 hashing.
- **Modern Web UI**: Beautiful React frontend with glassmorphism design and real-time progress tracking.
- **Real-Time Visualization**: Watch as files are scanned and organized with a cyberpunk-style radar overlay.
- **Privacy First**: All processing happens locally on your machine.
- **Simulation Mode**: Dry-run your cleaning to see exactly what will happen without moving files.

## Installation 🛠️

### Prerequisites
- Python 3.8+
- Node.js 16+ (for frontend development/build)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smartclean.git
cd smartclean
```

### 2. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## Usage 🚀

### The Easy Way (Launcher)
We've included a launcher script that starts both the backend API and the frontend interface automatically.

```bash
python launch_app.py
```
This will open the application in your default web browser at `http://localhost:5173`.

### Manual Start
**Backend:**
```bash
uvicorn backend.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### CLI Mode (Legacy)
You can still run the cleaner directly from the command line without the UI:

```bash
# Basic Organization
python smart_cleaner.py --path "C:/Users/Name/Downloads"

# With AI Classification
python smart_cleaner.py --path "C:/Users/Name/Documents" --ai

# Simulation (Dry Run)
python smart_cleaner.py --simulate
```

## Contributing 🤝
Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄
MIT

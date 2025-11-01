Tired of your Downloads or Desktop looking like a digital junkyard?
SmartCleaner is your personal, no-nonsense assistant that tidies up, classifies, and organizes your messy folders

What it does:
Organizes your files into folders like Documents, Images, Music, Code, etc.

 Understands file content using AI (BERT + summarization) when you enable “AI Mode.”
 Removes duplicates using smart file hashing (SHA-256).
 Cleans empty folders (optional).
 Generates HTML reports of what was cleaned.
 Saves space and keeps your system neat.
 Can run in simulation mode (so you can test without moving files).

Organize files by type — no heavy models, super quick:

python smart_cleaner.py --path

 AI Mode (Smart classification)

Let the AI read and understand your files before sorting:
python smart_cleaner.py --ai

Simulation Mode (Dry Run)

Just see what would happen — no files are actually moved:
python smart_cleaner.py --simulate
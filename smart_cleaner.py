import os
import shutil
import hashlib
import argparse
import json
import logging
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Optional

#For a colored console
from rich.console import Console
from rich.table import Table
from rich.progress import track

console = Console()


def get_desktop_path() -> Path:
    home = Path.home()
    od = home / "OneDrive" / "Desktop"
    return od if od.exists() else home / "Desktop"


def hash_file(path: Path) -> Optional[str]:
    """Generate hash to detect duplicates."""
    try:
        h = hashlib.sha256()
        with open(path, "rb") as f:
            while chunk := f.read(8192):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return None

class SmartClassifier:
    def __init__(self):
        from sentence_transformers import SentenceTransformer, util
        from transformers import pipeline
        import fitz
        from docx import Document

        console.print("[yellow]Loading AI Models... please wait.[/yellow]")
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.util = util
        self.fitz = fitz
        self.Document = Document

        self.categories = [
            "documents", "images", "videos", "music", "code",
            "spreadsheets", "presentations", "pdfs",
            "invoices", "assignments", "reports", "archives", "others"
        ]
        self.category_embeddings = self.embedder.encode(self.categories, convert_to_tensor=True)

    def extract_text(self, path: Path) -> Optional[str]:
        try:
            if path.suffix.lower() == ".pdf":
                text = ""
                with self.fitz.open(path) as pdf:
                    for page in pdf:
                        text += page.get_text()
                return text[:4000]
            elif path.suffix.lower() == ".docx":
                doc = self.Document(path)
                return "\n".join(p.text for p in doc.paragraphs)[:4000]
            elif path.suffix.lower() == ".txt":
                return path.read_text(encoding="utf-8", errors="ignore")[:4000]
        except Exception:
            return None

    def classify(self, filename: str, path: Optional[Path] = None) -> str:
        base = Path(filename).stem
        query = base
        if path and path.suffix.lower() in [".pdf", ".docx", ".txt"]:
            content = self.extract_text(path)
            if content:
                summary = self.summarizer(content[:2500], max_length=80, min_length=25, do_sample=False)[0]["summary_text"]
                query = f"{base} {summary}"
        emb = self.embedder.encode(query, convert_to_tensor=True)
        scores = self.util.pytorch_cos_sim(emb, self.category_embeddings)[0]
        return self.categories[int(scores.argmax())]

# SmartCleaner

class SmartCleaner:
    def __init__(self, base_path: Path, simulate=False, report=False, ai_mode=False, remove_empty=True):
        self.base_path = base_path
        self.simulate = simulate
        self.report = report
        self.ai_mode = ai_mode
        self.remove_empty = remove_empty

        self.cleaned_data: Dict[str, List[str]] = {}
        self.duplicates_removed = 0
        self.space_saved = 0

        self.ext_map = self._default_map()
        self.hash_cache = {}
        self._setup_logging()

        if ai_mode:
            self.ai = SmartClassifier()

        console.print(f"[cyan]🧩 Cleaning Folder:[/cyan] {base_path}")
        console.print(f"[cyan]🧠 AI Mode:[/cyan] {'Enabled' if ai_mode else 'Disabled'}")

    def _setup_logging(self):
        log_dir = Path.home() / "Desktop" / "OrganizationLogs"
        log_dir.mkdir(exist_ok=True)
        self.log_file = log_dir / f"cleanup_{datetime.now():%Y-%m-%d_%H-%M-%S}.log"
        logging.basicConfig(filename=self.log_file, level=logging.INFO, format="%(asctime)s - %(message)s")

    def _default_map(self):
        return {
            ".pdf": "Documents/PDFs", ".docx": "Documents/Word", ".txt": "Documents/Text",
            ".xlsx": "Documents/Sheets", ".csv": "Documents/Sheets",
            ".pptx": "Documents/Presentations", ".mp3": "Music/Songs", ".wav": "Music/Recordings",
            ".jpg": "Images", ".jpeg": "Images", ".png": "Images", ".gif": "Images",
            ".zip": "Archives", ".rar": "Archives", ".7z": "Archives",
            ".mp4": "Videos", ".mov": "Videos", ".avi": "Videos",
            ".py": "Code/Python", ".cpp": "Code/CPP", ".js": "Code/JavaScript"
        }

    def _get_category(self, path: Path) -> str:
        if path.suffix.lower() in self.ext_map:
            return self.ext_map[path.suffix.lower()]
        elif self.ai_mode:
            return self.ai.classify(path.name, path)
        else:
            return "Others"

    def _handle_duplicates(self, path: Path):
        file_hash = hash_file(path)
        if not file_hash:
            return False
        if file_hash in self.hash_cache:
            orig = self.hash_cache[file_hash]
            self.duplicates_removed += 1
            self.space_saved += path.stat().st_size
            if not self.simulate:
                path.unlink()
            logging.info(f"🗑️ Duplicate deleted: {path.name} (duplicate of {orig.name})")
            return True
        else:
            self.hash_cache[file_hash] = path
            return False

    def _move_file(self, path: Path):
        if path.name.startswith("~") or path.name.startswith("."):
            return
        if self._handle_duplicates(path):
            return

        category = self._get_category(path)
        date_folder = datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y/%B")
        dest_folder = self.base_path / category / date_folder
        dest_folder.mkdir(parents=True, exist_ok=True)

        if not self.simulate:
            shutil.move(str(path), str(dest_folder / path.name))

        self.cleaned_data.setdefault(category, []).append(path.name)
        logging.info(f"{path.name} → {category}")

    def clean(self):
        files = [f for f in self.base_path.rglob("*") if f.is_file()]
        with ThreadPoolExecutor(max_workers=8) as ex:
            for _ in track(as_completed([ex.submit(self._move_file, f) for f in files]), total=len(files), description="Cleaning..."):
                pass

        if self.remove_empty:
            self._remove_empty_dirs()

        self._generate_report()

        console.print(f"[green]✅ Cleaning Complete![/green]")
        console.print(f"[yellow]Duplicates removed:[/yellow] {self.duplicates_removed}")
        console.print(f"[yellow]Space saved:[/yellow] {round(self.space_saved / (1024*1024), 2)} MB")
        console.print(f"[dim]Log file saved at {self.log_file}[/dim]")

    def _remove_empty_dirs(self):
        for dirpath, dirnames, filenames in os.walk(self.base_path, topdown=False):
            d = Path(dirpath)
            if not any(d.iterdir()):
                try:
                    d.rmdir()
                    logging.info(f"Removed empty folder: {d}")
                except Exception:
                    pass

    def _generate_report(self):
        if not self.report:
            return
        report_path = Path.home() / "Desktop" / "CleanupReport.html"
        html = [
            "<html><body><h2>Smart Cleanup Report</h2><table border='1' cellpadding='6'>",
            "<tr><th>Category</th><th>Files Moved</th></tr>"
        ]
        for cat, files in self.cleaned_data.items():
            html.append(f"<tr><td>{cat}</td><td>{len(files)}</td></tr>")
        html.append("</table>")
        html.append(f"<p>Duplicates Removed: {self.duplicates_removed}</p>")
        html.append(f"<p>Space Saved: {round(self.space_saved / (1024*1024), 2)} MB</p>")
        html.append("</body></html>")
        report_path.write_text("\n".join(html))
        console.print(f"[blue]📊 HTML report generated at {report_path}[/blue]")


def main():
    parser = argparse.ArgumentParser(description="Smart Folder Cleaner & Organizer")
    parser.add_argument("--path", help="Folder path to clean")
    parser.add_argument("--simulate", action="store_true", help="Run in simulation mode")
    parser.add_argument("--report", action="store_true", help="Generate HTML report")
    parser.add_argument("--ai", action="store_true", help="Enable AI-based classification")
    parser.add_argument("--no-empty", action="store_true", help="Do not remove empty folders")

    args = parser.parse_args()

    if not args.path:
        console.print("[yellow]Enter the folder path to clean (e.g., C:\\Users\\YourName\\Downloads):[/yellow]")
        args.path = input("👉 Folder path: ").strip()

    folder = Path(args.path)
    if not folder.exists():
        console.print(f"[red]Error: Folder not found - {folder}[/red]")
        return

    cleaner = SmartCleaner(
        base_path=folder,
        simulate=args.simulate,
        report=args.report,
        ai_mode=args.ai,
        remove_empty=not args.no_empty
    )
    cleaner.clean()


if __name__ == "__main__":
    main()

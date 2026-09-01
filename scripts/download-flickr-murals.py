#!/usr/bin/env python3
import re
import sys
import urllib.request
from pathlib import Path

BASE_URL = "https://www.flickr.com/groups/belfastwallmurals/pool"
OUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "images" / "flickr-murals"
TARGET_COUNT = 100
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"


def fetch_page(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def find_image_urls(html: str):
    pattern = r"https://live\.staticflickr\.com/\d+/\d+_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)?\.(?:jpg|jpeg|png)"
    return list(dict.fromkeys(re.findall(pattern, html)))


def download_file(url: str, out_path: Path):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as response:
        out_path.write_bytes(response.read())


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    seen = set()
    collected = []

    for page_no in range(1, 11):
        page_url = BASE_URL if page_no == 1 else f"{BASE_URL}/page{page_no}"
        print(f"Fetching {page_url}")
        try:
            html = fetch_page(page_url)
        except Exception as exc:
            print(f"Failed to fetch page {page_no}: {exc}")
            break

        urls = find_image_urls(html)
        print(f"  found {len(urls)} image URLs")

        for url in urls:
            if url in seen:
                continue
            seen.add(url)
            collected.append(url)
            if len(collected) >= TARGET_COUNT:
                break
        if len(collected) >= TARGET_COUNT:
            break

    if not collected:
        print("No Flickr images were found.")
        sys.exit(1)

    downloaded = 0
    for idx, url in enumerate(collected[:TARGET_COUNT], start=1):
        filename = Path(url).name
        out_path = OUT_DIR / filename
        try:
            download_file(url, out_path)
            print(f"[{idx}/{len(collected)}] downloaded {filename}")
            downloaded += 1
        except Exception as exc:
            print(f"Failed to save {url}: {exc}")

    print(f"Downloaded {downloaded} images to {OUT_DIR}")

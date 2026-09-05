# -*- coding: utf-8 -*-
import json
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

with open("channel_video_audit.json", "r", encoding="utf-8") as f:
    vids = json.load(f)

public_vids = [v for v in vids if v["privacy"] == "public"]
print(f"\nTotal Public Videos: {len(public_vids)}")
print("=" * 100)
for v in public_vids:
    print(f"[{v['id']}] Views: {v['views']:>4} | Likes: {v['likes']:>2} | {v['title']}")
print("=" * 100)

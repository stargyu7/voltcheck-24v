# -*- coding: utf-8 -*-
import json
from pathlib import Path
from update_video_hooks import REVAMP_TARGETS

queue_file = Path("shorts_content_queue.json")
with open(queue_file, "r", encoding="utf-8") as f:
    q_data = json.load(f)

revamp_map = {item["id"]: item for item in REVAMP_TARGETS}

updated_count = 0
for entry in q_data["queue"]:
    vid_id = entry.get("video_id")
    if vid_id and vid_id in revamp_map:
        target = revamp_map[vid_id]
        entry["title"] = target["title"]
        entry["description"] = target["description"]
        entry["tags"] = target["tags"]
        updated_count += 1

with open(queue_file, "w", encoding="utf-8") as f:
    json.dump(q_data, f, ensure_ascii=False, indent=2)

print(f"Synced {updated_count} items in shorts_content_queue.json")

# -*- coding: utf-8 -*-
import json
import sys
from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

token_file = Path("youtube_token.json")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"]
creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
youtube = build("youtube", "v3", credentials=creds)

# Get channel upload playlist
channels_res = youtube.channels().list(mine=True, part="contentDetails").execute()
uploads_playlist_id = channels_res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

videos = []
page_token = None
while True:
    playlist_res = youtube.playlistItems().list(
        playlistId=uploads_playlist_id,
        part="snippet,contentDetails",
        maxResults=50,
        pageToken=page_token
    ).execute()
    for item in playlist_res["items"]:
        videos.append(item["contentDetails"]["videoId"])
    page_token = playlist_res.get("nextPageToken")
    if not page_token:
        break

video_records = []
for i in range(0, len(videos), 50):
    batch_ids = videos[i:i+50]
    vid_res = youtube.videos().list(
        id=",".join(batch_ids),
        part="snippet,status,statistics"
    ).execute()
    for v in vid_res["items"]:
        s = v["snippet"]
        st = v["status"]
        stat = v.get("statistics", {})
        video_records.append({
            "id": v["id"],
            "title": s.get("title", ""),
            "privacy": st.get("privacyStatus", ""),
            "views": int(stat.get("viewCount", 0)),
            "likes": int(stat.get("likeCount", 0)),
            "tags": s.get("tags", []),
            "lang": s.get("defaultLanguage", "")
        })

with open("channel_video_audit.json", "w", encoding="utf-8") as f:
    json.dump(video_records, f, ensure_ascii=False, indent=2)

print(f"Audited {len(video_records)} videos. Saved to channel_video_audit.json")

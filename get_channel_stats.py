# -*- coding: utf-8 -*-
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
channels_res = youtube.channels().list(mine=True, part="contentDetails,statistics").execute()
uploads_playlist_id = channels_res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
ch_stat = channels_res["items"][0]["statistics"]
print(f"Channel Stats: Views: {ch_stat.get('viewCount')}, Subs: {ch_stat.get('subscriberCount')}, Videos: {ch_stat.get('videoCount')}")

# Get all videos in uploads playlist
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

print(f"Total videos on channel: {len(videos)}")
print("=" * 115)

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
        views = stat.get("viewCount", "0")
        likes = stat.get("likeCount", "0")
        priv = st.get("privacyStatus", "N/A")
        pub_at = st.get("publishAt", s.get("publishedAt", "N/A"))
        title = s.get("title", "")[:50]
        print(f"[{v['id']}] {priv:<7} | Views: {views:>5} | Likes: {likes:>2} | {pub_at[:16]} | {title}")
print("=" * 115)

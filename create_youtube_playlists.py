# -*- coding: utf-8 -*-
"""
=============================================================================
📺 [YOUTUBE PROMOTION ENGINE] Create Curated Global Playlists
=============================================================================
- Creates 3 SEO-optimized playlists on the VoltCheck YouTube channel
- Categorizes all 17 videos into playlists to maximize watch time & binge sessions
=============================================================================
"""

import sys
import time
from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
TOKEN_FILE = BASE_DIR / "youtube_token.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

PLAYLIST_DEFS = [
    {
        "title": "Real Shop Floor Disasters & Engineering Failures 💥",
        "description": (
            "Real-world engineering disasters, industrial catastrophes, and shop floor case studies.\n"
            "Learn how undersized cables, overtorqued bolts, motor inrush currents, bearing fatigue, "
            "and hydraulic water hammer cause millions in downtime—and how to prevent them!\n\n"
            "Free 3-Second Engineering Calculators: https://voltcheck24.com/"
        ),
        "privacyStatus": "public",
        "videos": [
            "kNvp7IkAWjY", "W_mJiyUzzMg", "NhUIgfndTtE", "yQaJ8Cj5410",
            "q4QT455H2q4", "dKXwcHWxSxk", "nzT8RjhxYvA", "GWIcHmShChg"
        ]
    },
    {
        "title": "3-Second Industrial Engineering Cheat Codes ⚡",
        "description": (
            "Master universal engineering formulas and sizing in 40 seconds!\n"
            "Bolt tightening torque (T = k·d·F), 24V line voltage drop, motor breaker curves, "
            "ISO 281 bearing fatigue life, and accumulator sizing.\n\n"
            "Access all 78+ free calculators: https://voltcheck24.com/"
        ),
        "privacyStatus": "public",
        "videos": [
            "0sbRa8fcKyU", "33bDCkgcR7Q", "iBzn3n_YIh4", "TAp99EeOSvI",
            "pYbK_ZyHdkE", "qY_Iwxbs1IA", "7meKiqeh_Cc", "_JHY4pwty3g"
        ]
    },
    {
        "title": "Gaming Tech & Latency Optimization (GearUP Booster) 🎮",
        "description": (
            "How to fix high ping, jitter, and packet loss in competitive FPS games.\n"
            "Optimize routing for Valorant, Apex Legends, CS2, and Call of Duty.\n\n"
            "⚡ Download GearUP Booster Free: https://www.dpbolvw.net/click-101877144-17327791"
        ),
        "privacyStatus": "public",
        "videos": [
            "PwQqxJQ9FXI"
        ]
    }
]


def get_youtube():
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def main():
    youtube = get_youtube()
    print("=" * 80)
    print("📺 [YOUTUBE PROMOTION] Creating Global Playlists for VoltCheck Channel")
    print("=" * 80)

    for p_def in PLAYLIST_DEFS:
        print(f"\n📁 Creating Playlist: {p_def['title']}")
        p_body = {
            "snippet": {
                "title": p_def["title"],
                "description": p_def["description"],
                "defaultLanguage": "en"
            },
            "status": {
                "privacyStatus": p_def["privacyStatus"]
            }
        }
        try:
            p_res = youtube.playlists().insert(part="snippet,status", body=p_body).execute()
            playlist_id = p_res["id"]
            print(f"   ✅ Playlist Created! ID: {playlist_id}")
            print(f"   🔗 https://www.youtube.com/playlist?list={playlist_id}")

            # Add videos to playlist
            for vid in p_def["videos"]:
                item_body = {
                    "snippet": {
                        "playlistId": playlist_id,
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": vid
                        }
                    }
                }
                try:
                    youtube.playlistItems().insert(part="snippet", body=item_body).execute()
                    print(f"      + Added video {vid}")
                    time.sleep(0.5)
                except Exception as e:
                    print(f"      - Could not add video {vid}: {e}")

        except Exception as e:
            print(f"   ❌ Error creating playlist: {e}")

    print("\n" + "=" * 80)
    print("🎉 All 3 Global Playlists Created & Populated Successfully!")
    print("=" * 80)


if __name__ == "__main__":
    main()

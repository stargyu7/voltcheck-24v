# -*- coding: utf-8 -*-
"""
Test if quota allows uploading the new split-screen video
"""
import sys
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials

token_file = Path("youtube_token.json")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"]
creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
youtube = build("youtube", "v3", credentials=creds)

try:
    # Test a simple lightweight API call
    res = youtube.channels().list(mine=True, part="id").execute()
    print("API Connection Active. Channel ID:", res["items"][0]["id"])
except HttpError as e:
    print("API Error:", e)

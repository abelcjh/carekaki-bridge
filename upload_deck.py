import json, sys
from pathlib import Path
from googleapiclient.http import MediaFileUpload
sys.path.insert(0, '/home/abel/.hermes/skills/productivity/google-workspace/scripts')
from google_api import build_service

pptx = Path(__file__).resolve().parent / 'ReliefKaki_pitch_deck.pptx'
service = build_service('drive', 'v3')
metadata = {
    'name': 'ReliefKaki — SparkX+Change Pitch Deck',
    'mimeType': 'application/vnd.google-apps.presentation',
}
media = MediaFileUpload(str(pptx), mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation', resumable=False)
created = service.files().create(body=metadata, media_body=media, fields='id,name,mimeType,webViewLink,modifiedTime').execute()
# Anyone with link can view; owner/team can copy/edit if shared, but Abel account owns it and can grant edit.
service.permissions().create(fileId=created['id'], body={'type':'anyone','role':'reader'}, fields='id').execute()
created = service.files().get(fileId=created['id'], fields='id,name,mimeType,webViewLink,modifiedTime,owners(displayName,emailAddress)').execute()
print(json.dumps(created, indent=2))

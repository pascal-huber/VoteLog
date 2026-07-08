import base64
import json
import os

token = os.environ["TOKEN"]
parts = token.split(".")

print("parts:", len(parts))

if len(parts) >= 2:
    payload = parts[1]
    payload += "=" * (-len(payload) % 4)
    print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))


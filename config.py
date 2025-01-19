import os

# Flask Secret Key
SECRET_KEY = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# Firebase Service Account
FIREBASE_SERVICE_ACCOUNT = os.getenv('FIREBASE_SERVICE_ACCOUNT', 'keys/firebase_service_account_key.json')
if not FIREBASE_SERVICE_ACCOUNT:
    raise ValueError("FIREBASE_SERVICE_ACCOUNT json not found")
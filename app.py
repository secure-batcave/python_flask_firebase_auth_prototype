from flask import Flask, request, jsonify, render_template
from firebase_admin import credentials, initialize_app, auth

app = Flask(__name__)
app.config.from_object('config')

# Initialize Firebase Admin SDK
cred = credentials.Certificate(app.config['FIREBASE_SERVICE_ACCOUNT'])
initialize_app(cred)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/validate-token', methods=['POST'])
def validate_token():
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"message": "Missing Authorization header"}), 401
    
    try:
        # Extract the token from the "Bearer <token>" format
        id_token = auth_header.split('Bearer ')[1]

        # Verify the token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)

        # Here is the Firebase User ID
        # Recommended to use this for User Account Names (folder)
        uid = decoded_token['uid']

        # Extract individual claims
        #email = decoded_token.get('email')  # User's email
        #email_verified = decoded_token.get('email_verified')  # Is email verified
        #name = decoded_token.get('name')  # User's display name
        #picture = decoded_token.get('picture')  # Profile picture URL
        #auth_time = decoded_token.get('auth_time')  # Authentication time
        #iat = decoded_token.get('iat')  # Issued-at time
        #exp = decoded_token.get('exp')  # Expiration time
        #aud = decoded_token.get('aud')  # Audience (Firebase project ID)
        #iss = decoded_token.get('iss')  # Issuer
        #sign_in_provider = decoded_token.get('firebase', {}).get('sign_in_provider')  # Sign-in provider
        #identities = decoded_token.get('firebase', {}).get('identities')  # User identities (e.g., email, Google)

        # Respond with a success message
        return jsonify({"message": "Token is valid", "uid": uid}), 200
    
    except IndexError:
        return jsonify({"message": "Invalid Authorization header format"}), 401
    except auth.InvalidIdTokenError:
        return jsonify({"message": "Invalid ID token"}), 401
    except auth.ExpiredIdTokenError:
        return jsonify({"message": "Expired ID token"}), 401
    except auth.RevokedIdTokenError:
        return jsonify({"message": "Revoked ID token"}), 401
    except Exception as e:
        return jsonify({"message": "Authentication failed", "error": str(e)}), 401

if __name__ == "__main__":
    app.run(debug=True, port=7650, host="0.0.0.0")
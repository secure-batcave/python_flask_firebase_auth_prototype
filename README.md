# Flask Firebase Auth Prototype

Simple integration of Firebase Auth in Python Flask app.

## Important links for configuration:
https://console.firebase.google.com/<br/>
Authentication -> Sign-in method<br/>
-enables different sign in providers<br/><br/>
Authentication -> Settings -> Authorized domains<br/>
-domains Firebase trusts to send token eg. 127.0.0.1<br/>

https://console.cloud.google.com/<br/>
APIs & Services -> Credentials -> OAuth 2.0 Client IDs (edit project)<br/>
-edit Authorized JavaScript origins and Authorized redirect URIs<br/>
-redirect URI "/auth/handler" is required for Firebase Auth<br/>

## Install
```
cd <project_directory>
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Config
Edit config.py with your Firebase Service Account JSON file path.<br/>
Edit index.js with your firebaseConfig details.<br/>

## Run
    python3 app.py

Then visit:
    http://127.0.0.1:7650

## TODO
1. Add more social sign in providers (only Google is enabled). Requires a code edit as well as config edit in Firebase Console (and likely config edits in other social login providers)
2. Add @require_auth decorator for token validation to protect important endpoints
3. Token Expiry Refresh.
    -ID Tokens are short-lived (default 1 hour). After expiration, the frontend can automatically refresh the token using Firebase’s client SDK:
```javascript
firebase.auth().currentUser.getIdToken(true).then((idToken) => {
    // Send refreshed token to backend
});
```
4. Enable Google Analytics (optional, code exists but is commented out)

## Steps to add additional sign in providers
1. Uncomment the relevant Import
```
import { FacebookAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
```
2. Uncomment the relevant provider in providerMapping
```
// Social login provider mapping
const providerMapping = {
    google: new GoogleAuthProvider(),
    // Uncomment the following when these providers are enabled
    // facebook: new FacebookAuthProvider(),
    // microsoft: new OAuthProvider("microsoft.com"),
    // github: new OAuthProvider("github.com"),
    // apple: new OAuthProvider("apple.com"),
    // twitter: new OAuthProvider("twitter.com"),
    // yahoo: new OAuthProvider("yahoo.com"),
};
```
3. Enable the Button in HTML
```
    <!-- Social Login Buttons -->
    <div id="login-buttons">
        <button id="google-login">Login with Google</button>
        <button id="facebook-login" disabled>Login with Facebook (Coming Soon)</button>
        <button id="microsoft-login" disabled>Login with Microsoft (Coming Soon)</button>
        <button id="github-login" disabled>Login with GitHub (Coming Soon)</button>
        <button id="apple-login" disabled>Login with Apple (Coming Soon)</button>
        <button id="twitter-login" disabled>Login with Twitter (Coming Soon)</button>
        <button id="yahoo-login" disabled>Login with Yahoo (Coming Soon)</button>
    </div>
```
4. Add Provder-Specific Settings (if required)
5. Configure firebase console (and specific social login provider) if needed.
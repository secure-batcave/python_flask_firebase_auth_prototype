// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// This import replaces the above, includes more sign-in providers
// import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    //measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Optional Analytics (uncomment "measurementId" in firebaseConfig when enabling Analytics)
// import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
// const analytics = getAnalytics(app);
// logEvent(analytics, 'login', { method: 'Google' });

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

// Set common provider parameters for optional customization
function configureProvider(providerName) {
    const provider = providerMapping[providerName];

    // Error check
    if (!provider) {
        console.error(`Provider "${providerName}" is not configured.`);
        return null;
    }

    // Example of customizing parameters (can be extended per provider)
    if (providerName === "google" || providerName === "facebook") {
        provider.setCustomParameters({
            prompt: "select_account", // Force account selection
        });
    }

    // Add any additional configurations if needed
    return provider;
}

// Ensure DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Add click handlers for all enabled providers
    ["google", "facebook", "microsoft", "github", "apple", "twitter", "yahoo"].forEach((providerName) => {
        const loginButton = document.getElementById(`${providerName}-login`);
        if (!loginButton) {
            console.error(`Login button for provider "${providerName}" is missing in the DOM.`);
            return;
        }

        loginButton.addEventListener("click", () => {
            const provider = configureProvider(providerName);
            if (!provider) return;

            // Disable the login button to prevent multiple requests
            loginButton.disabled = true;

            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log(`${providerName} User signed in successfully:`, result.user);
                    return result.user.getIdToken(); // Get the ID Token
                })
                .then((idToken) => {
                    // Send the ID Token to the Flask backend for validation
                    fetch("/validate-token", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${idToken}`, // Add the token to the Authorization header
                            "Content-Type": "application/json",   // Optional if sending additional JSON data
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => console.log("Backend response:", data))
                        .catch(console.error);

                    // Update the UI with user details
                    updateUI(auth.currentUser);
                })
                .catch((error) => {
                    console.error(`Error during ${providerName} sign-in:`, error);
                })
                .finally(() => {
                    loginButton.disabled = false; // Re-enable the login button
                });
        });
    });

    // Logout functionality
    const logoutButton = document.getElementById("logout-button");
    if (!logoutButton) {
        console.error("Logout button is missing in the DOM.");
        return;
    }

    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out.");
                updateUI(null); // Clear the UI
            })
            .catch((error) => console.error("Error during sign out:", error));
    });
});

// Function to update the UI based on authentication state
function updateUI(user) {
    const loginButton = document.getElementById("google-login");
    const logoutButton = document.getElementById("logout-button");
    const userInfoDiv = document.getElementById("user-info");

    if (!loginButton || !logoutButton || !userInfoDiv) {
        console.error("Required UI elements are missing from the DOM.");
        return;
    }

    if (user) {
        // User is logged in
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";

        // Display user info
        userInfoDiv.innerHTML = `
            <h2>Welcome, ${user.displayName || "User"}!</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>UID:</strong> ${user.uid}</p>
            <p><strong>Profile Picture:</strong></p>
            <img src="${user.photoURL || ''}" alt="Profile Picture" style="max-width: 100px; border-radius: 50%;">
        `;
    } else {
        // User is logged out
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";

        // Clear user info
        userInfoDiv.innerHTML = "<p>No user logged in</p>";
    }
}
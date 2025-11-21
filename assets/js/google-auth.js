// Google Authentication with State Management
(function () {
    'use strict';

    // State management using localStorage
    const AUTH_STORAGE_KEY = 'google_auth_user';

    // Save user data to localStorage
    function saveUserData(userData) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    }

    // Get user data from localStorage
    function getUserData() {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    // Clear user data from localStorage
    function clearUserData() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    // Update UI based on authentication state
    function updateAuthUI(userData) {
        const loginBtn = document.getElementById('google-login-btn');
        const profileContainer = document.getElementById('user-profile');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');

        if (!loginBtn || !profileContainer) {
            console.warn('Auth UI elements not found on this page');
            return;
        }

        if (userData) {
            // User is logged in
            loginBtn.style.display = 'none';
            profileContainer.style.display = 'flex';
            if (userAvatar) userAvatar.src = userData.picture;
            if (userName) userName.textContent = userData.name;
        } else {
            // User is logged out
            loginBtn.style.display = 'block';
            profileContainer.style.display = 'none';
        }
    }

    // Decode JWT token
    function decodeJwtResponse(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    // Handle Google Sign-In response
    window.handleCredentialResponse = function (response) {
        const responsePayload = decodeJwtResponse(response.credential);

        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Given Name: ' + responsePayload.given_name);
        console.log('Family Name: ' + responsePayload.family_name);
        console.log("Image URL: " + responsePayload.picture);
        console.log("Email: " + responsePayload.email);

        // Save user data
        const userData = {
            id: responsePayload.sub,
            name: responsePayload.name,
            givenName: responsePayload.given_name,
            familyName: responsePayload.family_name,
            picture: responsePayload.picture,
            email: responsePayload.email
        };

        saveUserData(userData);
        updateAuthUI(userData);
    };

    // Sign out function
    window.signOut = function () {
        clearUserData();
        updateAuthUI(null);
        // Optionally reload the page
        window.location.reload();
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function () {
        // Check if user is already logged in
        const userData = getUserData();
        updateAuthUI(userData);

        // Add click handler for sign out if profile is present
        const profileContainer = document.getElementById('user-profile');
        if (profileContainer) {
            profileContainer.onclick = function (e) {
                if (confirm('Do you want to sign out?')) {
                    signOut();
                }
            };
            profileContainer.style.cursor = 'pointer';
            profileContainer.title = 'Click to sign out';
        }
    });
})();

// Authentication handlers for different providers

/**
 * Google Sign-In
 * You'll need to include the Google Identity Services library and configure your client ID
 */
async function signInWithGoogle() {
    const button = event.target;
    setLoadingState(button, true);
    
    try {
        // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google Client ID
        // First, load the Google Identity Services library if not already loaded
        if (!window.google) {
            await loadGoogleIdentityServices();
        }
        
        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
            callback: handleGoogleSignIn
        });
        
        // Prompt the user to sign in
        google.accounts.id.prompt();
        
    } catch (error) {
        console.error('Google Sign-In error:', error);
        showError('Failed to sign in with Google. Please try again.');
    } finally {
        setLoadingState(button, false);
    }
}

/**
 * Apple Sign-In
 * You'll need to configure Apple Sign-In and include the Apple JS SDK
 */
async function signInWithApple() {
    const button = event.target;
    setLoadingState(button, true);
    
    try {
        // Replace with your Apple Sign-In configuration
        if (!window.AppleID) {
            await loadAppleSignInSDK();
        }
        
        const response = await AppleID.auth.signIn({
            clientId: 'YOUR_APPLE_CLIENT_ID',
            redirectURI: 'YOUR_REDIRECT_URI',
            scope: 'name email',
            responseType: 'code',
            responseMode: 'web_message',
            usePopup: true
        });
        
        handleAppleSignIn(response);
        
    } catch (error) {
        console.error('Apple Sign-In error:', error);
        showError('Failed to sign in with Apple. Please try again.');
    } finally {
        setLoadingState(button, false);
    }
}

/**
 * Microsoft Sign-In using MSAL.js
 * You'll need to include the Microsoft Authentication Library (MSAL)
 */
async function signInWithMicrosoft() {
    const button = event.target;
    setLoadingState(button, true);
    
    try {
        // Initialize MSAL if not already done
        if (!window.msalInstance) {
            await initializeMSAL();
        }
        
        const loginRequest = {
            scopes: ['openid', 'profile', 'email']
        };
        
        const response = await window.msalInstance.loginPopup(loginRequest);
        handleMicrosoftSignIn(response);
        
    } catch (error) {
        console.error('Microsoft Sign-In error:', error);
        showError('Failed to sign in with Microsoft. Please try again.');
    } finally {
        setLoadingState(button, false);
    }
}

// Callback handlers
function handleGoogleSignIn(response) {
    console.log('Google Sign-In successful:', response);
    
    // Decode the JWT token to get user information
    const userInfo = parseJwt(response.credential);
    console.log('User info:', userInfo);
    
    // Send the token to your backend for verification
    authenticateUser('google', response.credential);
}

function handleAppleSignIn(response) {
    console.log('Apple Sign-In successful:', response);
    
    // Process the Apple Sign-In response
    authenticateUser('apple', response.authorization.code);
}

function handleMicrosoftSignIn(response) {
    console.log('Microsoft Sign-In successful:', response);
    
    // Process the Microsoft Sign-In response
    authenticateUser('microsoft', response.accessToken);
}

// Utility functions
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function showError(message) {
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee2e2;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-size: 14px;
        border: 1px solid #fecaca;
    `;
    errorDiv.textContent = message;
    
    const authCard = document.querySelector('.auth-card');
    const existingError = authCard.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    authCard.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

// SDK Loaders
async function loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function loadAppleSignInSDK() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initializeMSAL() {
    // Load MSAL library if not already loaded
    if (!window.msal) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://alcdn.msauth.net/browser/2.32.2/js/msal-browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Initialize MSAL instance
    const msalConfig = {
        auth: {
            clientId: 'YOUR_MICROSOFT_CLIENT_ID', // Replace with your Microsoft App ID
            authority: 'https://login.microsoftonline.com/common',
            redirectUri: window.location.origin
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false
        }
    };
    
    window.msalInstance = new msal.PublicClientApplication(msalConfig);
    await window.msalInstance.initialize();
}

// Backend authentication
async function authenticateUser(provider, token) {
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider: provider,
                token: token
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Authentication successful:', result);
            
            // Redirect to dashboard or home page
            window.location.href = '/dashboard';
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showError('Authentication failed. Please try again.');
    }
}

// Email form handler
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.querySelector('.email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            if (email) {
                handleEmailSignIn(email);
            }
        });
    }
});

async function handleEmailSignIn(email) {
    const submitButton = document.querySelector('.email-form .primary-btn');
    setLoadingState(submitButton, true);
    
    try {
        const response = await fetch('/api/auth/email-signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        if (response.ok) {
            // Show success message
            showSuccess('Check your email for a sign-in link!');
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Email sign-in error:', error);
        showError('Failed to send sign-in email. Please try again.');
    } finally {
        setLoadingState(submitButton, false);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #dcfce7;
        color: #166534;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-size: 14px;
        border: 1px solid #bbf7d0;
    `;
    successDiv.textContent = message;
    
    const authCard = document.querySelector('.auth-card');
    const existingMessage = authCard.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    authCard.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

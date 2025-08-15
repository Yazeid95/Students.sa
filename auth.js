// Authentication handlers for different providers

// Theme and Language Toggle Functions
function toggleTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    }
}

function toggleLanguage() {
    const body = document.body;
    const langText = document.getElementById('langText');
    const isArabic = body.classList.contains('rtl');
    
    if (isArabic) {
        // Switch to English
        body.classList.remove('rtl');
        langText.textContent = 'ع';
        updateContentToEnglish();
        localStorage.setItem('language', 'en');
    } else {
        // Switch to Arabic
        body.classList.add('rtl');
        langText.textContent = 'EN';
        updateContentToArabic();
        localStorage.setItem('language', 'ar');
    }
}

function updateContentToArabic() {
    // Update page content to Arabic
    document.querySelector('.logo').textContent = 'طلاب.السعودية';
    document.querySelector('.subtitle').textContent = 'أهلاً بعودتك! يرجى تسجيل الدخول للمتابعة';
    
    // Update buttons
    document.querySelector('.google-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        متابعة مع جوجل
    `;
    
    document.querySelector('.apple-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        متابعة مع آبل
    `;
    
    document.querySelector('.microsoft-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#F25022" d="M1 1h10v10H1z"/>
            <path fill="#00A4EF" d="M13 1h10v10H13z"/>
            <path fill="#7FBA00" d="M1 13h10v10H1z"/>
            <path fill="#FFB900" d="M13 13h10v10H13z"/>
        </svg>
        متابعة مع مايكروسوفت
    `;
    
    document.querySelector('.primary-btn').textContent = 'متابعة بالبريد الإلكتروني';
    
    // Update form elements
    document.querySelector('label[for="email"]').textContent = 'عنوان البريد الإلكتروني';
    document.getElementById('email').placeholder = 'أدخل بريدك الإلكتروني';
    
    // Update divider
    document.querySelector('.divider span').textContent = 'أو';
    
    // Update terms
    document.querySelector('.terms').innerHTML = `
        بالمتابعة، فإنك توافق على 
        <a href="#" class="link">شروط الخدمة</a> و 
        <a href="#" class="link">سياسة الخصوصية</a>
    `;
    
    // Update pass button
    const passBtn = document.querySelector('.pass-btn');
    if (passBtn) {
        passBtn.innerHTML = `
            <span class="pass-text">الانتقال لاختيار الكلية</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        `;
    }
}

function updateContentToEnglish() {
    // Update page content to English
    document.querySelector('.logo').textContent = 'Students.sa';
    document.querySelector('.subtitle').textContent = 'Welcome back! Please sign in to continue';
    
    // Update buttons
    document.querySelector('.google-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
    `;
    
    document.querySelector('.apple-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Continue with Apple
    `;
    
    document.querySelector('.microsoft-btn').innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#F25022" d="M1 1h10v10H1z"/>
            <path fill="#00A4EF" d="M13 1h10v10H13z"/>
            <path fill="#7FBA00" d="M1 13h10v10H1z"/>
            <path fill="#FFB900" d="M13 13h10v10H13z"/>
        </svg>
        Continue with Microsoft
    `;
    
    document.querySelector('.primary-btn').textContent = 'Continue with Email';
    
    // Update form elements
    document.querySelector('label[for="email"]').textContent = 'Email address';
    document.getElementById('email').placeholder = '';
    
    // Update divider
    document.querySelector('.divider span').textContent = 'or';
    
    // Update terms
    document.querySelector('.terms').innerHTML = `
        By continuing, you agree to our 
        <a href="#" class="link">Terms of Service</a> and 
        <a href="#" class="link">Privacy Policy</a>
    `;
    
    // Update pass button
    const passBtn = document.querySelector('.pass-btn');
    if (passBtn) {
        passBtn.innerHTML = `
            <span class="pass-text">Skip to College Selection</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
        `;
    }
}

// Initialize theme and language from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.sun-icon').style.display = 'none';
        document.querySelector('.moon-icon').style.display = 'block';
    }
    
    // Initialize language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'ar') {
        document.body.classList.add('rtl');
        document.getElementById('langText').textContent = 'EN';
        updateContentToArabic();
    }
    
    // Email form handler
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

/**
 * Google Sign-In
 * You'll need to include the Google Identity Services library and configure your client ID
 */
async function signInWithGoogle(event) {
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
async function signInWithApple(event) {
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
async function signInWithMicrosoft(event) {
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
        background: #4c1d1d;
        color: #f87171;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-size: 14px;
        border: 1px solid #7f1d1d;
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
        background: #051f12;
        color: #d4af37;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 16px 0;
        font-size: 14px;
        border: 1px solid #0d2818;
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

// Navigation function for pass button
function goToCollegeSelection() {
    window.location.href = 'college-selection.html';
}

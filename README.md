# Students.sa - Authentication Page

A modern, responsive sign-in page with support for Google, Apple, and Microsoft authentication providers.

## Features

- 🔐 Multiple authentication providers (Google, Apple, Microsoft)
- 📧 Email-based authentication option
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- ⚡ Fast loading and optimized performance
- 🔒 Secure authentication flow

## Setup Instructions

### 1. Configure Authentication Providers

Before using the authentication features, you need to set up your OAuth applications with each provider and update the configuration.

#### Google Sign-In Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create a new OAuth 2.0 Client ID
5. Add your domain to authorized origins
6. Replace `YOUR_GOOGLE_CLIENT_ID` in `auth.js` with your actual client ID

#### Apple Sign-In Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a new App ID with Sign In with Apple capability
3. Create a Services ID for web authentication
4. Configure your domain and redirect URLs
5. Replace `YOUR_APPLE_CLIENT_ID` and `YOUR_REDIRECT_URI` in `auth.js`

#### Microsoft Sign-In Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure Active Directory
3. Configure redirect URIs for your domain
4. Note down the Application (client) ID
5. Replace `YOUR_MICROSOFT_CLIENT_ID` in `auth.js`

### 2. Backend Integration

The frontend sends authentication tokens to `/api/auth/signin` and `/api/auth/email-signin` endpoints. You'll need to implement these endpoints in your backend to:

1. Verify the authentication tokens
2. Create user sessions
3. Handle user registration/login
4. Return appropriate responses

### 3. Update Configuration

Update the following placeholders in `auth.js`:

```javascript
// Google
client_id: 'YOUR_GOOGLE_CLIENT_ID'

// Apple
clientId: 'YOUR_APPLE_CLIENT_ID',
redirectURI: 'YOUR_REDIRECT_URI'

// Microsoft
clientId: 'YOUR_MICROSOFT_CLIENT_ID'
```

### 4. Test Locally

1. Open `index.html` in a web browser
2. Test each authentication method
3. Ensure proper error handling and user feedback

## File Structure

```
Students.sa/
├── index.html          # Main HTML file with authentication UI
├── styles.css          # CSS styling for the page
├── auth.js            # JavaScript for handling authentication
└── README.md          # This file
```

## Customization

### Styling

The page uses modern CSS with:

- CSS Grid and Flexbox for layout
- CSS custom properties for consistent theming
- Responsive design breakpoints
- Smooth animations and transitions

You can customize colors, fonts, and spacing by modifying the CSS variables in `styles.css`.

### Branding

Update the logo and branding by modifying:

- Page title in `index.html`
- Logo text in the `.logo` class
- Color scheme in `styles.css`
- Favicon (add your own favicon.ico)

### Authentication Flow

Modify the authentication handlers in `auth.js` to match your backend API endpoints and response formats.

## Security Considerations

1. **HTTPS Required**: All OAuth providers require HTTPS in production
2. **Token Validation**: Always validate tokens on your backend
3. **CORS Configuration**: Properly configure CORS for your API endpoints
4. **Client ID Security**: Keep client IDs secure but note they're not secret
5. **State Parameter**: Consider implementing CSRF protection with state parameters

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Development

To modify and extend this authentication page:

1. **HTML Structure**: Modify `index.html` for layout changes
2. **Styling**: Update `styles.css` for visual changes
3. **Functionality**: Extend `auth.js` for additional providers or features

## Production Deployment

1. Ensure all placeholder values are replaced with actual configuration
2. Test authentication flow in production environment
3. Configure proper error logging and monitoring
4. Set up analytics to track authentication success/failure rates

## Support

For issues related to specific OAuth providers, consult their documentation:

- [Google Identity Platform](https://developers.google.com/identity)
- [Apple Sign-In](https://developer.apple.com/sign-in-with-apple/)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

## License

This project is open source and available under the MIT License.

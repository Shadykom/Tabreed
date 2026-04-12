/**
 * Azure AD / MSAL Configuration for Saudi Tabreed Portal
 *
 * To configure SSO with your Azure Active Directory:
 *
 * 1. Go to Azure Portal → Azure Active Directory → App Registrations
 * 2. Create new registration:
 *    - Name: "Saudi Tabreed Portal"
 *    - Supported account types: "Accounts in this organizational directory only"
 *    - Redirect URI: "http://localhost:5173" (add your production URL too)
 * 3. Copy the Application (client) ID and Directory (tenant) ID
 * 4. Under Authentication → Add platform → Single-page application
 *    - Redirect URI: http://localhost:5173
 *    - Check: Access tokens, ID tokens
 * 5. Under API permissions → Add: Microsoft Graph → User.Read
 * 6. Paste the IDs below
 */

export const msalConfig = {
  auth: {
    // ⚠️ REPLACE these with your real Azure AD values
    clientId: 'YOUR_CLIENT_ID_HERE', // Application (client) ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE', // Directory (tenant) ID
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
};

// Check if Azure AD is configured (not placeholder values)
export const isAzureADConfigured = (): boolean => {
  return (
    msalConfig.auth.clientId !== 'YOUR_CLIENT_ID_HERE' &&
    !msalConfig.auth.authority.includes('YOUR_TENANT_ID_HERE')
  );
};

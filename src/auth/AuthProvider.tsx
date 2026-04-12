/**
 * Authentication Provider
 *
 * Supports two modes:
 * 1. Azure AD SSO (when configured) - uses MSAL
 * 2. Local JWT auth (fallback) - uses email/password
 */

import { useState, useEffect, type ReactNode } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig, isAzureADConfigured } from './msalConfig';
import { AuthContext, type AuthUser } from './authContextDef';

let msalInstance: PublicClientApplication | null = null;

if (isAzureADConfigured()) {
  msalInstance = new PublicClientApplication(msalConfig);
}

async function fetchGraphProfile(accessToken: string): Promise<Partial<AuthUser>> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const profileRes = await fetch(graphConfig.graphMeEndpoint, { headers });
  const profile = await profileRes.json();

  let avatar = '';
  try {
    const photoRes = await fetch(graphConfig.graphPhotoEndpoint, { headers });
    if (photoRes.ok) {
      const blob = await photoRes.blob();
      avatar = URL.createObjectURL(blob);
    }
  } catch { /* no photo */ }

  return {
    id: profile.id,
    name: profile.displayName || '',
    email: profile.mail || profile.userPrincipalName || '',
    avatar,
    department: profile.department || '',
    title: profile.jobTitle || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAzureAD = isAzureADConfigured();

  // Check existing session on mount
  useEffect(() => {
    async function checkAuth() {
      if (isAzureAD && msalInstance) {
        try {
          await msalInstance.initialize();
          const response = await msalInstance.handleRedirectPromise();
          if (response) {
            const profile = await fetchGraphProfile(response.accessToken);
            setUser({
              ...profile,
              role: 'user',
              authMethod: 'azure-ad',
            } as AuthUser);
          } else {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              const tokenResponse = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });
              const profile = await fetchGraphProfile(tokenResponse.accessToken);
              setUser({
                ...profile,
                role: 'user',
                authMethod: 'azure-ad',
              } as AuthUser);
            }
          }
        } catch {
          // Silent failure - user needs to login
        }
      } else {
        // Local auth - check localStorage
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
          try {
            setUser({ ...JSON.parse(savedUser), authMethod: 'local' });
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [isAzureAD]);

  const login = async (email?: string, password?: string) => {
    if (isAzureAD && msalInstance) {
      // Azure AD login
      await msalInstance.loginRedirect(loginRequest);
    } else {
      // Local JWT login
      if (!email || !password) throw new Error('Email and password required');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ ...data.user, authMethod: 'local' });
    }
  };

  const logout = () => {
    if (isAzureAD && msalInstance) {
      msalInstance.logoutRedirect();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userAvatar');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const getToken = (): string | null => {
    if (isAzureAD && msalInstance) {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        // Token is managed by MSAL
        return 'azure-ad-managed';
      }
      return null;
    }
    return localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAzureAD,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook moved to hooks/useAuth.ts for fast-refresh compatibility

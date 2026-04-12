import { createContext } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'user';
  department: string;
  title: string;
  authMethod: 'azure-ad' | 'local';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAzureAD: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

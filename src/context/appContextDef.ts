import { createContext } from 'react';
import type { CurrentUser } from '../types';

export interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  language: string;
  toggleLanguage: () => void;
  isRTL: boolean;
  user: CurrentUser;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

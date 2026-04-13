import { useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { CurrentUser } from '../types';
import { AppContext } from './appContextDef';

const defaultUser: CurrentUser = {
  id: 1,
  name: 'Ahmed Al-Qahtani',
  nameAr: 'أحمد القحطاني',
  title: 'IT Department',
  titleAr: 'قسم تقنية المعلومات',
  department: 'IT',
  avatar: '',
};

function getStoredUser(): CurrentUser {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return { ...defaultUser, ...parsed };
    }
  } catch { /* ignore */ }
  return defaultUser;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [currentUser, setCurrentUser] = useState<CurrentUser>(getStoredUser);

  const isRTL = language === 'ar';

  // Load user profile from database on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            const user = {
              id: data.id || defaultUser.id,
              name: data.name || defaultUser.name,
              nameAr: data.nameAr || defaultUser.nameAr,
              title: data.title || defaultUser.title,
              titleAr: data.titleAr || defaultUser.titleAr,
              department: data.department || defaultUser.department,
              avatar: data.avatar || '',
            };
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const setUserAvatar = (url: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: url }));
    // Also update in localStorage as cache
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        parsed.avatar = url;
        localStorage.setItem('user', JSON.stringify(parsed));
      } catch { /* ignore */ }
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        language,
        toggleLanguage,
        isRTL,
        user: currentUser,
        setUserAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

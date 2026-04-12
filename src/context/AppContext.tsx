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

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState(i18n.language || 'en');

  const isRTL = language === 'ar';

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

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        language,
        toggleLanguage,
        isRTL,
        user: defaultUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

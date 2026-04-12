import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import {
  Home, Building2, FileText, LayoutGrid, Settings,
  UserCircle, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

const navItems = [
  { id: 'home', labelKey: 'nav.home', icon: Home, path: '/', notif: 0 },
  { id: 'departments', labelKey: 'nav.departments', icon: Building2, path: '/departments', notif: 0 },
  { id: 'policies', labelKey: 'nav.policies', icon: FileText, path: '/policies', notif: 3 },
  { id: 'applications', labelKey: 'nav.applications', icon: LayoutGrid, path: '/applications', notif: 0 },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings, path: '/settings', notif: 0 },
  { id: 'userAccount', labelKey: 'nav.userAccount', icon: UserCircle, path: '/account', notif: 0 },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, toggleSidebar, user, isRTL } = useApp();

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.collapsed}`}>
        <div className={styles.logoSection}>
          <svg className={styles.logoIcon} viewBox="0 0 40 44" fill="none">
            {/* ST Logo Mark - matching real Saudi Tabreed brand */}
            <path d="M2,30 C2,30 2,19 10,13 C18,7 22,12 22,18 C22,24 14,26 10,30 C6,34 2,36 2,42 L22,42"
              fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
            <line x1="24" y1="4" x2="40" y2="4" stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0.95"/>
            <line x1="32" y1="4" x2="32" y2="42" stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0.95"/>
            <rect x="36" y="0" width="6" height="6" rx="1" fill="#2EC4B6"/>
          </svg>
          <div className={styles.logoText}>
            <span className={styles.logoName}>{t('app.name')}</span>
            <span className={styles.logoSubtitle}>{t('app.subtitle')}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <Icon className={styles.navIcon} size={20} />
                <span className={styles.navLabel}>{t(item.labelKey)}</span>
                {item.notif > 0 && (
                  <span className={styles.notifCount}>{item.notif}</span>
                )}
              </button>
            );
          })}
        </nav>

        <button className={styles.collapseBtn} onClick={toggleSidebar}>
          {sidebarOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          {sidebarOpen && <span>Collapse</span>}
        </button>

        <div className={styles.userSection}>
          <div className={`${styles.userAvatar} ${styles.onlineDot}`}>{initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{isRTL ? user.nameAr : user.name}</span>
            <span className={styles.userTitle}>{isRTL ? user.titleAr : user.title}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

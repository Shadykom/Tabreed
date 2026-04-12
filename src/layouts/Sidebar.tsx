import { useTranslation } from 'react-i18next';
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
          <svg className={styles.logoIcon} viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#88BBFF" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <path d="M20 2l5 8h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z" fill="url(#logoGrad)" opacity="0.95" />
            <circle cx="20" cy="20" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
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
            const isActive = item.id === 'home';
            return (
              <a
                key={item.id}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <Icon className={styles.navIcon} size={20} />
                <span className={styles.navLabel}>{t(item.labelKey)}</span>
                {item.notif > 0 && (
                  <span className={styles.notifCount}>{item.notif}</span>
                )}
              </a>
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

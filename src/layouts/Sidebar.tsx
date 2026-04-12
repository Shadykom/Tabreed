import { useTranslation } from 'react-i18next';
import { useApp } from '../hooks/useApp';
import {
  Home,
  Building2,
  FileText,
  LayoutGrid,
  Settings,
  UserCircle,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

const navItems = [
  { id: 'home', labelKey: 'nav.home', icon: Home, path: '/' },
  { id: 'departments', labelKey: 'nav.departments', icon: Building2, path: '/departments' },
  { id: 'policies', labelKey: 'nav.policies', icon: FileText, path: '/policies' },
  { id: 'applications', labelKey: 'nav.applications', icon: LayoutGrid, path: '/applications' },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings, path: '/settings' },
  { id: 'userAccount', labelKey: 'nav.userAccount', icon: UserCircle, path: '/account' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen, user, isRTL } = useApp();

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.collapsed}`}
      >
        <div className={styles.logoSection}>
          <svg className={styles.logoIcon} viewBox="0 0 36 36" fill="none">
            <path
              d="M18 2l4 7h8l-6 5 3 8-9-6-9 6 3-8-6-5h8z"
              fill="rgba(255,255,255,0.9)"
            />
            <circle cx="18" cy="18" r="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
          </svg>
          <div className={styles.logo}>
            <span>{t('app.name')}</span>
            <span>{t('app.subtitle')}</span>
          </div>
        </div>

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
              </a>
            );
          })}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {isRTL ? user.nameAr : user.name}
            </span>
            <span className={styles.userTitle}>
              {isRTL ? user.titleAr : user.title}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

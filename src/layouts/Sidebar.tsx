import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import {
  Home, Building2, FileText, LayoutGrid, Settings,
  UserCircle, ChevronsLeft, ChevronsRight,
  Headphones, DoorOpen,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

const navItems = [
  { id: 'home', labelKey: 'nav.home', icon: Home, path: '/', notif: 0 },
  { id: 'departments', labelKey: 'nav.departments', icon: Building2, path: '/departments', notif: 0 },
  { id: 'policies', labelKey: 'nav.policies', icon: FileText, path: '/policies', notif: 3 },
  { id: 'applications', labelKey: 'nav.applications', icon: LayoutGrid, path: '/applications', notif: 0 },
  { id: 'services', labelKey: 'nav.services', icon: Headphones, path: '/services', notif: 0 },
  { id: 'rooms', labelKey: 'nav.rooms', icon: DoorOpen, path: '/rooms', notif: 0 },
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
          <img className={styles.logoIcon} src="/images/logo.png" alt="Saudi Tabreed" />
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
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={`${styles.userAvatarImg} ${styles.onlineDot}`} />
          ) : (
            <div className={`${styles.userAvatar} ${styles.onlineDot}`}>{initials}</div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.userName}>{isRTL ? user.nameAr : user.name}</span>
            <span className={styles.userTitle}>{isRTL ? user.titleAr : user.title}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

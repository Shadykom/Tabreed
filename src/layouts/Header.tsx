import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../hooks/useApp';
import {
  Menu, Search, ChevronDown, Bell, User, Settings,
  LogOut, HelpCircle, Globe,
} from 'lucide-react';
import styles from './Header.module.scss';

const notifications = [
  { id: 1, text: 'New comment on your report', time: '5 min ago', read: false },
  { id: 2, text: 'Meeting rescheduled to 3 PM', time: '1 hour ago', read: false },
  { id: 3, text: 'System update completed successfully', time: '2 hours ago', read: true },
  { id: 4, text: 'Leave request has been approved', time: 'Yesterday', read: true },
];

export default function Header() {
  const { t } = useTranslation();
  const { toggleSidebar, toggleLanguage, user, isRTL } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      <div className={styles.breadcrumb}>{t('nav.home')}</div>

      <button className={styles.appSelector}>
        <Globe size={14} />
        <span>{t('app.oneTeamApp')}</span>
        <ChevronDown size={13} />
      </button>

      <div className={styles.spacer} />

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={16} />
        <input type="text" className={styles.searchInput} placeholder={t('header.search')} />
      </div>

      <div className={styles.headerActions}>
        <button className={styles.langToggle} onClick={toggleLanguage}>
          {t('header.language')}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className={styles.iconButton} onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.notifBadge} />}
          </button>

          {showNotif && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifTitle}>
                <span>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div className={styles.notifList}>
                {notifications.map((n) => (
                  <div key={n.id} className={styles.notifItem}>
                    <div className={n.read ? styles.notifDotRead : styles.notifDot} />
                    <div style={{ flex: 1 }}>
                      <div className={styles.notifText}>{n.text}</div>
                    </div>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                ))}
              </div>
              <div className={styles.notifFooter}>
                <button className={styles.notifFooterBtn}>View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.dividerV} />

        {/* Profile dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button className={styles.userProfile} onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{isRTL ? user.nameAr : user.name}</span>
              <span className={styles.userRole}>{isRTL ? user.titleAr : user.title}</span>
            </div>
            <ChevronDown size={14} className={styles.chevron} />
          </button>

          {showProfile && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>{initials}</div>
                <div className={styles.dropdownUserInfo}>
                  <div className={styles.dropdownName}>{isRTL ? user.nameAr : user.name}</div>
                  <div className={styles.dropdownEmail}>ahmed.qahtani@tabreed.com</div>
                </div>
              </div>
              <div className={styles.dropdownItems}>
                <button className={styles.dropdownItem}><User size={16} /> My Profile</button>
                <button className={styles.dropdownItem}><Settings size={16} /> Account Settings</button>
                <button className={styles.dropdownItem}><HelpCircle size={16} /> Help & Support</button>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItemDanger}><LogOut size={16} /> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

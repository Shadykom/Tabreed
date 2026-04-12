import { useTranslation } from 'react-i18next';
import { useApp } from '../hooks/useApp';
import { Menu, Search, ChevronDown } from 'lucide-react';
import styles from './Header.module.scss';

export default function Header() {
  const { t } = useTranslation();
  const { toggleSidebar, toggleLanguage, user, isRTL } = useApp();

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      <div className={styles.breadcrumb}>
        {t('nav.home')}
      </div>

      <div className={styles.appSelector}>
        <span>{t('app.oneTeamApp')}</span>
        <ChevronDown size={14} />
      </div>

      <div className={styles.spacer} />

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={16} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('header.search')}
        />
      </div>

      <div className={styles.headerActions}>
        <button className={styles.langToggle} onClick={toggleLanguage}>
          {t('header.language')}
        </button>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>{initials}</div>
          <div>
            <div className={styles.userName}>
              {isRTL ? user.nameAr : user.name}
            </div>
            <div className={styles.userRole}>
              {isRTL ? user.titleAr : user.title}
            </div>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}

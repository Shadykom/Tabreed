import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User, Bell, Globe, Sun, Moon, Info,
  ChevronRight, Check,
} from 'lucide-react';
import Card from '../components/common/Card';
import { useApp } from '../hooks/useApp';
import styles from './SettingsPage.module.scss';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleText}>
        <span className={styles.toggleLabel}>{label}</span>
        {description && (
          <span className={styles.toggleDesc}>{description}</span>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={onChange}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, language, toggleLanguage } = useApp();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    announcements: true,
    meetings: false,
    news: true,
    reports: false,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    if (i18n.language !== lang) {
      toggleLanguage();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('nav.settings')}</h1>
        <p className={styles.pageSubtitle}>
          Manage your portal preferences and account settings.
        </p>
      </div>

      <div className={styles.settingsLayout}>
        {/* Left Column */}
        <div className={styles.settingsCol}>

          {/* Profile Settings */}
          <Card title="Profile Settings" className={styles.settingsCard}>
            <div className={styles.sectionIcon} style={{ background: '#E8F0FE', color: '#1B3A6B' }}>
              <User size={20} />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Full Name</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  defaultValue={user.name}
                  readOnly
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Employee ID</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  defaultValue={`EMP-${String(user.id).padStart(4, '0')}`}
                  readOnly
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  className={styles.fieldInput}
                  type="email"
                  defaultValue={`${user.name.toLowerCase().replace(' ', '.')}@tabreed.sa`}
                  readOnly
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Phone</label>
                <input
                  className={styles.fieldInput}
                  type="tel"
                  defaultValue="+966 50 000 0001"
                  readOnly
                />
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.fieldLabel}>Department</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  defaultValue={user.department}
                  readOnly
                />
              </div>
            </div>
            <div className={styles.readonlyNote}>
              <Info size={13} />
              Profile information is managed by HR. Contact <strong>hr@tabreed.sa</strong> to request changes.
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card title="Notification Preferences" className={styles.settingsCard}>
            <div className={styles.sectionIcon} style={{ background: '#FEF3C7', color: '#F59E0B' }}>
              <Bell size={20} />
            </div>
            <div className={styles.toggleList}>
              <Toggle
                checked={notifications.email}
                onChange={() => toggle('email')}
                label="Email Notifications"
                description="Receive updates via your work email"
              />
              <Toggle
                checked={notifications.push}
                onChange={() => toggle('push')}
                label="Push Notifications"
                description="Browser push notifications for urgent alerts"
              />
              <Toggle
                checked={notifications.announcements}
                onChange={() => toggle('announcements')}
                label="New Announcements"
                description="Alerts when a new announcement is posted"
              />
              <Toggle
                checked={notifications.meetings}
                onChange={() => toggle('meetings')}
                label="Meeting Reminders"
                description="Reminders 15 minutes before meetings"
              />
              <Toggle
                checked={notifications.news}
                onChange={() => toggle('news')}
                label="News & Updates"
                description="Weekly digest of company news"
              />
              <Toggle
                checked={notifications.reports}
                onChange={() => toggle('reports')}
                label="Report Deadlines"
                description="Reminder notifications for report submissions"
              />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className={styles.settingsCol}>

          {/* Language Preference */}
          <Card title="Language Preference" className={styles.settingsCard}>
            <div className={styles.sectionIcon} style={{ background: '#CCFBF1', color: '#14B8A6' }}>
              <Globe size={20} />
            </div>
            <p className={styles.sectionDesc}>
              Choose your preferred portal language. The interface will update immediately.
            </p>
            <div className={styles.langOptions}>
              <button
                className={`${styles.langOption} ${language === 'en' ? styles.langActive : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                <span className={styles.langFlag}>🇬🇧</span>
                <div className={styles.langText}>
                  <span className={styles.langName}>English</span>
                  <span className={styles.langNative}>English</span>
                </div>
                {language === 'en' && (
                  <span className={styles.langCheck}>
                    <Check size={14} />
                  </span>
                )}
              </button>
              <button
                className={`${styles.langOption} ${language === 'ar' ? styles.langActive : ''}`}
                onClick={() => handleLanguageChange('ar')}
              >
                <span className={styles.langFlag}>🇸🇦</span>
                <div className={styles.langText}>
                  <span className={styles.langName}>Arabic</span>
                  <span className={styles.langNative}>العربية</span>
                </div>
                {language === 'ar' && (
                  <span className={styles.langCheck}>
                    <Check size={14} />
                  </span>
                )}
              </button>
            </div>
          </Card>

          {/* Theme Preference */}
          <Card title="Theme Preference" className={styles.settingsCard}>
            <div className={styles.sectionIcon} style={{ background: '#EDE9FE', color: '#8B5CF6' }}>
              <Sun size={20} />
            </div>
            <p className={styles.sectionDesc}>
              Select your preferred visual theme.
            </p>
            <div className={styles.themeOptions}>
              <button
                className={`${styles.themeOption} ${theme === 'light' ? styles.themeActive : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className={styles.themePreview} data-theme="light">
                  <div className={styles.previewBar} />
                  <div className={styles.previewContent}>
                    <div className={styles.previewLine} />
                    <div className={styles.previewLine} style={{ width: '60%' }} />
                  </div>
                </div>
                <div className={styles.themeLabel}>
                  <Sun size={14} />
                  Light
                  {theme === 'light' && <Check size={12} />}
                </div>
              </button>
              <button
                className={`${styles.themeOption} ${theme === 'dark' ? styles.themeActive : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className={styles.themePreview} data-theme="dark">
                  <div className={styles.previewBar} />
                  <div className={styles.previewContent}>
                    <div className={styles.previewLine} />
                    <div className={styles.previewLine} style={{ width: '60%' }} />
                  </div>
                </div>
                <div className={styles.themeLabel}>
                  <Moon size={14} />
                  Dark
                  {theme === 'dark' && <Check size={12} />}
                </div>
              </button>
            </div>
          </Card>

          {/* Portal Info */}
          <Card title="About this Portal" className={styles.settingsCard}>
            <div className={styles.sectionIcon} style={{ background: '#FCE7F3', color: '#EC4899' }}>
              <Info size={20} />
            </div>
            <div className={styles.infoList}>
              {[
                { label: 'Portal Name', value: 'Saudi Tabreed One Team App' },
                { label: 'Version', value: '2.4.1' },
                { label: 'Build', value: 'April 2025' },
                { label: 'Environment', value: 'Production' },
                { label: 'Support', value: 'itsupport@tabreed.sa' },
              ].map((item) => (
                <div key={item.label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <span className={styles.infoValue}>{item.value}</span>
                  <ChevronRight size={14} className={styles.infoChevron} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

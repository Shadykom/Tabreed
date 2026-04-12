import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';
import styles from './ReminderBanner.module.scss';

export default function ReminderBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <Info className={styles.icon} size={20} />
      <div className={styles.message}>
        <span className={styles.label}>Reminder:</span>
        {t('reminder.message')}
      </div>
      <button className={styles.close} onClick={() => setVisible(false)}>
        <X size={18} />
      </button>
    </div>
  );
}

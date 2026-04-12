import { useTranslation } from 'react-i18next';
import { AlertTriangle, Calendar, Megaphone, Bell } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Announcement, AnnouncementType } from '../../types';
import styles from './Announcements.module.scss';

const typeIcons: Record<AnnouncementType, typeof AlertTriangle> = {
  Important: AlertTriangle,
  Scheduled: Calendar,
  Announcement: Megaphone,
};

const typeBadgeVariant: Record<AnnouncementType, 'important' | 'scheduled' | 'announcement'> = {
  Important: 'important',
  Scheduled: 'scheduled',
  Announcement: 'announcement',
};

export default function Announcements() {
  const { t } = useTranslation();
  const { data: announcements } = useApi<Announcement[]>(api.getAnnouncements);

  return (
    <Card title={t('announcements.title')} viewAllText={t('announcements.viewAll')}>
      <div className={styles.filters}>
        <select className={styles.filterSelect}>
          <option>{t('announcements.search')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.department')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.type')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.account')}</option>
        </select>
      </div>

      <div className={styles.list}>
        {(announcements || []).map((item) => {
          const Icon = typeIcons[item.type] || Bell;
          return (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemSub}>{item.department}</div>
              </div>
              <div className={styles.itemRight}>
                <Badge variant={typeBadgeVariant[item.type]}>
                  {t(`announcements.${item.type.toLowerCase()}`)}
                </Badge>
                <span className={styles.itemDate}>{item.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

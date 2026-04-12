import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Calendar, Megaphone, Bell, ChevronDown, ChevronUp, X } from 'lucide-react';
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

const typeIconClass: Record<AnnouncementType, string> = {
  Important: 'itemIconImportant',
  Scheduled: 'itemIconScheduled',
  Announcement: 'itemIconAnnouncement',
};

const typeColor: Record<AnnouncementType, string> = {
  Important: '#EF4444',
  Scheduled: '#F59E0B',
  Announcement: '#4A7FD4',
};

const typeDetailBg: Record<AnnouncementType, string> = {
  Important: '#FEF2F2',
  Scheduled: '#FFFBEB',
  Announcement: '#EFF6FF',
};

export default function Announcements() {
  const { t } = useTranslation();
  const { data: announcements } = useApi<Announcement[]>(api.getAnnouncements);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card title={t('announcements.title')} viewAllText={t('announcements.viewAll')}>
      <div className={styles.filters}>
        <select className={styles.filterSelect}>
          <option>{t('announcements.search')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.department')}</option>
          <option>IT</option>
          <option>HR</option>
          <option>Facilities</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.type')}</option>
          <option>Important</option>
          <option>Scheduled</option>
          <option>Announcement</option>
        </select>
        <select className={styles.filterSelect}>
          <option>{t('announcements.account')}</option>
        </select>
      </div>

      <div className={styles.list}>
        {(announcements || []).map((item) => {
          const Icon = typeIcons[item.type] || Bell;
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id}>
              <div
                className={styles.item}
                onClick={() => toggleExpand(item.id)}
                style={{ userSelect: 'none' }}
              >
                <div className={styles[typeIconClass[item.type] || 'itemIconAnnouncement']}>
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
                <div style={{ marginInlineStart: 6, color: '#9ca3af', flexShrink: 0 }}>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{
                  background: typeDetailBg[item.type] || '#F9FAFB',
                  border: `1px solid ${typeColor[item.type]}33`,
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 6,
                  position: 'relative',
                  fontSize: 13,
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontWeight: 700, color: typeColor[item.type], fontSize: 13 }}>
                      {item.type}
                    </div>
                    <div style={{ fontWeight: 600, color: '#1B3A6B', fontSize: 14 }}>{item.title}</div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                      <span style={{ color: '#6b7280', fontSize: 12 }}>
                        <strong style={{ color: '#374151' }}>Department:</strong> {item.department}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: 12 }}>
                        <strong style={{ color: '#374151' }}>Date:</strong> {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

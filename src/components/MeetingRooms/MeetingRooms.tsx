import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { MeetingRoom } from '../../types';
import styles from './MeetingRooms.module.scss';

export default function MeetingRooms() {
  const { t } = useTranslation();
  const { data: rooms } = useApi<MeetingRoom[]>(api.getMeetingRooms);

  return (
    <Card title={t('rooms.title')}>
      <div className={styles.grid}>
        {(rooms || []).map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImageWrap}>
              <img
                className={styles.roomImage}
                src={room.image}
                alt={room.name}
                loading="lazy"
              />
              <div className={`${styles.statusBadge} ${styles[room.status]}`}>
                {room.status === 'available' ? 'Available' : 'In Use'}
              </div>
            </div>
            <div className={styles.roomInfo}>
              <div className={styles.roomName}>{room.name}</div>
              <div className={styles.roomMeta}>
                <span className={styles.roomCapacity}>
                  <Users size={13} /> {room.capacity}
                </span>
                <span className={styles.roomFloor}>
                  {room.floor || ''}
                </span>
              </div>
              <div className={styles.roomStatus}>
                <Button
                  variant={room.status === 'available' ? 'success' : 'danger'}
                  size="sm"
                  fullWidth
                >
                  {room.status === 'available' ? t('rooms.reserve') : t('rooms.busy')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

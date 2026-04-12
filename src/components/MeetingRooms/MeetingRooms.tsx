import { useTranslation } from 'react-i18next';
import { Monitor, Users } from 'lucide-react';
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
            <div className={styles.roomImage}>
              <Monitor className={styles.roomIcon} size={32} />
            </div>
            <div className={styles.roomInfo}>
              <div className={styles.roomName}>{room.name}</div>
              <div className={styles.roomCapacity}>
                <Users size={12} />
                {room.capacity} people
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

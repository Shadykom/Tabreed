import { useTranslation } from 'react-i18next';
import { MapPin, Building2 } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { OfficeLocation } from '../../types';
import styles from './OfficeLocations.module.scss';

export default function OfficeLocations() {
  const { t } = useTranslation();
  const { data: locations } = useApi<OfficeLocation[]>(api.getOfficeLocations);

  return (
    <Card title={t('locations.title')} viewAllText={t('locations.viewAll')}>
      <div className={styles.list}>
        {(locations || []).map((loc) => {
          const mapsQuery = encodeURIComponent(`${loc.name}, ${loc.address}, ${loc.city}`);
          const mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;
          return (
            <a
              key={loc.id}
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.item}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
              title={`Open ${loc.name} in Google Maps`}
            >
              <div className={`${styles.icon} ${styles[loc.type]}`}>
                {loc.type === 'hq' ? <MapPin size={16} /> : <Building2 size={16} />}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{loc.name}</div>
                <div className={styles.address}>{loc.address}</div>
              </div>
              <span className={styles.city}>{loc.city}</span>
              <div className={styles.status} />
            </a>
          );
        })}
      </div>
    </Card>
  );
}

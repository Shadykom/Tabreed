import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { SafeLocation } from '../../types';
import styles from './SafeLocations.module.scss';

export default function SafeLocations() {
  const { t } = useTranslation();
  const { data: locations } = useApi<SafeLocation[]>(api.getSafeLocations);

  return (
    <Card title={t('safety.title')} viewAllText={t('safety.viewAll')}>
      <div className={styles.container}>
        <div className={styles.list}>
          {(locations || []).map((loc) => (
            <div key={loc.id} className={styles.item}>
              <img className={styles.thumbnail} src={loc.image} alt={loc.name} loading="lazy" />
              <div className={styles.info}>
                <div className={styles.name}>{loc.name}</div>
                <div className={styles.address}>{loc.address}</div>
              </div>
              <ChevronRight size={14} className={styles.arrow} />
            </div>
          ))}
        </div>

        <div className={styles.mapPlaceholder}>
          <img
            className={styles.mapImage}
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop"
            alt="Map"
            loading="lazy"
          />
          <div className={styles.mapOverlay}>
            {(locations || []).slice(0, 4).map((loc, i) => (
              <div
                key={loc.id}
                className={styles.pin}
                style={{
                  top: `${20 + i * 18}%`,
                  left: `${15 + (i % 3) * 25}%`,
                }}
              >
                <div className={styles.pinDot} />
                <span className={styles.pinLabel}>{loc.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

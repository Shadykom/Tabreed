import { useTranslation } from 'react-i18next';
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
              <div className={styles.thumbnail} />
              <div className={styles.info}>
                <div className={styles.name}>{loc.name}</div>
                <div className={styles.address}>{loc.address}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mapPlaceholder}>
          <div className={styles.mapGrid} />
          <div className={styles.mapPins}>
            {(locations || []).slice(0, 4).map((loc) => (
              <div key={loc.id} className={styles.pin}>
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

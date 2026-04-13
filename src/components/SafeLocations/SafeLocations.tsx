import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { SafeLocation } from '../../types';
import styles from './SafeLocations.module.scss';

// OpenStreetMap embed (no API key needed)
function getOSMUrl() {
  return `https://www.openstreetmap.org/export/embed.html?bbox=36.0,18.0,56.0,32.0&layer=mapnik&marker=26.2172,50.1971`;
}

export default function SafeLocations() {
  const { t } = useTranslation();
  const { data: locations } = useApi<SafeLocation[]>(api.getSafeLocations);

  return (
    <Card title={t('safety.title')} viewAllText={t('safety.viewAll')}>
      <div className={styles.container}>
        <div className={styles.list}>
          {(locations || []).map((loc) => {
            const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(loc.name + ', Saudi Arabia')}`;
            return (
              <a key={loc.id} href={mapsUrl} target="_blank" rel="noreferrer" className={styles.item} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img className={styles.thumbnail} src={loc.image} alt={loc.name} loading="lazy" />
                <div className={styles.info}>
                  <div className={styles.name}>{loc.name}</div>
                  <div className={styles.address}>{loc.address}</div>
                </div>
                <ChevronRight size={14} className={styles.arrow} />
              </a>
            );
          })}
        </div>

        <div className={styles.mapPlaceholder}>
          <iframe
            className={styles.mapFrame}
            src={getOSMUrl()}
            title="Saudi Tabreed Locations"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Card>
  );
}

import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { WeeklyMotivation as MotivationType } from '../../types';
import styles from './WeeklyMotivation.module.scss';

export default function WeeklyMotivation() {
  const { t } = useTranslation();
  const { data: motivation } = useApi<MotivationType>(api.getMotivation);

  const bgUrl = motivation?.backgroundImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop';

  return (
    <div className={styles.container}>
      <img className={styles.bgImage} src={bgUrl} alt="" loading="lazy" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.title}>{t('motivation.title')}</div>
        <p className={styles.quote}>
          {motivation?.quote || 'Great things never come from comfort zones, keep pushing boundaries!'}
        </p>
        <button className={styles.ctaButton}>
          {t('motivation.cta')} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

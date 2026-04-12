import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { WeeklyMotivation as MotivationType } from '../../types';
import styles from './WeeklyMotivation.module.scss';

export default function WeeklyMotivation() {
  const { t } = useTranslation();
  const { data: motivation } = useApi<MotivationType>(api.getMotivation);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.title}>{t('motivation.title')}</div>
        <p className={styles.quote}>
          {motivation?.quote || 'Great things never come from comfort zones, keep pushing boundaries!'}
        </p>
        <Button variant="primary">
          {t('motivation.cta')} <ArrowRight size={16} />
        </Button>
      </div>
      <div className={styles.illustration}>
        <svg viewBox="0 0 200 200" className={styles.illustrationSvg}>
          <circle cx="100" cy="160" rx="90" ry="30" fill="#1B3A6B" opacity="0.15" />
          <rect x="60" y="60" width="80" height="100" rx="8" fill="#1B3A6B" opacity="0.25" />
          <rect x="70" y="70" width="60" height="40" rx="4" fill="#4A7FD4" opacity="0.3" />
          <rect x="70" y="120" width="60" height="8" rx="2" fill="#4A7FD4" opacity="0.2" />
          <rect x="70" y="135" width="40" height="8" rx="2" fill="#4A7FD4" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

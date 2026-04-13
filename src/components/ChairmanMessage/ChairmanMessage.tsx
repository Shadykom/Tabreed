import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { ChairmanMessage as ChairmanMessageType } from '../../types';
import styles from './ChairmanMessage.module.scss';

function truncate(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

export default function ChairmanMessage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: chairman } = useApi<ChairmanMessageType>(api.getChairman);

  const shortMessage = truncate(
    chairman?.message || 'We are committed to working together as we move forward in our mission to enhance Saudi Arabia\'s urban development through innovative, advanced, and highly efficient district cooling solutions.',
    250
  );

  return (
    <Card title={t('chairman.title')} className={styles.wrapper}>
      <div className={styles.accentBar} />
      <div className={styles.container}>
        <div className={styles.accentShape} />

        <div className={styles.textSide}>
          <p className={styles.quote}>{shortMessage}</p>
          <div className={styles.authorDivider} />
          <div className={styles.authorInfo}>
            <span className={styles.name}>{chairman?.name || 'Mohammed Abunayyan'}</span>
            <span className={styles.title}> - {chairman?.title || 'Chairman'}</span>
          </div>
          <button className={styles.readBtn} onClick={() => navigate('/chairman')}>
            {t('chairman.readFull')} <ArrowRight size={14} />
          </button>
        </div>

        {chairman?.image && (
          <div className={styles.photoSide}>
            <div className={styles.photoFrame}>
              <img className={styles.photo} src={chairman.image} alt={chairman.name || ''} loading="lazy" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

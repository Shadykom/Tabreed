import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { ChairmanMessage as ChairmanMessageType } from '../../types';
import styles from './ChairmanMessage.module.scss';

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  return text.substring(0, max).replace(/\s+\S*$/, '') + '...';
}

export default function ChairmanMessage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: chairman } = useApi<ChairmanMessageType>(api.getChairman);

  const msg = truncate(chairman?.message || '', 220);

  return (
    <Card title={t('chairman.title')}>
      <div className={styles.container}>
        {chairman?.image && (
          <div className={styles.photoSide}>
            <img className={styles.photo} src={chairman.image} alt={chairman.name || ''} />
          </div>
        )}
        <div className={styles.textSide}>
          <p className={styles.quote}>{msg}</p>
          <div className={styles.authorInfo}>
            <span className={styles.name}>{chairman?.name || 'Mohammed Abunayyan'}</span>
            <span className={styles.title}>- {chairman?.title || 'Chairman'}</span>
          </div>
          <button className={styles.readBtn} onClick={() => navigate('/chairman')}>
            {t('chairman.readFull')} <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </Card>
  );
}

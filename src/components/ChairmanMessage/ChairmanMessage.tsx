import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { ChairmanMessage as ChairmanMessageType } from '../../types';
import styles from './ChairmanMessage.module.scss';

function getFirstParagraph(text: string): string {
  if (!text) return '';
  const paragraphs = text.split(/\n\n|\r\n\r\n/);
  const first = paragraphs[0] || text;
  if (first.length < 200 && paragraphs.length > 1) return first + '\n\n' + paragraphs[1];
  if (first.length > 350) return first.substring(0, 350).replace(/\s+\S*$/, '') + '...';
  return first + (paragraphs.length > 1 ? '...' : '');
}

export default function ChairmanMessage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: chairman } = useApi<ChairmanMessageType>(api.getChairman);

  const msg = getFirstParagraph(chairman?.message || '');

  return (
    <Card title={t('chairman.title')}>
      <div className={styles.container}>
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
        {chairman?.image && (
          <div className={styles.photoSide}>
            <img className={styles.photo} src={chairman.image} alt={chairman.name || ''} />
          </div>
        )}
      </div>
    </Card>
  );
}

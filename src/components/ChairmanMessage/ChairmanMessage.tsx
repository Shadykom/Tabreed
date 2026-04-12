import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { ChairmanMessage as ChairmanMessageType } from '../../types';
import styles from './ChairmanMessage.module.scss';

export default function ChairmanMessage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: chairman } = useApi<ChairmanMessageType>(api.getChairman);

  return (
    <Card title={t('chairman.title')}>
      <div className={styles.container}>
        <div className={styles.textSide}>
          <p className={styles.quote}>
            {chairman?.message || 'Together, we are building a company that values innovation, collaboration, and sustainability. Thank you for your continued dedication and work.'}
          </p>
          <div className={styles.authorDivider} />
          <div className={styles.authorRow}>
            <div className={styles.authorInfo}>
              <span className={styles.name}>{chairman?.name || 'Mohammed Abunayyan'} - {chairman?.title || 'Chairman of the Board'}</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/chairman')}>{t('chairman.readFull')}</Button>
        </div>
        <div className={styles.photoSide}>
          <img
            className={styles.photo}
            src={chairman?.image || ''}
            alt={chairman?.name || 'Chairman'}
            loading="lazy"
          />
        </div>
      </div>
    </Card>
  );
}

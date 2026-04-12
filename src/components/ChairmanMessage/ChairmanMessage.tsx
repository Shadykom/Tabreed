import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { ChairmanMessage as ChairmanMessageType } from '../../types';
import styles from './ChairmanMessage.module.scss';

export default function ChairmanMessage() {
  const { t } = useTranslation();
  const { data: chairman } = useApi<ChairmanMessageType>(api.getChairman);

  return (
    <Card title={t('chairman.title')}>
      <div className={styles.container}>
        <div className={styles.textSide}>
          <p className={styles.quote}>
            {chairman?.message || 'Together, we are building a company that values innovation, collaboration, and sustainability. Thank you for your continued dedication and work.'}
          </p>

          <div className={styles.name}>
            {chairman?.name || 'Khaled Al-Mansoori'} - {chairman?.title || 'CEO'}
          </div>

          <Button variant="outline" className={styles.readButton}>
            {t('chairman.readFull')}
          </Button>
        </div>

        <div className={styles.photoSide}>
          <div className={styles.photoPlaceholder}>
            <User className={styles.placeholderIcon} size={56} />
          </div>
        </div>
      </div>
    </Card>
  );
}

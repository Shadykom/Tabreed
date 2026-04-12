import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Employee } from '../../types';
import styles from './EmployeeDirectory.module.scss';

export default function EmployeeDirectory() {
  const { t } = useTranslation();
  const { data: employees } = useApi<Employee[]>(api.getEmployees);
  const [activeDot, setActiveDot] = useState(0);

  return (
    <Card title={t('directory.title')}>
      <div className={styles.headerRow}>
        <button className={styles.filterButton}>
          {t('directory.global')}
        </button>
      </div>

      <div className={styles.grid}>
        {(employees || []).map((emp) => (
          <div key={emp.id} className={styles.employeeCard}>
            <Avatar name={emp.name} src={emp.avatar || undefined} size="lg" />
            <div className={styles.employeeName}>{emp.name}</div>
            <div className={styles.employeeDept}>{emp.department}</div>
            <Button variant="primary" size="sm">
              {t('directory.open')}
            </Button>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={`${styles.dot} ${activeDot === i ? styles.active : ''}`}
            onClick={() => setActiveDot(i)}
          />
        ))}
      </div>
    </Card>
  );
}

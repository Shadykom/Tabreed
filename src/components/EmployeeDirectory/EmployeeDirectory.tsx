import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageCircle, User, X } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Employee } from '../../types';
import styles from './EmployeeDirectory.module.scss';

function getEmployeeEmail(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@sauditabreed.com`;
}

export default function EmployeeDirectory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: employees } = useApi<Employee[]>(api.getEmployees);
  const [activeDot, setActiveDot] = useState(0);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

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
            <Button variant="primary" size="sm" onClick={() => setSelectedEmp(emp)}>
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

      {/* Employee popup modal */}
      {selectedEmp && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setSelectedEmp(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 14, padding: 28,
              minWidth: 300, maxWidth: 380, width: '90%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEmp(null)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <Avatar name={selectedEmp.name} src={selectedEmp.avatar || undefined} size="lg" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1B3A6B' }}>{selectedEmp.name}</div>
                {selectedEmp.title && (
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{selectedEmp.title}</div>
                )}
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{selectedEmp.department}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href={`mailto:${getEmployeeEmail(selectedEmp.name)}`}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#EBF3FF', borderRadius: 8, textDecoration: 'none', color: '#1B3A6B', fontWeight: 500, fontSize: 14 }}
              >
                <Mail size={15} color="#4A7FD4" /> Send Email
              </a>
              <a
                href={`https://teams.microsoft.com/l/chat/0/0?users=${getEmployeeEmail(selectedEmp.name)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#EDE9FE', borderRadius: 8, textDecoration: 'none', color: '#1B3A6B', fontWeight: 500, fontSize: 14 }}
              >
                <MessageCircle size={15} color="#8B5CF6" /> Teams Chat
              </a>
              <button
                onClick={() => { setSelectedEmp(null); navigate(`/employee/${selectedEmp.id}`); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#F3F4F6', borderRadius: 8, border: 'none', cursor: 'pointer', color: '#1B3A6B', fontWeight: 500, fontSize: 14 }}
              >
                <User size={15} color="#6b7280" /> View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

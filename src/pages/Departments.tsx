import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Crown, Wrench, Settings2, DollarSign, Users, Monitor,
  ShieldCheck, Megaphone, X, User, Mail, Phone, MessageCircle,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import type { Employee } from '../types';
import styles from './Departments.module.scss';

interface Department {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const DEPARTMENTS: Department[] = [
  {
    id: 'Executive',
    name: 'Executive',
    nameAr: 'الإدارة التنفيذية',
    description: 'Strategic leadership and corporate governance driving Tabreed\'s vision and growth.',
    icon: Crown,
    color: '#1B3A6B',
    bg: '#E8F0FE',
  },
  {
    id: 'Engineering',
    name: 'Engineering',
    nameAr: 'الهندسة',
    description: 'Design, development and technical excellence across district cooling infrastructure.',
    icon: Wrench,
    color: '#4A7FD4',
    bg: '#EBF3FF',
  },
  {
    id: 'Operations',
    name: 'Operations',
    nameAr: 'العمليات',
    description: 'Day-to-day management of cooling plants, networks and service delivery.',
    icon: Settings2,
    color: '#14B8A6',
    bg: '#CCFBF1',
  },
  {
    id: 'Finance',
    name: 'Finance',
    nameAr: 'المالية',
    description: 'Financial planning, reporting, compliance and capital allocation.',
    icon: DollarSign,
    color: '#22C55E',
    bg: '#DCFCE7',
  },
  {
    id: 'HR',
    name: 'Human Resources',
    nameAr: 'الموارد البشرية',
    description: 'Talent acquisition, employee development, compensation and culture.',
    icon: Users,
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  {
    id: 'IT',
    name: 'Information Technology',
    nameAr: 'تقنية المعلومات',
    description: 'Systems, infrastructure, cybersecurity and digital transformation.',
    icon: Monitor,
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    id: 'HSE',
    name: 'HSE',
    nameAr: 'الصحة والسلامة والبيئة',
    description: 'Health, safety and environmental compliance across all operations.',
    icon: ShieldCheck,
    color: '#EF4444',
    bg: '#FEE2E2',
  },
  {
    id: 'Marketing',
    name: 'Marketing',
    nameAr: 'التسويق',
    description: 'Brand management, communications, stakeholder engagement and business development.',
    icon: Megaphone,
    color: '#EC4899',
    bg: '#FCE7F3',
  },
];

export default function Departments() {
  const { t, i18n } = useTranslation();
  const isAR = i18n.language === 'ar';
  const { data: employees } = useApi<Employee[]>(api.getEmployees);
  const [selected, setSelected] = useState<Department | null>(null);

  const getCount = (deptId: string) =>
    (employees || []).filter((e) => e.department === deptId).length;

  const getDeptEmployees = (deptId: string) =>
    (employees || []).filter((e) => e.department === deptId);

  const getEmpEmail = (name: string) =>
    `${name.toLowerCase().replace(/\s+/g, '.')}@sauditabreed.com`;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('nav.departments')}</h1>
        <p className={styles.pageSubtitle}>
          Explore Saudi Tabreed's organisational structure and teams.
        </p>
      </div>

      <div className={styles.grid}>
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const count = getCount(dept.id);
          return (
            <button
              key={dept.id}
              className={styles.deptCard}
              onClick={() => setSelected(dept)}
            >
              <div
                className={styles.iconWrap}
                style={{ background: dept.bg, color: dept.color }}
              >
                <Icon size={28} />
              </div>
              <div className={styles.deptInfo}>
                <h3 className={styles.deptName}>
                  {isAR ? dept.nameAr : dept.name}
                </h3>
                <p className={styles.deptDesc}>{dept.description}</p>
              </div>
              <div className={styles.deptFooter}>
                <Badge variant="info">
                  <User size={11} />
                  {count > 0 ? `${count} employees` : 'View team'}
                </Badge>
                <span className={styles.viewLink}>View →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Department Detail Panel */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <div
                  className={styles.panelIcon}
                  style={{ background: selected.bg, color: selected.color }}
                >
                  <selected.icon size={24} />
                </div>
                <div>
                  <h2>{isAR ? selected.nameAr : selected.name}</h2>
                  <p>{selected.description}</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.panelBody}>
              {getDeptEmployees(selected.id).length === 0 ? (
                <div className={styles.emptyState}>
                  <Users size={40} />
                  <p>No employees listed for this department.</p>
                </div>
              ) : (
                <div className={styles.employeeList}>
                  {getDeptEmployees(selected.id).map((emp) => (
                    <Card key={emp.id} className={styles.empCard}>
                      <div className={styles.empRow}>
                        <Avatar name={emp.name} src={emp.avatar} size="md" />
                        <div className={styles.empInfo}>
                          <span className={styles.empName}>{emp.name}</span>
                          <span className={styles.empTitle}>{emp.title}</span>
                        </div>
                        <div className={styles.empActions}>
                          <a
                            href={`mailto:${getEmpEmail(emp.name)}`}
                            className={styles.empAction}
                            aria-label="Email"
                            title={`Email ${emp.name}`}
                          >
                            <Mail size={15} />
                          </a>
                          <a
                            href={`https://teams.microsoft.com/l/chat/0/0?users=${getEmpEmail(emp.name)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.empAction}
                            aria-label="Teams Chat"
                            title={`Chat with ${emp.name} on Teams`}
                          >
                            <MessageCircle size={15} />
                          </a>
                          <a
                            href={`tel:+966500000000`}
                            className={styles.empAction}
                            aria-label="Call"
                            title={`Call ${emp.name}`}
                          >
                            <Phone size={15} />
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.panelFooter}>
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

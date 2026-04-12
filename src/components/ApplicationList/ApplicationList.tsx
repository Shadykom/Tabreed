import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, Shield, PenTool, Mail, Box,
  Database, Settings, Layout, ChevronLeft, ChevronRight, Check,
  BarChart3, Users,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Application, AppCategory } from '../../types';
import styles from './ApplicationList.module.scss';

const iconMap: Record<string, typeof Building2> = {
  building: Building2,
  shield: Shield,
  'pen-tool': PenTool,
  mail: Mail,
  box: Box,
  database: Database,
  settings: Settings,
  layout: Layout,
  'bar-chart-3': BarChart3,
  users: Users,
};

const tabs: { key: AppCategory; labelKey: string }[] = [
  { key: 'Favorites', labelKey: 'apps.favorites' },
  { key: 'Core Systems', labelKey: 'apps.coreSystems' },
  { key: 'Tools', labelKey: 'apps.tools' },
];

export default function ApplicationList() {
  const { t } = useTranslation();
  const { data: apps } = useApi<Application[]>(api.getApplications);
  const [activeTab, setActiveTab] = useState<AppCategory>('Favorites');

  const filtered = (apps || []).filter((app) => app.category === activeTab);

  return (
    <Card title={t('apps.title')}>
      <div className={styles.headerRow}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <div className={styles.navArrows}>
          <button className={styles.navArrow}>
            <ChevronLeft size={16} />
          </button>
          <button className={styles.navArrow}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((app) => {
          const Icon = iconMap[app.icon] || Box;
          const color = app.color || '#4A7FD4';
          return (
            <div key={app.id} className={styles.appCard}>
              <div className={styles.appIcon} style={{ background: color }}>
                <Icon size={24} />
              </div>
              <div className={styles.appName}>{app.name}</div>
              <div className={styles.appDesc}>{app.description}</div>
              <div className={styles.appActions}>
                <span className={styles.detailsLink}>{t('apps.details')}</span>
                <Button variant="primary" size="sm" className={styles.openButton}>
                  <Check size={14} /> {t('apps.open')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost">{t('apps.viewAll')}</Button>
      </div>
    </Card>
  );
}

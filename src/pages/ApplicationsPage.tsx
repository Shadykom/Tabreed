import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, Shield, PenTool, Mail, Box,
  Database, Settings, Layout, BarChart3, Users,
  Search, ExternalLink, LayoutGrid,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import type { Application, AppCategory } from '../types';
import styles from './ApplicationsPage.module.scss';

const iconMap: Record<string, React.ElementType> = {
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

const ALL_TABS: { key: AppCategory | 'All'; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'Favorites', label: 'Favorites' },
  { key: 'Core Systems', label: 'Core Systems' },
  { key: 'Tools', label: 'Tools' },
];

export default function ApplicationsPage() {
  const { t } = useTranslation();
  const { data: apps, loading } = useApi<Application[]>(api.getApplications);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<AppCategory | 'All'>('All');

  const filtered = useMemo(() => {
    return (apps || []).filter((app) => {
      const matchTab = activeTab === 'All' || app.category === activeTab;
      const matchSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [apps, search, activeTab]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>{t('nav.applications')}</h1>
          <p className={styles.pageSubtitle}>
            All Saudi Tabreed internal systems and tools in one place.
          </p>
        </div>
        <div className={styles.headerBadge}>
          <LayoutGrid size={16} />
          <span>{(apps || []).length} Apps</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.tabs}>
          {ALL_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${styles.skeletonCard} skeleton`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <LayoutGrid size={48} />
          <p>No applications found.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setActiveTab('All'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((app) => {
            const Icon = iconMap[app.icon] || Box;
            const color = app.color || '#4A7FD4';
            return (
              <Card key={app.id} className={styles.appCard}>
                <div className={styles.appHeader}>
                  <div className={styles.appIconWrap} style={{ background: color }}>
                    <Icon size={26} />
                  </div>
                  <div className={styles.categoryTag}>
                    {app.category}
                  </div>
                </div>
                <h3 className={styles.appName}>{app.name}</h3>
                <p className={styles.appDesc}>{app.description}</p>
                <div className={styles.appFooter}>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openLink}
                  >
                    <Button variant="primary" size="sm" className={styles.openBtn}>
                      <ExternalLink size={14} />
                      {t('apps.open')}
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

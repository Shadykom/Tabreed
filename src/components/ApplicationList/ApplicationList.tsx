import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Shield, PenTool, Mail, Box,
  Database, Settings, Layout, ChevronLeft, ChevronRight, Check,
  BarChart3, Users, ExternalLink, X, Info,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { Application, AppCategory } from '../../types';
import styles from './ApplicationList.module.scss';

const iconMap: Record<string, typeof Building2> = {
  building: Building2, shield: Shield, 'pen-tool': PenTool, mail: Mail,
  box: Box, database: Database, settings: Settings, layout: Layout,
  'bar-chart-3': BarChart3, users: Users,
};

const tabs: { key: AppCategory; labelKey: string }[] = [
  { key: 'Favorites', labelKey: 'apps.favorites' },
  { key: 'Core Systems', labelKey: 'apps.coreSystems' },
  { key: 'Tools', labelKey: 'apps.tools' },
];

export default function ApplicationList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: apps } = useApi<Application[]>(api.getApplications);
  const [activeTab, setActiveTab] = useState<AppCategory>('Favorites');
  const [detailApp, setDetailApp] = useState<Application | null>(null);

  const filtered = (apps || []).filter((app) => app.category === activeTab);

  function openApp(app: Application) {
    if (app.url && app.url !== '#') {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <Card title={t('apps.title')}>
      <div className={styles.headerRow}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <div className={styles.navArrows}>
          <button className={styles.navArrow}><ChevronLeft size={16} /></button>
          <button className={styles.navArrow}><ChevronRight size={16} /></button>
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
                <button className={styles.detailsLink} onClick={() => setDetailApp(app)}>
                  {t('apps.details')}
                </button>
                <Button variant="primary" size="sm" className={styles.openButton}
                  onClick={() => openApp(app)}>
                  <Check size={14} /> {t('apps.open')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={() => navigate('/applications')}>{t('apps.viewAll')}</Button>
      </div>

      {/* Details Modal */}
      {detailApp && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setDetailApp(null)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 0,
            width: '90%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease',
            overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${detailApp.color || '#4A7FD4'}, ${detailApp.color || '#4A7FD4'}88)`,
              padding: '28px 24px', textAlign: 'center', position: 'relative',
            }}>
              <button onClick={() => setDetailApp(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={16} />
              </button>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', color: '#fff',
              }}>
                {(() => { const I = iconMap[detailApp.icon] || Box; return <I size={32} />; })()}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{detailApp.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', margin: '4px 0 0' }}>{detailApp.description}</p>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#6B7280' }}>Category</span>
                  <span style={{ fontWeight: 600, color: '#1B3A6B' }}>{detailApp.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#6B7280' }}>Type</span>
                  <span style={{ fontWeight: 600, color: '#1B3A6B' }}>{detailApp.description}</span>
                </div>
                {detailApp.url && detailApp.url !== '#' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: '#6B7280' }}>URL</span>
                    <a href={detailApp.url} target="_blank" rel="noreferrer"
                      style={{ color: '#4A7FD4', fontWeight: 500, textDecoration: 'none' }}>
                      {detailApp.url.replace('https://', '')} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </div>
                )}
                <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />
                <div style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6 }}>
                  <Info size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: '#4A7FD4' }} />
                  Access this application through the Saudi Tabreed portal. Contact IT support if you need assistance with access permissions.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <Button variant="ghost" onClick={() => setDetailApp(null)} style={{ flex: 1 }}>Close</Button>
                <Button variant="primary" onClick={() => { openApp(detailApp); setDetailApp(null); }} style={{ flex: 1 }}>
                  <ExternalLink size={14} /> Open Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

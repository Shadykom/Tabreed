import { useState, useEffect } from 'react';
import {
  FileText, Search, ShieldCheck, Users, Monitor, Settings2,
  Eye, Download, X, Calendar, BookOpen, Upload,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import styles from './PoliciesPage.module.scss';

type Category = 'All' | 'HSE' | 'HR' | 'IT' | 'Operations';

interface Policy {
  id: number;
  title: string;
  category: string;
  date: string;
  pages: number;
  description: string;
  fileUrl: string;
}

const TABS: Category[] = ['All', 'HSE', 'HR', 'IT', 'Operations'];

const catIcon: Record<string, typeof FileText> = {
  HSE: ShieldCheck, HR: Users, IT: Monitor, Operations: Settings2,
};
const catColor: Record<string, string> = {
  HSE: '#EF4444', HR: '#8B5CF6', IT: '#F59E0B', Operations: '#14B8A6',
};
const catBg: Record<string, string> = {
  HSE: '#FEE2E2', HR: '#EDE9FE', IT: '#FEF3C7', Operations: '#CCFBF1',
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Category>('All');
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    fetch(`/api/policies?category=${activeTab}&search=${encodeURIComponent(search)}`)
      .then(r => r.json()).then(setPolicies).catch(() => {});
  }, [activeTab, search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <BookOpen size={24} className={styles.titleIcon} /> Policies & Procedures
          </h1>
          <p className={styles.subtitle}>Access and download official Saudi Tabreed policies and documents</p>
        </div>
        <span className={styles.count}>{policies.length} Documents</span>
      </div>

      {/* Search + Tabs */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search policies by name, category, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}><X size={16} /></button>
          )}
        </div>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className={styles.grid}>
        {policies.map(p => {
          const Icon = catIcon[p.category] || FileText;
          const color = catColor[p.category] || '#6B7280';
          const bg = catBg[p.category] || '#F3F4F6';
          return (
            <Card key={p.id}>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon} style={{ background: bg, color }}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.policyTitle}>{p.title}</h3>
                <p className={styles.policyDesc}>{p.description}</p>
                <div className={styles.policyMeta}>
                  <span><Calendar size={12} /> {p.date}</span>
                  <span style={{ color, fontWeight: 600 }}>{p.category}</span>
                  <span>{p.pages} pages</span>
                </div>
                <div className={styles.policyActions}>
                  <Button variant="primary" size="sm" onClick={() => setViewingPolicy(p)}>
                    <Eye size={14} /> View
                  </Button>
                  {p.fileUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(p.fileUrl, '_blank')}>
                      <Download size={14} /> Download
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {policies.length === 0 && (
        <div className={styles.empty}>
          <FileText size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p>No policies found matching your search.</p>
        </div>
      )}

      {/* In-Browser Document Viewer Modal */}
      {viewingPolicy && (
        <div className={styles.viewerOverlay} onClick={() => setViewingPolicy(null)}>
          <div className={styles.viewer} onClick={e => e.stopPropagation()}>
            <div className={styles.viewerHeader}>
              <div>
                <h2 className={styles.viewerTitle}>{viewingPolicy.title}</h2>
                <span className={styles.viewerMeta}>{viewingPolicy.category} • {viewingPolicy.date} • {viewingPolicy.pages} pages</span>
              </div>
              <div className={styles.viewerActions}>
                {viewingPolicy.fileUrl && (
                  <Button variant="outline" size="sm" onClick={() => window.open(viewingPolicy.fileUrl, '_blank')}>
                    <Download size={14} /> Download
                  </Button>
                )}
                <button className={styles.viewerClose} onClick={() => setViewingPolicy(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.viewerBody}>
              {viewingPolicy.fileUrl ? (
                <iframe
                  src={viewingPolicy.fileUrl}
                  className={styles.viewerFrame}
                  title={viewingPolicy.title}
                />
              ) : (
                <div className={styles.viewerPlaceholder}>
                  <FileText size={64} style={{ opacity: 0.15, marginBottom: 16 }} />
                  <h3>{viewingPolicy.title}</h3>
                  <p className={styles.viewerDesc}>{viewingPolicy.description}</p>
                  <div className={styles.viewerInfo}>
                    <div className={styles.viewerInfoItem}>
                      <strong>Category</strong><span>{viewingPolicy.category}</span>
                    </div>
                    <div className={styles.viewerInfoItem}>
                      <strong>Last Updated</strong><span>{viewingPolicy.date}</span>
                    </div>
                    <div className={styles.viewerInfoItem}>
                      <strong>Pages</strong><span>{viewingPolicy.pages}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: 20 }}>
                    <Upload size={14} style={{ verticalAlign: 'middle' }} /> Upload a PDF file from the Admin panel to enable in-browser viewing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

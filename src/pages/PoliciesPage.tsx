import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, Search, Download, ShieldCheck, Users,
  Monitor, Settings2, BookOpen, Clock,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import styles from './PoliciesPage.module.scss';

type PolicyCategory = 'All' | 'HSE' | 'HR' | 'IT' | 'Operations';

interface Policy {
  id: number;
  title: string;
  category: Exclude<PolicyCategory, 'All'>;
  date: string;
  version: string;
  pages: number;
}

const POLICIES: Policy[] = [
  {
    id: 1,
    title: 'HSE Guidelines & Standards',
    category: 'HSE',
    date: 'Mar 2025',
    version: 'v3.2',
    pages: 48,
  },
  {
    id: 2,
    title: 'IT Security Policy',
    category: 'IT',
    date: 'Jan 2025',
    version: 'v2.1',
    pages: 32,
  },
  {
    id: 3,
    title: 'Employee Handbook',
    category: 'HR',
    date: 'Dec 2024',
    version: 'v5.0',
    pages: 120,
  },
  {
    id: 4,
    title: 'Emergency Procedures',
    category: 'HSE',
    date: 'Feb 2025',
    version: 'v4.1',
    pages: 24,
  },
  {
    id: 5,
    title: 'Data Protection Policy',
    category: 'IT',
    date: 'Nov 2024',
    version: 'v1.8',
    pages: 28,
  },
  {
    id: 6,
    title: 'Travel & Expense Policy',
    category: 'HR',
    date: 'Oct 2024',
    version: 'v2.3',
    pages: 18,
  },
  {
    id: 7,
    title: 'Code of Conduct',
    category: 'HR',
    date: 'Jan 2025',
    version: 'v6.0',
    pages: 36,
  },
  {
    id: 8,
    title: 'Work From Home Policy',
    category: 'HR',
    date: 'Sep 2024',
    version: 'v1.5',
    pages: 14,
  },
  {
    id: 9,
    title: 'Operations & Maintenance Manual',
    category: 'Operations',
    date: 'Apr 2025',
    version: 'v7.2',
    pages: 200,
  },
  {
    id: 10,
    title: 'Risk Assessment Framework',
    category: 'HSE',
    date: 'Mar 2025',
    version: 'v2.0',
    pages: 54,
  },
];

const CATEGORY_TABS: PolicyCategory[] = ['All', 'HSE', 'HR', 'IT', 'Operations'];

const categoryIcon: Record<Exclude<PolicyCategory, 'All'>, React.ElementType> = {
  HSE: ShieldCheck,
  HR: Users,
  IT: Monitor,
  Operations: Settings2,
};

const categoryColor: Record<Exclude<PolicyCategory, 'All'>, string> = {
  HSE: '#EF4444',
  HR: '#8B5CF6',
  IT: '#F59E0B',
  Operations: '#14B8A6',
};

const categoryBg: Record<Exclude<PolicyCategory, 'All'>, string> = {
  HSE: '#FEE2E2',
  HR: '#EDE9FE',
  IT: '#FEF3C7',
  Operations: '#CCFBF1',
};

function categoryToBadgeVariant(cat: Exclude<PolicyCategory, 'All'>): 'important' | 'scheduled' | 'announcement' | 'info' {
  if (cat === 'HSE') return 'important';
  if (cat === 'Operations') return 'scheduled';
  if (cat === 'IT') return 'info';
  return 'announcement';
}

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<PolicyCategory>('All');

  const filtered = useMemo(() => {
    return POLICIES.filter((p) => {
      const matchCat = activeTab === 'All' || p.category === activeTab;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeTab]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>{t('nav.policies')}</h1>
          <p className={styles.pageSubtitle}>
            Access and download official Saudi Tabreed policies and procedures.
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statBubble}>
            <BookOpen size={16} />
            <span>{POLICIES.length} Documents</span>
          </div>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.tabs}>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <FileText size={48} />
          <p>No policies found matching your criteria.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setActiveTab('All'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((policy) => {
            const CatIcon = categoryIcon[policy.category];
            return (
              <Card key={policy.id} className={styles.policyCard}>
                <div className={styles.cardTop}>
                  <div
                    className={styles.docIcon}
                    style={{
                      background: categoryBg[policy.category],
                      color: categoryColor[policy.category],
                    }}
                  >
                    <CatIcon size={22} />
                  </div>
                  <Badge variant={categoryToBadgeVariant(policy.category)}>
                    {policy.category}
                  </Badge>
                </div>

                <h3 className={styles.policyTitle}>{policy.title}</h3>

                <div className={styles.policyMeta}>
                  <span className={styles.metaItem}>
                    <Clock size={12} />
                    {policy.date}
                  </span>
                  <span className={styles.metaItem}>
                    <FileText size={12} />
                    {policy.pages} pages
                  </span>
                  <span className={styles.versionBadge}>{policy.version}</span>
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    variant="primary"
                    size="sm"
                    className={styles.downloadBtn}
                  >
                    <Download size={14} />
                    Download PDF
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

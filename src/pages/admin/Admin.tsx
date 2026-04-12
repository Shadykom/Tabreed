import { useState, useEffect } from 'react';
import {
  Settings, ArrowLeft, Newspaper, Megaphone, Users, DoorOpen,
  Plus, Edit2, Trash2, Eye, BarChart3, Building2, MessageSquare,
} from 'lucide-react';
import Button from '../../components/common/Button';
import styles from './AdminLayout.module.scss';

type Tab = 'dashboard' | 'news' | 'announcements' | 'employees' | 'rooms' | 'chairman';

interface Stats {
  news: number;
  announcements: number;
  employees: number;
  rooms: number;
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

interface AnnouncementItem {
  id: number;
  title: string;
  type: string;
  department: string;
  date: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats>({ news: 0, announcements: 0, employees: 0, rooms: 0 });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/news').then(r => r.json()).then(setNews).catch(() => {});
    fetch('/api/announcements').then(r => r.json()).then(setAnnouncements).catch(() => {});
  }, []);

  const tabs = [
    { key: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
    { key: 'news' as Tab, label: 'News', icon: Newspaper },
    { key: 'announcements' as Tab, label: 'Announcements', icon: Megaphone },
    { key: 'employees' as Tab, label: 'Employees', icon: Users },
    { key: 'rooms' as Tab, label: 'Meeting Rooms', icon: DoorOpen },
    { key: 'chairman' as Tab, label: "Chairman's Message", icon: MessageSquare },
  ];

  const statCards = [
    { label: 'News Articles', value: stats.news, icon: Newspaper, color: '#4A7FD4' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: '#14B8A6' },
    { label: 'Employees', value: stats.employees, icon: Users, color: '#8B5CF6' },
    { label: 'Meeting Rooms', value: stats.rooms, icon: Building2, color: '#22C55E' },
  ];

  return (
    <div className={styles.admin}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>
          <Settings size={20} />
          Saudi Tabreed Portal - Content Management
        </div>
        <div className={styles.topBarActions}>
          <a href="/" className={styles.backLink}>
            <ArrowLeft size={14} /> Back to Portal
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => { setActiveTab(tab.key); setShowForm(false); }}
            >
              <Icon size={16} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            <div className={styles.statsGrid}>
              {statCards.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: s.color }}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.statInfo}>
                      <div className={styles.statNumber}>{s.value}</div>
                      <div className={styles.statLabel}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Recent News Articles</span>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {news.slice(0, 5).map((n) => (
                    <tr key={n.id}>
                      <td>{n.image && <img className={styles.thumbnail} src={n.image} alt="" />}</td>
                      <td><strong>{n.title}</strong></td>
                      <td><span className={styles.badgePublished}>{n.category}</span></td>
                      <td>{n.author}</td>
                      <td>{n.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* News Management */}
        {activeTab === 'news' && !showForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage News Articles</span>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add News
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>{n.image && <img className={styles.thumbnail} src={n.image} alt="" />}</td>
                    <td><strong>{n.title}</strong></td>
                    <td>{n.category}</td>
                    <td><span className={styles.badgePublished}>Published</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Eye size={16} /></button>
                        <button className={styles.actionBtn}><Edit2 size={16} /></button>
                        <button className={styles.actionBtnDanger}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* News Form */}
        {activeTab === 'news' && showForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Add News Article</span>
            </div>
            <form className={styles.formGrid} onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title (English)</label>
                <input className={styles.formInput} placeholder="Enter news title" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title (Arabic)</label>
                <input className={styles.formInput} dir="rtl" placeholder="أدخل عنوان الخبر" />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Summary (English)</label>
                <textarea className={styles.formTextarea} placeholder="Enter news summary" />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Summary (Arabic)</label>
                <textarea className={styles.formTextarea} dir="rtl" placeholder="أدخل ملخص الخبر" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select className={styles.formSelect}>
                  <option>Corporate</option>
                  <option>Projects</option>
                  <option>Innovation</option>
                  <option>HSE</option>
                  <option>HR</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Author</label>
                <input className={styles.formInput} placeholder="Author name" />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Image URL</label>
                <input className={styles.formInput} placeholder="https://..." />
              </div>
              <div className={styles.formActions}>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Publish Article</Button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements Management */}
        {activeTab === 'announcements' && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Announcements</span>
              <Button variant="primary"><Plus size={16} /> Add Announcement</Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.title}</strong></td>
                    <td>
                      <span className={a.type === 'Important' ? styles.badge + ' ' + styles.badgePublished : styles.badgePublished}>
                        {a.type}
                      </span>
                    </td>
                    <td>{a.department}</td>
                    <td>{a.date}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Edit2 size={16} /></button>
                        <button className={styles.actionBtnDanger}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'employees' || activeTab === 'rooms' || activeTab === 'chairman') && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>
                Manage {activeTab === 'chairman' ? "Chairman's Message" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
              {activeTab !== 'chairman' && (
                <Button variant="primary"><Plus size={16} /> Add New</Button>
              )}
            </div>
            <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Settings size={48} style={{ opacity: 0.2, marginBlockEnd: 16 }} />
              <p>Connect to SQL Server to enable full CMS functionality.</p>
              <p style={{ fontSize: '0.8125rem', marginTop: 8 }}>
                Run the SQL scripts in <code>server/database/</code> to set up the database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

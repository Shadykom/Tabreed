/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  BarChart3, Newspaper, Megaphone, Users, DoorOpen, Calendar,
  Network, LayoutGrid, MapPin, Shield, MessageSquare, Sparkles,
  Bell, UserCog, Headphones, Plus, Edit2, Trash2, Save, ArrowLeft, Eye,
  Search, X,
} from 'lucide-react';
import Button from '../../components/common/Button';
import styles from './AdminNew.module.scss';

// ─── Types ───
type Section = 'dashboard'|'news'|'announcements'|'employees'|'rooms'|'bookings'|'orgchart'|'applications'|'locations'|'safelocations'|'chairman'|'motivation'|'reminders'|'users'|'requests'|'themes';

interface NavEntry { key: Section; label: string; icon: React.ElementType; }

const NAV: NavEntry[] = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'news', label: 'News', icon: Newspaper },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'rooms', label: 'Meeting Rooms', icon: DoorOpen },
  { key: 'bookings', label: 'Room Bookings', icon: Calendar },
  { key: 'orgchart', label: 'Org Chart', icon: Network },
  { key: 'applications', label: 'Applications', icon: LayoutGrid },
  { key: 'locations', label: 'Office Locations', icon: MapPin },
  { key: 'safelocations', label: 'Safe Locations', icon: Shield },
  { key: 'chairman', label: "Chairman's Message", icon: MessageSquare },
  { key: 'motivation', label: 'Weekly Motivation', icon: Sparkles },
  { key: 'reminders', label: 'Reminders', icon: Bell },
  { key: 'themes', label: 'Homepage Themes', icon: LayoutGrid },
  { key: 'users', label: 'User Management', icon: UserCog },
  { key: 'requests', label: 'Service Requests', icon: Headphones },
];

interface Field { name: string; label: string; type?: string; options?: string[]; }

const CRUD_CONFIG: Record<string, { endpoint: string; cols: string[]; fields: Field[] }> = {
  news: { endpoint: '/api/news', cols: ['title','category','author','date'], fields: [
    {name:'title',label:'Title'},{name:'summary',label:'Summary',type:'textarea'},
    {name:'category',label:'Category',type:'select',options:['Corporate','Projects','Innovation','HSE']},
    {name:'author',label:'Author'},{name:'image',label:'Image URL'}
  ]},
  announcements: { endpoint: '/api/announcements', cols: ['title','type','department','date'], fields: [
    {name:'title',label:'Title'},{name:'type',label:'Type',type:'select',options:['Important','Scheduled','Announcement']},
    {name:'department',label:'Department'}
  ]},
  employees: { endpoint: '/api/employees', cols: ['name','department','title'], fields: [
    {name:'name',label:'Name'},{name:'department',label:'Department'},{name:'title',label:'Title'},{name:'avatar',label:'Avatar URL'}
  ]},
  rooms: { endpoint: '/api/meetingRooms', cols: ['name','capacity','floor','status'], fields: [
    {name:'name',label:'Name'},{name:'capacity',label:'Capacity',type:'number'},{name:'floor',label:'Floor'},
    {name:'image',label:'Image URL'},{name:'status',label:'Status',type:'select',options:['available','busy']}
  ]},
  orgchart: { endpoint: '/api/orgChart/flat', cols: ['name','title'], fields: [
    {name:'name',label:'Name'},{name:'title',label:'Title'},{name:'avatar',label:'Avatar URL'}
  ]},
  applications: { endpoint: '/api/applications', cols: ['name','description','category'], fields: [
    {name:'name',label:'Name'},{name:'description',label:'Description'},
    {name:'category',label:'Category',type:'select',options:['Favorites','Core Systems','Tools']},
    {name:'icon',label:'Icon'},{name:'color',label:'Color'},{name:'url',label:'URL'}
  ]},
  locations: { endpoint: '/api/officeLocations', cols: ['name','city','address','type'], fields: [
    {name:'name',label:'Name'},{name:'city',label:'City'},{name:'address',label:'Address'},
    {name:'type',label:'Type',type:'select',options:['hq','branch','plant']}
  ]},
  safelocations: { endpoint: '/api/safeLocations', cols: ['name','address'], fields: [
    {name:'name',label:'Name'},{name:'address',label:'Address'},{name:'image',label:'Image URL'}
  ]},
  users: { endpoint: '/api/employees', cols: ['name','department','title'], fields: [
    {name:'name',label:'Full Name'},{name:'email',label:'Email'},{name:'department',label:'Department'},
    {name:'title',label:'Title'},{name:'role',label:'Role',type:'select',options:['admin','editor','user']},
    {name:'avatar',label:'Avatar URL'}
  ]},
};

// ─── Helpers ───
function badgeClass(val: string): string {
  const v = (val || '').toLowerCase();
  if (v === 'important' || v === 'admin' || v === 'busy' || v === 'urgent') return styles.badgeRed;
  if (v === 'scheduled' || v === 'available' || v === 'confirmed' || v === 'normal') return styles.badgeGreen;
  if (v === 'editor' || v === 'high' || v === 'projects') return styles.badgeBlue;
  if (v === 'announcement' || v === 'hq') return styles.badgeTeal;
  return styles.badgeGray;
}

// ─── Component ───
export default function AdminNew() {
  const [section, setSection] = useState<Section>('dashboard');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ news: 0, announcements: 0, employees: 0, rooms: 0 });
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editItem, setEditItem] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setChairman] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setMotivation] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setReminder] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [requests, setRequests] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  // Fetch data when section changes
  useEffect(() => {
    setShowForm(false); setEditItem(null); setSaved(false);
    const cfg = CRUD_CONFIG[section];
    if (cfg) {
      fetch(cfg.endpoint).then(r => r.json()).then(d => setData(Array.isArray(d) ? d : [])).catch(() => setData([]));
    }
    if (section === 'dashboard') {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
      fetch('/api/news').then(r => r.json()).then(d => setData(d || [])).catch(() => {});
    }
    if (section === 'chairman') fetch('/api/chairman').then(r => r.json()).then(d => { setChairman(d); setForm(d); }).catch(() => {});
    if (section === 'motivation') fetch('/api/motivation').then(r => r.json()).then(d => { setMotivation(d); setForm(d); }).catch(() => {});
    if (section === 'reminders') fetch('/api/reminder').then(r => r.json()).then(d => { setReminder(d); setForm(d); }).catch(() => {});
    if (section === 'bookings') fetch('/api/room-bookings').then(r => r.json()).then(setBookings).catch(() => setBookings([]));
    if (section === 'themes') fetch('/api/theme').then(r => r.json()).then(d => setForm(p => ({ ...p, activeTheme: d.theme }))).catch(() => {});
    if (section === 'requests') fetch('/api/service-requests').then(r => r.json()).then(setRequests).catch(() => setRequests([]));
  }, [section]);

  // CRUD handlers
  function openAdd() { setEditItem(null); setForm({}); setShowForm(true); }
  function openEdit(item: any) { setEditItem(item); setForm({ ...item }); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditItem(null); setForm({}); }

  async function handleSave() {
    const cfg = CRUD_CONFIG[section];
    if (!cfg) return;
    const ep = section === 'orgchart' ? '/api/orgChart' : cfg.endpoint;
    if (editItem) {
      await fetch(`${ep}/${editItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...form } : d));
    } else {
      const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const created = await res.json();
      setData(prev => [...prev, created]);
    }
    closeForm();
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const cfg = CRUD_CONFIG[section];
    if (!cfg) return;
    const ep = section === 'orgchart' ? '/api/orgChart' : cfg.endpoint;
    await fetch(`${ep}/${id}`, { method: 'DELETE' });
    setData(prev => prev.filter(d => d.id !== id));
  }

  async function saveSingle(endpoint: string) {
    await fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  async function cancelBooking(id: number) {
    if (!window.confirm('Cancel this booking?')) return;
    await fetch(`/api/room-bookings/${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
  }

  const cfg = CRUD_CONFIG[section];
  const currentNav = NAV.find(n => n.key === section);

  return (
    <div className={styles.adminShell}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src="/images/logo.png" alt="Saudi Tabreed" style={{ width: 140, filter: 'brightness(10)' }} />
        </div>
        <nav className={styles.sidebarNav}>
          {NAV.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.key} className={section === n.key ? styles.navItemActive : styles.navItem}
                onClick={() => setSection(n.key)}>
                <Icon size={18} /> <span>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.backLink}><ArrowLeft size={14} /> Back to Portal</a>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className={styles.mainCol}>
        <header className={styles.topHeader}>
          <h1 className={styles.headerTitle}>{currentNav?.label || 'Dashboard'}</h1>
          <div className={styles.headerSearch}>
            <Search size={16} />
            <input placeholder="Search..." />
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerAvatar}>AA</div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {/* ─── Dashboard ─── */}
          {section === 'dashboard' && (
            <>
              <div className={styles.statsGrid}>
                {[
                  { label: 'News', val: stats.news, icon: Newspaper, color: '#4A7FD4' },
                  { label: 'Announcements', val: stats.announcements, icon: Megaphone, color: '#14B8A6' },
                  { label: 'Employees', val: stats.employees, icon: Users, color: '#8B5CF6' },
                  { label: 'Rooms', val: stats.rooms, icon: DoorOpen, color: '#22C55E' },
                  { label: 'Bookings', val: bookings.length, icon: Calendar, color: '#F59E0B' },
                  { label: 'Requests', val: requests.length, icon: Headphones, color: '#EF4444' },
                ].map(s => {
                  const I = s.icon;
                  return (
                    <div key={s.label} className={styles.statCard}>
                      <div className={styles.statIcon} style={{ background: s.color }}><I size={22} /></div>
                      <div className={styles.statInfo}>
                        <div className={styles.statNumber}>{s.val}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Recent News</h3></div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th></tr></thead>
                    <tbody>
                      {data.slice(0, 5).map((n: any) => (
                        <tr key={n.id}>
                          <td className={styles.tdBold}>{n.title}</td>
                          <td><span className={`${styles.badge} ${badgeClass(n.category)}`}>{n.category}</span></td>
                          <td>{n.author}</td><td>{n.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ─── CRUD Sections ─── */}
          {cfg && !showForm && section !== 'dashboard' && section !== 'chairman' && section !== 'motivation' && section !== 'reminders' && section !== 'bookings' && section !== 'requests' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Manage {currentNav?.label}</h3>
                <div className={styles.cardActions}>
                  <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add New</Button>
                </div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>{cfg.cols.map(c => <th key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</th>)}<th>Actions</th></tr></thead>
                  <tbody>
                    {data.map((item: any) => (
                      <tr key={item.id}>
                        {cfg.cols.map(c => (
                          <td key={c}>
                            {c === 'image' || c === 'avatar' ? (
                              item[c] ? <img className={styles.thumb} src={item[c]} alt="" /> : '—'
                            ) : c === 'type' || c === 'status' || c === 'category' || c === 'role' ? (
                              <span className={`${styles.badge} ${badgeClass(item[c])}`}>{item[c]}</span>
                            ) : c === 'name' || c === 'title' ? (
                              <span className={styles.tdBold}>{item[c]}</span>
                            ) : String(item[c] ?? '')}
                          </td>
                        ))}
                        <td>
                          <div className={styles.actionGroup}>
                            <button className={styles.actBtn} onClick={() => openEdit(item)}><Edit2 size={15} /></button>
                            <button className={styles.actBtnDanger} onClick={() => handleDelete(item.id)}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CRUD Form ─── */}
          {cfg && showForm && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{editItem ? 'Edit' : 'Add'} {currentNav?.label}</h3>
                <button className={styles.iconBtn} onClick={closeForm}><X size={18} /></button>
              </div>
              <div className={styles.settingsForm}>
                {cfg.fields.map(f => (
                  <div key={f.name} className={styles.settingsField}>
                    <label>{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} rows={4} />
                    ) : f.type === 'select' ? (
                      <select value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}>
                        <option value="">Select...</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type || 'text'} value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
                    )}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <Button variant="ghost" onClick={closeForm}>Cancel</Button>
                  <Button variant="primary" onClick={handleSave}><Save size={16} /> {editItem ? 'Save Changes' : 'Create'}</Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Chairman ─── */}
          {section === 'chairman' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Chairman's Message</h3></div>
              <div className={styles.settingsForm}>
                {[{n:'name',l:'Name'},{n:'title',l:'Title'},{n:'message',l:'Message',t:'textarea'},{n:'image',l:'Photo URL'}].map(f => (
                  <div key={f.n} className={styles.settingsField}>
                    <label>{f.l}</label>
                    {f.t === 'textarea' ? (
                      <textarea value={form[f.n] || ''} onChange={e => setForm(p => ({ ...p, [f.n]: e.target.value }))} rows={5} />
                    ) : (
                      <input value={form[f.n] || ''} onChange={e => setForm(p => ({ ...p, [f.n]: e.target.value }))} />
                    )}
                  </div>
                ))}
                {form.image && <img src={form.image} alt="" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8, border: '2px solid #e5e7eb' }} />}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  {saved && <span style={{ color: '#22C55E', fontWeight: 600, fontSize: '0.875rem', marginInlineEnd: 'auto' }}>Saved!</span>}
                  <Button variant="primary" onClick={() => saveSingle('/api/chairman')}><Save size={16} /> Save Message</Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Motivation ─── */}
          {section === 'motivation' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Weekly Motivation</h3></div>
              <div className={styles.settingsForm}>
                <div className={styles.settingsField}><label>Quote</label><textarea value={form.quote || ''} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} rows={4} /></div>
                <div className={styles.settingsField}><label>Author</label><input value={form.author || ''} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} /></div>
                <div className={styles.settingsField}><label>Background Image URL</label><input value={form.backgroundImage || ''} onChange={e => setForm(p => ({ ...p, backgroundImage: e.target.value }))} /></div>
                {form.backgroundImage && <img src={form.backgroundImage} alt="" style={{ width: 200, height: 100, objectFit: 'cover', borderRadius: 8 }} />}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  {saved && <span style={{ color: '#22C55E', fontWeight: 600, fontSize: '0.875rem', marginInlineEnd: 'auto' }}>Saved!</span>}
                  <Button variant="primary" onClick={() => saveSingle('/api/motivation')}><Save size={16} /> Save</Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Reminders ─── */}
          {section === 'reminders' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Reminder Banner</h3></div>
              <div className={styles.settingsForm}>
                <div className={styles.settingsField}><label>Message</label><input value={form.message || ''} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} /></div>
                <div className={styles.settingsField}><label>Type</label>
                  <select value={form.type || 'info'} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="info">Info</option><option value="warning">Warning</option><option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className={styles.settingsField}><label>Active</label>
                  <select value={form.active ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, active: e.target.value === 'yes' }))}>
                    <option value="yes">Active</option><option value="no">Inactive</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  {saved && <span style={{ color: '#22C55E', fontWeight: 600, fontSize: '0.875rem', marginInlineEnd: 'auto' }}>Saved!</span>}
                  <Button variant="primary" onClick={() => saveSingle('/api/reminder')}><Save size={16} /> Save</Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Bookings ─── */}
          {section === 'bookings' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Room Bookings</h3></div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>Room</th><th>Date</th><th>Time</th><th>Booked By</th><th>Title</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookings.map((b: any) => (
                      <tr key={b.id}>
                        <td className={styles.tdBold}>{b.roomName || `Room ${b.roomId}`}</td>
                        <td>{b.date}</td><td>{b.startTime} - {b.endTime}</td>
                        <td>{b.bookedBy}</td><td>{b.title}</td>
                        <td><span className={`${styles.badge} ${badgeClass(b.status)}`}>{b.status}</span></td>
                        <td><button className={styles.actBtnDanger} onClick={() => cancelBooking(b.id)}><Trash2 size={15} /></button></td>
                      </tr>
                    ))}
                    {bookings.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>No bookings yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Service Requests ─── */}
          {section === 'requests' && !editItem && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Service Requests</h3></div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>ID</th><th>Requester</th><th>Department</th><th>Service</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {requests.map((r: any) => (
                      <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setEditItem(r)}>
                        <td>#{r.id}</td><td className={styles.tdBold}>{r.requesterName}</td>
                        <td>{r.department}</td><td>{r.service}</td>
                        <td><span className={`${styles.badge} ${badgeClass(r.priority)}`}>{r.priority}</span></td>
                        <td><span className={`${styles.badge} ${badgeClass(r.status || 'Pending')}`}>{r.status || 'Pending'}</span></td>
                        <td><button className={styles.actBtn} onClick={(e) => { e.stopPropagation(); setEditItem(r); }}><Eye size={15} /></button></td>
                      </tr>
                    ))}
                    {requests.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>No requests yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Service Request Detail ─── */}
          {section === 'requests' && editItem && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Request #{editItem.id}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" onClick={() => setEditItem(null)}>← Back to List</Button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20 }}>
                {/* Left: Requester Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1B3A6B', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>Requester Information</h4>
                  {[
                    { label: 'Name', value: editItem.requesterName },
                    { label: 'Email', value: editItem.requesterEmail },
                    { label: 'Department', value: editItem.requesterDepartment || editItem.department },
                    { label: 'Submitted', value: editItem.createdAt ? new Date(editItem.createdAt).toLocaleString() : 'N/A' },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>{f.label}</span>
                      <span style={{ fontWeight: 600, color: '#1B3A6B' }}>{f.value || '—'}</span>
                    </div>
                  ))}
                </div>

                {/* Right: Request Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1B3A6B', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>Request Details</h4>
                  {[
                    { label: 'Target Department', value: editItem.department },
                    { label: 'Service', value: editItem.service },
                    { label: 'Priority', value: editItem.priority, isBadge: true },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: '6px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                      <span style={{ color: '#6B7280', fontWeight: 500 }}>{f.label}</span>
                      {f.isBadge ? <span className={`${styles.badge} ${badgeClass(f.value)}`}>{f.value}</span> : <span style={{ fontWeight: 600, color: '#1B3A6B' }}>{f.value || '—'}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Description */}
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1B3A6B', marginBottom: 6 }}>Summary</h4>
                  <p style={{ fontSize: '0.875rem', color: '#374151', background: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>{editItem.summary || '—'}</p>
                </div>

                {editItem.description && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1B3A6B', marginBottom: 6 }}>Description</h4>
                    <p style={{ fontSize: '0.875rem', color: '#374151', background: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', whiteSpace: 'pre-line' }}>{editItem.description}</p>
                  </div>
                )}

                {/* Attachments */}
                {editItem.attachments && editItem.attachments.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1B3A6B', marginBottom: 6 }}>Attachments ({editItem.attachments.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {editItem.attachments.map((att: any, i: number) => (
                        <a key={i} href={att.url || att.path || '#'} target="_blank" rel="noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#EBF3FF', borderRadius: 8, textDecoration: 'none', color: '#1B3A6B', fontWeight: 500, fontSize: '0.8125rem' }}>
                          📎 {att.originalname || att.filename || `Attachment ${i + 1}`}
                          {att.size && <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>({Math.round(att.size / 1024)} KB)</span>}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1B3A6B', marginBottom: 12 }}>Update Status</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Pending', 'In Progress', 'Completed', 'Rejected'].map(status => (
                      <button key={status}
                        onClick={() => {
                          const updated = { ...editItem, status };
                          setEditItem(updated);
                          setRequests(prev => prev.map(r => r.id === editItem.id ? updated : r));
                          fetch(`/api/service-requests/${editItem.id}/status`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status }),
                          }).catch(() => {});
                        }}
                        style={{
                          padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
                          fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s',
                          background: (editItem.status || 'Pending') === status ? (
                            status === 'Completed' ? '#22C55E' : status === 'Rejected' ? '#EF4444' : status === 'In Progress' ? '#F59E0B' : '#4A7FD4'
                          ) : '#e5e7eb',
                          color: (editItem.status || 'Pending') === status ? 'white' : '#6B7280',
                        }}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ─── Homepage Themes ─── */}
          {section === 'themes' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Homepage Themes</h3></div>
              <p style={{ padding: '0 20px 12px', color: '#6B7280', fontSize: '0.875rem' }}>Choose a homepage layout for all portal users. Changes apply instantly.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '0 20px 20px' }}>
                {[
                  { id: 'modern', name: 'Modern', desc: 'Gradient welcome bar, 2-column grid, glass effects, staggered animations', color: '#4A7FD4', preview: 'linear-gradient(135deg, #EEF2FB, #dbeafe)' },
                  { id: 'executive', name: 'Executive', desc: 'Dark hero banner, corporate stats, bold layout, professional look', color: '#1B3A6B', preview: 'linear-gradient(135deg, #0a1628, #1a3f7a)' },
                  { id: 'minimal', name: 'Minimal', desc: 'Clean masonry layout, light greeting, spotlight stats, airy design', color: '#14B8A6', preview: 'linear-gradient(135deg, #f0fdf4, #ccfbf1)' },
                ].map(t => {
                  const isActive = (form.activeTheme || 'modern') === t.id;
                  return (
                    <div key={t.id} onClick={() => {
                      setForm(p => ({ ...p, activeTheme: t.id }));
                      fetch('/api/theme', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme: t.id }) });
                      setSaved(true); setTimeout(() => setSaved(false), 2500);
                    }}
                    style={{
                      border: isActive ? `2px solid ${t.color}` : '2px solid #e5e7eb',
                      borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                      transition: 'all 0.25s', transform: isActive ? 'scale(1.02)' : 'none',
                      boxShadow: isActive ? `0 8px 24px ${t.color}25` : 'none',
                    }}>
                      {/* Theme Preview */}
                      <div style={{ height: 120, background: t.preview, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isActive && (
                          <div style={{ background: t.color, color: 'white', padding: '4px 14px', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 700, position: 'absolute', top: 8, right: 8 }}>
                            ACTIVE
                          </div>
                        )}
                        <div style={{ width: '80%', height: '70%', background: 'rgba(255,255,255,0.6)', borderRadius: 8, backdropFilter: 'blur(4px)', display: 'flex', gap: 4, padding: 8 }}>
                          <div style={{ flex: 2, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
                          </div>
                        </div>
                      </div>
                      {/* Theme Info */}
                      <div style={{ padding: 14 }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1B3A6B', marginBottom: 4 }}>{t.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5 }}>{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {saved && <p style={{ textAlign: 'center', color: '#22C55E', fontWeight: 600, fontSize: '0.875rem', paddingBottom: 16 }}>Theme applied successfully!</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

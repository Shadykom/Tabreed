import { useState, useEffect } from 'react';
import {
  Settings, ArrowLeft, Newspaper, Megaphone, Users, DoorOpen,
  Plus, Edit2, Trash2, BarChart3, Building2, MessageSquare, Save, X,
  Network, MapPin, Shield, Sparkles, Bell, LayoutGrid,
} from 'lucide-react';
import Button from '../../components/common/Button';
import styles from './AdminLayout.module.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'news' | 'announcements' | 'employees' | 'rooms' | 'chairman' | 'orgchart' | 'applications' | 'locations' | 'safelocations' | 'motivation' | 'reminders';

interface Stats {
  news: number;
  announcements: number;
  employees: number;
  rooms: number;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  author: string;
  image: string;
  date: string;
}

interface AnnouncementItem {
  id: number;
  title: string;
  type: string;
  department: string;
  date: string;
}

interface Employee {
  id: number;
  name: string;
  department: string;
  title: string;
  avatar: string;
}

interface MeetingRoom {
  id: number;
  name: string;
  image: string;
  capacity: number;
  floor: string;
  status: 'available' | 'busy';
}

interface Chairman {
  name: string;
  title: string;
  message: string;
  image: string;
}

interface OrgMember {
  id: number;
  name: string;
  title: string;
  avatar: string;
  parentId: number | null;
}

interface Application {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  url: string;
}

interface OfficeLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  type: string;
}

interface SafeLocation {
  id: number;
  name: string;
  address: string;
  image: string;
}

interface Motivation {
  quote: string;
  author: string;
  backgroundImage: string;
}

interface Reminder {
  message: string;
  type: string;
  active: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nextId<T extends { id: number }>(arr: T[]): number {
  return arr.length === 0 ? 1 : Math.max(...arr.map((x) => x.id)) + 1;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── News Form ────────────────────────────────────────────────────────────────

interface NewsFormProps {
  initial?: NewsItem;
  onSave: (item: NewsItem) => void;
  onCancel: () => void;
  nextIdValue: number;
}

const NEWS_CATEGORIES = ['CORPORATE', 'PROJECTS', 'INNOVATION', 'HSE', 'HR'];

function NewsForm({ initial, onSave, onCancel, nextIdValue }: NewsFormProps) {
  const [form, setForm] = useState<NewsItem>(
    initial ?? {
      id: nextIdValue,
      title: '',
      summary: '',
      category: 'CORPORATE',
      author: '',
      image: '',
      date: today(),
    }
  );

  const set = (field: keyof NewsItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit News Article' : 'Add News Article'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Title</label>
          <input
            className={styles.formInput}
            placeholder="Enter news title"
            value={form.title}
            onChange={set('title')}
            required
          />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Summary</label>
          <textarea
            className={styles.formTextarea}
            placeholder="Enter news summary"
            value={form.summary}
            onChange={set('summary')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Category</label>
          <select className={styles.formSelect} value={form.category} onChange={set('category')}>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Author</label>
          <input
            className={styles.formInput}
            placeholder="Author name"
            value={form.author}
            onChange={set('author')}
          />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Image URL</label>
          <input
            className={styles.formInput}
            placeholder="https://..."
            value={form.image}
            onChange={set('image')}
          />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}>
            <X size={16} style={{ marginInlineEnd: 4 }} /> Cancel
          </Button>
          <Button variant="primary" type="submit">
            <Save size={16} style={{ marginInlineEnd: 4 }} />
            {initial ? 'Save Changes' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Announcements Form ────────────────────────────────────────────────────────

interface AnnouncementFormProps {
  initial?: AnnouncementItem;
  onSave: (item: AnnouncementItem) => void;
  onCancel: () => void;
  nextIdValue: number;
}

const ANNOUNCEMENT_TYPES = ['Important', 'Scheduled', 'Announcement'];

function AnnouncementForm({ initial, onSave, onCancel, nextIdValue }: AnnouncementFormProps) {
  const [form, setForm] = useState<AnnouncementItem>(
    initial ?? {
      id: nextIdValue,
      title: '',
      type: 'Announcement',
      department: '',
      date: today(),
    }
  );

  const set = (field: keyof AnnouncementItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>
          {initial ? 'Edit Announcement' : 'Add Announcement'}
        </span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Title</label>
          <input
            className={styles.formInput}
            placeholder="Announcement title"
            value={form.title}
            onChange={set('title')}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Type</label>
          <select className={styles.formSelect} value={form.type} onChange={set('type')}>
            {ANNOUNCEMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Department</label>
          <input
            className={styles.formInput}
            placeholder="e.g. HR, HSE, Operations"
            value={form.department}
            onChange={set('department')}
          />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}>
            <X size={16} style={{ marginInlineEnd: 4 }} /> Cancel
          </Button>
          <Button variant="primary" type="submit">
            <Save size={16} style={{ marginInlineEnd: 4 }} />
            {initial ? 'Save Changes' : 'Add Announcement'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Employee Form ────────────────────────────────────────────────────────────

interface EmployeeFormProps {
  initial?: Employee;
  onSave: (item: Employee) => void;
  onCancel: () => void;
  nextIdValue: number;
}

function EmployeeForm({ initial, onSave, onCancel, nextIdValue }: EmployeeFormProps) {
  const [form, setForm] = useState<Employee>(
    initial ?? { id: nextIdValue, name: '', department: '', title: '', avatar: '' }
  );

  const set = (field: keyof Employee) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Employee' : 'Add Employee'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input
            className={styles.formInput}
            placeholder="Full name"
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Department</label>
          <input
            className={styles.formInput}
            placeholder="e.g. Engineering, HR, Finance"
            value={form.department}
            onChange={set('department')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Job Title</label>
          <input
            className={styles.formInput}
            placeholder="e.g. VP Projects"
            value={form.title}
            onChange={set('title')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Avatar URL</label>
          <input
            className={styles.formInput}
            placeholder="https://..."
            value={form.avatar}
            onChange={set('avatar')}
          />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}>
            <X size={16} style={{ marginInlineEnd: 4 }} /> Cancel
          </Button>
          <Button variant="primary" type="submit">
            <Save size={16} style={{ marginInlineEnd: 4 }} />
            {initial ? 'Save Changes' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Meeting Room Form ────────────────────────────────────────────────────────

interface RoomFormProps {
  initial?: MeetingRoom;
  onSave: (item: MeetingRoom) => void;
  onCancel: () => void;
  nextIdValue: number;
}

function RoomForm({ initial, onSave, onCancel, nextIdValue }: RoomFormProps) {
  const [form, setForm] = useState<MeetingRoom>(
    initial ?? {
      id: nextIdValue,
      name: '',
      image: '',
      capacity: 10,
      floor: '',
      status: 'available',
    }
  );

  function set(field: keyof MeetingRoom) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'capacity' ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Meeting Room' : 'Add Meeting Room'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Room Name</label>
          <input
            className={styles.formInput}
            placeholder="e.g. Al Rimal"
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Floor</label>
          <input
            className={styles.formInput}
            placeholder="e.g. 2nd Floor"
            value={form.floor}
            onChange={set('floor')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Capacity (persons)</label>
          <input
            className={styles.formInput}
            type="number"
            min={1}
            value={form.capacity}
            onChange={set('capacity')}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Status</label>
          <select className={styles.formSelect} value={form.status} onChange={set('status')}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Image URL</label>
          <input
            className={styles.formInput}
            placeholder="https://..."
            value={form.image}
            onChange={set('image')}
          />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}>
            <X size={16} style={{ marginInlineEnd: 4 }} /> Cancel
          </Button>
          <Button variant="primary" type="submit">
            <Save size={16} style={{ marginInlineEnd: 4 }} />
            {initial ? 'Save Changes' : 'Add Room'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Org Chart Member Form ────────────────────────────────────────────────────

interface OrgMemberFormProps {
  initial?: OrgMember;
  onSave: (item: OrgMember) => void;
  onCancel: () => void;
  nextIdValue: number;
  members: OrgMember[];
}

function OrgMemberForm({ initial, onSave, onCancel, nextIdValue, members }: OrgMemberFormProps) {
  const [form, setForm] = useState<OrgMember>(
    initial ?? { id: nextIdValue, name: '', title: '', avatar: '', parentId: null }
  );

  const set = (field: keyof OrgMember) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = field === 'parentId'
        ? (e.target.value === '' ? null : Number(e.target.value))
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Org Chart Member' : 'Add Org Chart Member'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} placeholder="Full name" value={form.name} onChange={set('name')} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title / Position</label>
          <input className={styles.formInput} placeholder="e.g. VP Finance" value={form.title} onChange={set('title')} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Avatar URL</label>
          <input className={styles.formInput} placeholder="https://..." value={form.avatar} onChange={set('avatar')} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Reports To (Parent)</label>
          <select
            className={styles.formSelect}
            value={form.parentId ?? ''}
            onChange={set('parentId')}
          >
            <option value="">— None (Root) —</option>
            {members.filter(m => m.id !== form.id).map(m => (
              <option key={m.id} value={m.id}>{m.name} – {m.title}</option>
            ))}
          </select>
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}><X size={16} style={{ marginInlineEnd: 4 }} /> Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} style={{ marginInlineEnd: 4 }} />{initial ? 'Save Changes' : 'Add Member'}</Button>
        </div>
      </form>
    </div>
  );
}

// ─── Application Form ─────────────────────────────────────────────────────────

interface ApplicationFormProps {
  initial?: Application;
  onSave: (item: Application) => void;
  onCancel: () => void;
  nextIdValue: number;
}

const APP_CATEGORIES = ['Favorites', 'Core Systems', 'Tools'];
const APP_ICONS = ['building', 'shield', 'pen-tool', 'mail', 'box', 'database', 'settings', 'layout', 'bar-chart-3', 'users'];

function ApplicationForm({ initial, onSave, onCancel, nextIdValue }: ApplicationFormProps) {
  const [form, setForm] = useState<Application>(
    initial ?? { id: nextIdValue, name: '', description: '', category: 'Favorites', icon: 'building', color: '#4A90D9', url: '' }
  );

  const set = (field: keyof Application) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Application' : 'Add Application'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} placeholder="App name" value={form.name} onChange={set('name')} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Category</label>
          <select className={styles.formSelect} value={form.category} onChange={set('category')}>
            {APP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Description</label>
          <input className={styles.formInput} placeholder="Short description" value={form.description} onChange={set('description')} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Icon</label>
          <select className={styles.formSelect} value={form.icon} onChange={set('icon')}>
            {APP_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Color</label>
          <input type="color" className={styles.formInput} value={form.color} onChange={set('color')} style={{ height: 38, padding: '2px 4px', cursor: 'pointer' }} />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>URL</label>
          <input className={styles.formInput} placeholder="https://..." value={form.url} onChange={set('url')} />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}><X size={16} style={{ marginInlineEnd: 4 }} /> Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} style={{ marginInlineEnd: 4 }} />{initial ? 'Save Changes' : 'Add Application'}</Button>
        </div>
      </form>
    </div>
  );
}

// ─── Office Location Form ─────────────────────────────────────────────────────

interface OfficeLocationFormProps {
  initial?: OfficeLocation;
  onSave: (item: OfficeLocation) => void;
  onCancel: () => void;
  nextIdValue: number;
}

function OfficeLocationForm({ initial, onSave, onCancel, nextIdValue }: OfficeLocationFormProps) {
  const [form, setForm] = useState<OfficeLocation>(
    initial ?? { id: nextIdValue, name: '', city: '', address: '', type: 'branch' }
  );

  const set = (field: keyof OfficeLocation) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Office Location' : 'Add Office Location'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} placeholder="Office name" value={form.name} onChange={set('name')} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>City</label>
          <input className={styles.formInput} placeholder="e.g. Riyadh" value={form.city} onChange={set('city')} />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Address</label>
          <input className={styles.formInput} placeholder="Full address" value={form.address} onChange={set('address')} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Type</label>
          <select className={styles.formSelect} value={form.type} onChange={set('type')}>
            <option value="hq">HQ</option>
            <option value="branch">Branch</option>
            <option value="plant">Plant</option>
          </select>
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}><X size={16} style={{ marginInlineEnd: 4 }} /> Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} style={{ marginInlineEnd: 4 }} />{initial ? 'Save Changes' : 'Add Location'}</Button>
        </div>
      </form>
    </div>
  );
}

// ─── Safe Location Form ───────────────────────────────────────────────────────

interface SafeLocationFormProps {
  initial?: SafeLocation;
  onSave: (item: SafeLocation) => void;
  onCancel: () => void;
  nextIdValue: number;
}

function SafeLocationForm({ initial, onSave, onCancel, nextIdValue }: SafeLocationFormProps) {
  const [form, setForm] = useState<SafeLocation>(
    initial ?? { id: nextIdValue, name: '', address: '', image: '' }
  );

  const set = (field: keyof SafeLocation) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{initial ? 'Edit Safe Location' : 'Add Safe Location'}</span>
      </div>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} placeholder="Location name" value={form.name} onChange={set('name')} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Address</label>
          <input className={styles.formInput} placeholder="Assembly point address" value={form.address} onChange={set('address')} />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Image URL</label>
          <input className={styles.formInput} placeholder="https://..." value={form.image} onChange={set('image')} />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" type="button" onClick={onCancel}><X size={16} style={{ marginInlineEnd: 4 }} /> Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} style={{ marginInlineEnd: 4 }} />{initial ? 'Save Changes' : 'Add Safe Location'}</Button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats>({ news: 0, announcements: 0, employees: 0, rooms: 0 });

  // Data state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [, setChairman] = useState<Chairman>({ name: '', title: '', message: '', image: '' });

  // New section data state
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([]);
  const [motivationForm, setMotivationForm] = useState<Motivation>({ quote: '', author: '', backgroundImage: '' });
  const [motivationSaved, setMotivationSaved] = useState(false);
  const [reminderForm, setReminderForm] = useState<Reminder>({ message: '', type: 'info', active: true });
  const [reminderSaved, setReminderSaved] = useState(false);

  // Form visibility & editing state
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | undefined>(undefined);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | undefined>(undefined);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | undefined>(undefined);

  // New sections form visibility & editing state
  const [showOrgMemberForm, setShowOrgMemberForm] = useState(false);
  const [editingOrgMember, setEditingOrgMember] = useState<OrgMember | undefined>(undefined);
  const [showAppForm, setShowAppForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>(undefined);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | undefined>(undefined);
  const [showSafeLocationForm, setShowSafeLocationForm] = useState(false);
  const [editingSafeLocation, setEditingSafeLocation] = useState<SafeLocation | undefined>(undefined);

  // Chairman form state (live form, not modal)
  const [chairmanForm, setChairmanForm] = useState<Chairman>({ name: '', title: '', message: '', image: '' });
  const [chairmanSaved, setChairmanSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(() => {});
    fetch('/api/news').then((r) => r.json()).then((data: NewsItem[]) => setNews(data)).catch(() => {});
    fetch('/api/announcements').then((r) => r.json()).then((data: AnnouncementItem[]) => setAnnouncements(data)).catch(() => {});
    fetch('/api/employees').then((r) => r.json()).then((data: Employee[]) => setEmployees(data)).catch(() => {});
    fetch('/api/meetingRooms').then((r) => r.json()).then((data: MeetingRoom[]) => setRooms(data)).catch(() => {});
    fetch('/api/chairman')
      .then((r) => r.json())
      .then((data: Chairman) => {
        setChairman(data);
        setChairmanForm(data);
      })
      .catch(() => {});
    fetch('/api/orgChart/flat').then((r) => r.json()).then((data: OrgMember[]) => setOrgMembers(data)).catch(() => {});
    fetch('/api/applications').then((r) => r.json()).then((data: Application[]) => setApplications(data)).catch(() => {});
    fetch('/api/officeLocations').then((r) => r.json()).then((data: OfficeLocation[]) => setOfficeLocations(data)).catch(() => {});
    fetch('/api/safeLocations').then((r) => r.json()).then((data: SafeLocation[]) => setSafeLocations(data)).catch(() => {});
    fetch('/api/motivation')
      .then((r) => r.json())
      .then((data: Motivation) => setMotivationForm(data))
      .catch(() => {});
    fetch('/api/reminder')
      .then((r) => r.json())
      .then((data: Reminder) => setReminderForm(data))
      .catch(() => {});
  }, []);

  // Switch tabs — close any open forms
  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setShowNewsForm(false);
    setEditingNews(undefined);
    setShowAnnouncementForm(false);
    setEditingAnnouncement(undefined);
    setShowEmployeeForm(false);
    setEditingEmployee(undefined);
    setShowRoomForm(false);
    setEditingRoom(undefined);
    setShowOrgMemberForm(false);
    setEditingOrgMember(undefined);
    setShowAppForm(false);
    setEditingApp(undefined);
    setShowLocationForm(false);
    setEditingLocation(undefined);
    setShowSafeLocationForm(false);
    setEditingSafeLocation(undefined);
  }

  // ── News CRUD ──
  function openAddNews() { setEditingNews(undefined); setShowNewsForm(true); }
  function openEditNews(item: NewsItem) { setEditingNews(item); setShowNewsForm(true); }
  function closeNewsForm() { setShowNewsForm(false); setEditingNews(undefined); }

  function handleSaveNews(item: NewsItem) {
    if (editingNews) {
      setNews((prev) => prev.map((n) => (n.id === item.id ? item : n)));
    } else {
      setNews((prev) => [...prev, item]);
      setStats((s) => ({ ...s, news: s.news + 1 }));
    }
    closeNewsForm();
  }

  function handleDeleteNews(id: number) {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    setNews((prev) => prev.filter((n) => n.id !== id));
    setStats((s) => ({ ...s, news: Math.max(0, s.news - 1) }));
  }

  // ── Announcements CRUD ──
  function openAddAnnouncement() { setEditingAnnouncement(undefined); setShowAnnouncementForm(true); }
  function openEditAnnouncement(item: AnnouncementItem) { setEditingAnnouncement(item); setShowAnnouncementForm(true); }
  function closeAnnouncementForm() { setShowAnnouncementForm(false); setEditingAnnouncement(undefined); }

  function handleSaveAnnouncement(item: AnnouncementItem) {
    if (editingAnnouncement) {
      setAnnouncements((prev) => prev.map((a) => (a.id === item.id ? item : a)));
    } else {
      setAnnouncements((prev) => [...prev, item]);
      setStats((s) => ({ ...s, announcements: s.announcements + 1 }));
    }
    closeAnnouncementForm();
  }

  function handleDeleteAnnouncement(id: number) {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setStats((s) => ({ ...s, announcements: Math.max(0, s.announcements - 1) }));
  }

  // ── Employees CRUD ──
  function openAddEmployee() { setEditingEmployee(undefined); setShowEmployeeForm(true); }
  function openEditEmployee(item: Employee) { setEditingEmployee(item); setShowEmployeeForm(true); }
  function closeEmployeeForm() { setShowEmployeeForm(false); setEditingEmployee(undefined); }

  function handleSaveEmployee(item: Employee) {
    if (editingEmployee) {
      setEmployees((prev) => prev.map((e) => (e.id === item.id ? item : e)));
    } else {
      setEmployees((prev) => [...prev, item]);
      setStats((s) => ({ ...s, employees: s.employees + 1 }));
    }
    closeEmployeeForm();
  }

  function handleDeleteEmployee(id: number) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setStats((s) => ({ ...s, employees: Math.max(0, s.employees - 1) }));
  }

  // ── Meeting Rooms CRUD ──
  function openAddRoom() { setEditingRoom(undefined); setShowRoomForm(true); }
  function openEditRoom(item: MeetingRoom) { setEditingRoom(item); setShowRoomForm(true); }
  function closeRoomForm() { setShowRoomForm(false); setEditingRoom(undefined); }

  function handleSaveRoom(item: MeetingRoom) {
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === item.id ? item : r)));
    } else {
      setRooms((prev) => [...prev, item]);
      setStats((s) => ({ ...s, rooms: s.rooms + 1 }));
    }
    closeRoomForm();
  }

  function handleDeleteRoom(id: number) {
    if (!window.confirm('Are you sure you want to delete this meeting room?')) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setStats((s) => ({ ...s, rooms: Math.max(0, s.rooms - 1) }));
  }

  // ── Chairman ──
  function handleSaveChairman(e: React.FormEvent) {
    e.preventDefault();
    fetch('/api/chairman', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chairmanForm),
    });
    setChairman(chairmanForm);
    setChairmanSaved(true);
    setTimeout(() => setChairmanSaved(false), 2500);
  }

  // ── Org Chart CRUD ──
  function openAddOrgMember() { setEditingOrgMember(undefined); setShowOrgMemberForm(true); }
  function openEditOrgMember(item: OrgMember) { setEditingOrgMember(item); setShowOrgMemberForm(true); }
  function closeOrgMemberForm() { setShowOrgMemberForm(false); setEditingOrgMember(undefined); }

  async function handleSaveOrgMember(item: OrgMember) {
    try {
      if (editingOrgMember) {
        await fetch(`/api/orgChart/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        setOrgMembers((prev) => prev.map((m) => (m.id === item.id ? item : m)));
      } else {
        const res = await fetch('/api/orgChart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const created = await res.json();
        setOrgMembers((prev) => [...prev, { ...item, id: created.id ?? item.id }]);
      }
    } catch { /* ignore */ }
    closeOrgMemberForm();
  }

  async function handleDeleteOrgMember(id: number) {
    if (!window.confirm('Are you sure you want to delete this org chart member?')) return;
    await fetch(`/api/orgChart/${id}`, { method: 'DELETE' }).catch(() => {});
    setOrgMembers((prev) => prev.filter((m) => m.id !== id));
  }

  // ── Applications CRUD ──
  function openAddApp() { setEditingApp(undefined); setShowAppForm(true); }
  function openEditApp(item: Application) { setEditingApp(item); setShowAppForm(true); }
  function closeAppForm() { setShowAppForm(false); setEditingApp(undefined); }

  async function handleSaveApp(item: Application) {
    try {
      if (editingApp) {
        await fetch(`/api/applications/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        setApplications((prev) => prev.map((a) => (a.id === item.id ? item : a)));
      } else {
        const res = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const created = await res.json();
        setApplications((prev) => [...prev, { ...item, id: created.id ?? item.id }]);
      }
    } catch { /* ignore */ }
    closeAppForm();
  }

  async function handleDeleteApp(id: number) {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    await fetch(`/api/applications/${id}`, { method: 'DELETE' }).catch(() => {});
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  // ── Office Locations CRUD ──
  function openAddLocation() { setEditingLocation(undefined); setShowLocationForm(true); }
  function openEditLocation(item: OfficeLocation) { setEditingLocation(item); setShowLocationForm(true); }
  function closeLocationForm() { setShowLocationForm(false); setEditingLocation(undefined); }

  async function handleSaveLocation(item: OfficeLocation) {
    try {
      if (editingLocation) {
        await fetch(`/api/officeLocations/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        setOfficeLocations((prev) => prev.map((l) => (l.id === item.id ? item : l)));
      } else {
        const res = await fetch('/api/officeLocations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const created = await res.json();
        setOfficeLocations((prev) => [...prev, { ...item, id: created.id ?? item.id }]);
      }
    } catch { /* ignore */ }
    closeLocationForm();
  }

  async function handleDeleteLocation(id: number) {
    if (!window.confirm('Are you sure you want to delete this office location?')) return;
    await fetch(`/api/officeLocations/${id}`, { method: 'DELETE' }).catch(() => {});
    setOfficeLocations((prev) => prev.filter((l) => l.id !== id));
  }

  // ── Safe Locations CRUD ──
  function openAddSafeLocation() { setEditingSafeLocation(undefined); setShowSafeLocationForm(true); }
  function openEditSafeLocation(item: SafeLocation) { setEditingSafeLocation(item); setShowSafeLocationForm(true); }
  function closeSafeLocationForm() { setShowSafeLocationForm(false); setEditingSafeLocation(undefined); }

  async function handleSaveSafeLocation(item: SafeLocation) {
    try {
      if (editingSafeLocation) {
        await fetch(`/api/safeLocations/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        setSafeLocations((prev) => prev.map((l) => (l.id === item.id ? item : l)));
      } else {
        const res = await fetch('/api/safeLocations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const created = await res.json();
        setSafeLocations((prev) => [...prev, { ...item, id: created.id ?? item.id }]);
      }
    } catch { /* ignore */ }
    closeSafeLocationForm();
  }

  async function handleDeleteSafeLocation(id: number) {
    if (!window.confirm('Are you sure you want to delete this safe location?')) return;
    await fetch(`/api/safeLocations/${id}`, { method: 'DELETE' }).catch(() => {});
    setSafeLocations((prev) => prev.filter((l) => l.id !== id));
  }

  // ── Motivation save ──
  async function handleSaveMotivation(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/motivation', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(motivationForm) }).catch(() => {});
    setMotivationSaved(true);
    setTimeout(() => setMotivationSaved(false), 2500);
  }

  // ── Reminder save ──
  async function handleSaveReminder(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/reminder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reminderForm) }).catch(() => {});
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 2500);
  }

  // ── Badge helper ──
  function announcementBadgeClass(type: string) {
    if (type === 'Important') return styles.badgePublished;
    if (type === 'Scheduled') return styles.badgeDraft;
    return styles.badge;
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'announcements', label: 'Announcements', icon: Megaphone },
    { key: 'employees', label: 'Employees', icon: Users },
    { key: 'rooms', label: 'Meeting Rooms', icon: DoorOpen },
    { key: 'chairman', label: "Chairman's Message", icon: MessageSquare },
    { key: 'orgchart', label: 'Org Chart', icon: Network },
    { key: 'applications', label: 'Applications', icon: LayoutGrid },
    { key: 'locations', label: 'Office Locations', icon: MapPin },
    { key: 'safelocations', label: 'Safe Locations', icon: Shield },
    { key: 'motivation', label: 'Weekly Motivation', icon: Sparkles },
    { key: 'reminders', label: 'Reminders', icon: Bell },
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
              onClick={() => switchTab(tab.key)}
            >
              <Icon size={16} style={{ marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* ── Dashboard ── */}
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
                      <td>
                        {n.image && <img className={styles.thumbnail} src={n.image} alt="" />}
                      </td>
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

        {/* ── News Management ── */}
        {activeTab === 'news' && !showNewsForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage News Articles</span>
              <Button variant="primary" onClick={openAddNews}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add News
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.image && <img className={styles.thumbnail} src={n.image} alt="" />}
                    </td>
                    <td><strong>{n.title}</strong></td>
                    <td><span className={styles.badgePublished}>{n.category}</span></td>
                    <td>{n.author}</td>
                    <td>{n.date}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Edit"
                          onClick={() => openEditNews(n)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.actionBtnDanger}
                          title="Delete"
                          onClick={() => handleDeleteNews(n.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'news' && showNewsForm && (
          <NewsForm
            initial={editingNews}
            onSave={handleSaveNews}
            onCancel={closeNewsForm}
            nextIdValue={nextId(news)}
          />
        )}

        {/* ── Announcements Management ── */}
        {activeTab === 'announcements' && !showAnnouncementForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Announcements</span>
              <Button variant="primary" onClick={openAddAnnouncement}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Announcement
              </Button>
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
                      <span className={announcementBadgeClass(a.type)}>{a.type}</span>
                    </td>
                    <td>{a.department}</td>
                    <td>{a.date}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Edit"
                          onClick={() => openEditAnnouncement(a)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.actionBtnDanger}
                          title="Delete"
                          onClick={() => handleDeleteAnnouncement(a.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'announcements' && showAnnouncementForm && (
          <AnnouncementForm
            initial={editingAnnouncement}
            onSave={handleSaveAnnouncement}
            onCancel={closeAnnouncementForm}
            nextIdValue={nextId(announcements)}
          />
        )}

        {/* ── Employees Management ── */}
        {activeTab === 'employees' && !showEmployeeForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Employees</span>
              <Button variant="primary" onClick={openAddEmployee}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Employee
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--color-accent-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-accent)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.department}</td>
                    <td>{emp.title}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Edit"
                          onClick={() => openEditEmployee(emp)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.actionBtnDanger}
                          title="Delete"
                          onClick={() => handleDeleteEmployee(emp.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employees' && showEmployeeForm && (
          <EmployeeForm
            initial={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={closeEmployeeForm}
            nextIdValue={nextId(employees)}
          />
        )}

        {/* ── Meeting Rooms Management ── */}
        {activeTab === 'rooms' && !showRoomForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Meeting Rooms</span>
              <Button variant="primary" onClick={openAddRoom}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Room
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Floor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      {room.image && (
                        <img className={styles.thumbnail} src={room.image} alt={room.name} />
                      )}
                    </td>
                    <td><strong>{room.name}</strong></td>
                    <td>{room.capacity} persons</td>
                    <td>{room.floor}</td>
                    <td>
                      <span
                        className={room.status === 'available' ? styles.badgePublished : styles.badgeDraft}
                      >
                        {room.status === 'available' ? 'Available' : 'Busy'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Edit"
                          onClick={() => openEditRoom(room)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={styles.actionBtnDanger}
                          title="Delete"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rooms' && showRoomForm && (
          <RoomForm
            initial={editingRoom}
            onSave={handleSaveRoom}
            onCancel={closeRoomForm}
            nextIdValue={nextId(rooms)}
          />
        )}

        {/* ── Chairman's Message ── */}
        {activeTab === 'chairman' && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Chairman's Message</span>
            </div>
            <form className={styles.formGrid} onSubmit={handleSaveChairman}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input
                  className={styles.formInput}
                  placeholder="Chairman's full name"
                  value={chairmanForm.name}
                  onChange={(e) => setChairmanForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title / Position</label>
                <input
                  className={styles.formInput}
                  placeholder="e.g. Chairman of the Board"
                  value={chairmanForm.title}
                  onChange={(e) => setChairmanForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ height: 160 }}
                  placeholder="Chairman's message to employees..."
                  value={chairmanForm.message}
                  onChange={(e) => setChairmanForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Photo URL</label>
                <input
                  className={styles.formInput}
                  placeholder="https://..."
                  value={chairmanForm.image}
                  onChange={(e) => setChairmanForm((prev) => ({ ...prev, image: e.target.value }))}
                />
              </div>
              {chairmanForm.image && (
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Preview</label>
                  <img
                    src={chairmanForm.image}
                    alt="Chairman preview"
                    style={{
                      width: 80,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-border)',
                    }}
                  />
                </div>
              )}
              <div className={styles.formActions}>
                {chairmanSaved && (
                  <span
                    style={{
                      color: 'var(--color-success)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginInlineEnd: 'auto',
                    }}
                  >
                    Saved successfully!
                  </span>
                )}
                <Button variant="primary" type="submit">
                  <Save size={16} style={{ marginInlineEnd: 4 }} /> Save Message
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── Org Chart Management ── */}
        {activeTab === 'orgchart' && !showOrgMemberForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Org Chart</span>
              <Button variant="primary" onClick={openAddOrgMember}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Member
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Reports To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgMembers.map((m) => {
                  const parent = orgMembers.find((p) => p.id === m.parentId);
                  return (
                    <tr key={m.id}>
                      <td>
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.875rem' }}>
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.title}</td>
                      <td>{parent ? parent.name : <em style={{ color: 'var(--color-text-muted)' }}>Root</em>}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} title="Edit" onClick={() => openEditOrgMember(m)}>
                            <Edit2 size={16} />
                          </button>
                          <button className={styles.actionBtnDanger} title="Delete" onClick={() => handleDeleteOrgMember(m.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orgchart' && showOrgMemberForm && (
          <OrgMemberForm
            initial={editingOrgMember}
            onSave={handleSaveOrgMember}
            onCancel={closeOrgMemberForm}
            nextIdValue={nextId(orgMembers)}
            members={orgMembers}
          />
        )}

        {/* ── Applications Management ── */}
        {activeTab === 'applications' && !showAppForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Applications</span>
              <Button variant="primary" onClick={openAddApp}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Application
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: app.color, border: '1px solid var(--color-border)' }} />
                    </td>
                    <td><strong>{app.name}</strong></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.description}</td>
                    <td><span className={styles.badge}>{app.category}</span></td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={app.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>{app.url}</a>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Edit" onClick={() => openEditApp(app)}>
                          <Edit2 size={16} />
                        </button>
                        <button className={styles.actionBtnDanger} title="Delete" onClick={() => handleDeleteApp(app.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'applications' && showAppForm && (
          <ApplicationForm
            initial={editingApp}
            onSave={handleSaveApp}
            onCancel={closeAppForm}
            nextIdValue={nextId(applications)}
          />
        )}

        {/* ── Office Locations Management ── */}
        {activeTab === 'locations' && !showLocationForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Office Locations</span>
              <Button variant="primary" onClick={openAddLocation}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Location
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officeLocations.map((loc) => (
                  <tr key={loc.id}>
                    <td><strong>{loc.name}</strong></td>
                    <td>{loc.city}</td>
                    <td>{loc.address}</td>
                    <td>
                      <span className={loc.type === 'hq' ? styles.badgePublished : loc.type === 'plant' ? styles.badgeDraft : styles.badge}>
                        {loc.type.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Edit" onClick={() => openEditLocation(loc)}>
                          <Edit2 size={16} />
                        </button>
                        <button className={styles.actionBtnDanger} title="Delete" onClick={() => handleDeleteLocation(loc.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'locations' && showLocationForm && (
          <OfficeLocationForm
            initial={editingLocation}
            onSave={handleSaveLocation}
            onCancel={closeLocationForm}
            nextIdValue={nextId(officeLocations)}
          />
        )}

        {/* ── Safe Locations Management ── */}
        {activeTab === 'safelocations' && !showSafeLocationForm && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Manage Safe Locations</span>
              <Button variant="primary" onClick={openAddSafeLocation}>
                <Plus size={16} style={{ marginInlineEnd: 4 }} /> Add Safe Location
              </Button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeLocations.map((loc) => (
                  <tr key={loc.id}>
                    <td>
                      {loc.image && <img className={styles.thumbnail} src={loc.image} alt={loc.name} />}
                    </td>
                    <td><strong>{loc.name}</strong></td>
                    <td>{loc.address}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Edit" onClick={() => openEditSafeLocation(loc)}>
                          <Edit2 size={16} />
                        </button>
                        <button className={styles.actionBtnDanger} title="Delete" onClick={() => handleDeleteSafeLocation(loc.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'safelocations' && showSafeLocationForm && (
          <SafeLocationForm
            initial={editingSafeLocation}
            onSave={handleSaveSafeLocation}
            onCancel={closeSafeLocationForm}
            nextIdValue={nextId(safeLocations)}
          />
        )}

        {/* ── Weekly Motivation ── */}
        {activeTab === 'motivation' && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Weekly Motivation</span>
            </div>
            <form className={styles.formGrid} onSubmit={handleSaveMotivation}>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Quote</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ height: 120 }}
                  placeholder="Enter the motivational quote..."
                  value={motivationForm.quote}
                  onChange={(e) => setMotivationForm((prev) => ({ ...prev, quote: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Author</label>
                <input
                  className={styles.formInput}
                  placeholder="e.g. Steve Jobs"
                  value={motivationForm.author}
                  onChange={(e) => setMotivationForm((prev) => ({ ...prev, author: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Background Image URL</label>
                <input
                  className={styles.formInput}
                  placeholder="https://..."
                  value={motivationForm.backgroundImage}
                  onChange={(e) => setMotivationForm((prev) => ({ ...prev, backgroundImage: e.target.value }))}
                />
              </div>
              {motivationForm.backgroundImage && (
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Preview</label>
                  <img
                    src={motivationForm.backgroundImage}
                    alt="Motivation background preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)' }}
                  />
                </div>
              )}
              <div className={styles.formActions}>
                {motivationSaved && (
                  <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 600, marginInlineEnd: 'auto' }}>
                    Saved successfully!
                  </span>
                )}
                <Button variant="primary" type="submit">
                  <Save size={16} style={{ marginInlineEnd: 4 }} /> Save Motivation
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── Reminders / Banners ── */}
        {activeTab === 'reminders' && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Reminder / Banner</span>
            </div>
            <form className={styles.formGrid} onSubmit={handleSaveReminder}>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ height: 100 }}
                  placeholder="Enter the reminder or banner message..."
                  value={reminderForm.message}
                  onChange={(e) => setReminderForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Type</label>
                <select
                  className={styles.formSelect}
                  value={reminderForm.type}
                  onChange={(e) => setReminderForm((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Active</label>
                <select
                  className={styles.formSelect}
                  value={reminderForm.active ? 'true' : 'false'}
                  onChange={(e) => setReminderForm((prev) => ({ ...prev, active: e.target.value === 'true' }))}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className={styles.formActions}>
                {reminderSaved && (
                  <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 600, marginInlineEnd: 'auto' }}>
                    Saved successfully!
                  </span>
                )}
                <Button variant="primary" type="submit">
                  <Save size={16} style={{ marginInlineEnd: 4 }} /> Save Reminder
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

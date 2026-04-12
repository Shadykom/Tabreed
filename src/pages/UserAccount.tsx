import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail, Phone, Building2, Calendar, Hash, Camera,
  FileText, Users, BarChart3, Clock,
  CheckCircle, Bell, Eye, LogIn,
} from 'lucide-react';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useApp } from '../hooks/useApp';
import styles from './UserAccount.module.scss';

interface ActivityEntry {
  id: number;
  icon: React.ElementType;
  action: string;
  target: string;
  time: string;
  variant: 'important' | 'scheduled' | 'announcement' | 'info';
}

const ACTIVITY_LOG: ActivityEntry[] = [
  {
    id: 1,
    icon: LogIn,
    action: 'Signed in',
    target: 'Portal',
    time: 'Today, 09:12 AM',
    variant: 'info',
  },
  {
    id: 2,
    icon: Eye,
    action: 'Viewed',
    target: 'HSE Guidelines v3.2',
    time: 'Today, 09:30 AM',
    variant: 'scheduled',
  },
  {
    id: 3,
    icon: Bell,
    action: 'Read announcement',
    target: 'Q2 Performance Review',
    time: 'Today, 10:05 AM',
    variant: 'announcement',
  },
  {
    id: 4,
    icon: CheckCircle,
    action: 'Submitted',
    target: 'Monthly HSE Report',
    time: 'Yesterday, 04:45 PM',
    variant: 'important',
  },
  {
    id: 5,
    icon: Eye,
    action: 'Viewed',
    target: 'Tabreed Expansion News',
    time: 'Yesterday, 02:20 PM',
    variant: 'info',
  },
  {
    id: 6,
    icon: Users,
    action: 'Accessed',
    target: 'Engineering Department',
    time: '2 days ago',
    variant: 'scheduled',
  },
];

const STATS = [
  { icon: FileText, label: 'Documents Viewed', value: '48', color: '#4A7FD4', bg: '#E8F0FE' },
  { icon: Users, label: 'Meetings Attended', value: '12', color: '#22C55E', bg: '#DCFCE7' },
  { icon: BarChart3, label: 'Reports Submitted', value: '7', color: '#F59E0B', bg: '#FEF3C7' },
  { icon: Bell, label: 'Announcements Read', value: '34', color: '#8B5CF6', bg: '#EDE9FE' },
];

export default function UserAccount() {
  const { i18n } = useTranslation();
  const { user, setUserAvatar } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setUserAvatar(previewUrl);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.avatarUrl) {
        setUserAvatar(data.avatarUrl);
      }
    } catch {
      // Keep the preview URL as fallback
    }
  };
  const isAR = i18n.language === 'ar';

  const displayName = isAR ? user.nameAr : user.name;
  const displayTitle = isAR ? user.titleAr : user.title;

  const profileFields = [
    {
      icon: Hash,
      label: 'Employee ID',
      value: `EMP-${String(user.id).padStart(4, '0')}`,
    },
    {
      icon: Building2,
      label: 'Department',
      value: user.department,
    },
    {
      icon: Mail,
      label: 'Email',
      value: `${user.name.toLowerCase().replace(' ', '.')}@tabreed.sa`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+966 50 000 0001',
    },
    {
      icon: Calendar,
      label: 'Join Date',
      value: 'March 12, 2019',
    },
    {
      icon: Clock,
      label: 'Last Active',
      value: 'Today, 09:12 AM',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroAvatar} onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }}>
            <Avatar name={user.name} src={user.avatar} size="xl" />
            <div className={styles.avatarOverlay}>
              <Camera size={18} />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroName}>{displayName}</h1>
            <p className={styles.heroTitle}>{displayTitle}</p>
            <div className={styles.heroBadges}>
              <Badge variant="info">{user.department}</Badge>
              <span className={styles.onlineIndicator}>
                <span className={styles.onlineDot} />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Profile Info */}
          <Card title="Profile Information" className={styles.profileCard}>
            <div className={styles.profileList}>
              {profileFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.label} className={styles.profileRow}>
                    <div className={styles.profileIcon}>
                      <Icon size={15} />
                    </div>
                    <div className={styles.profileField}>
                      <span className={styles.fieldLabel}>{field.label}</span>
                      <span className={styles.fieldValue}>{field.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Activity Overview" className={styles.statsCard}>
            <div className={styles.statsGrid}>
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className={styles.statItem}>
                    <div
                      className={styles.statIcon}
                      style={{ background: stat.bg, color: stat.color }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <Card title="Recent Activity" className={styles.activityCard}>
            <div className={styles.activityList}>
              {ACTIVITY_LOG.map((entry, idx) => {
                const Icon = entry.icon;
                return (
                  <div key={entry.id} className={styles.activityEntry}>
                    <div className={styles.activityTimeline}>
                      <div className={styles.activityDot}>
                        <Icon size={14} />
                      </div>
                      {idx < ACTIVITY_LOG.length - 1 && (
                        <div className={styles.activityLine} />
                      )}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <span className={styles.activityAction}>{entry.action}</span>
                        <Badge variant={entry.variant}>
                          {entry.target}
                        </Badge>
                      </div>
                      <span className={styles.activityTime}>
                        <Clock size={11} />
                        {entry.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

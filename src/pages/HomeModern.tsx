import ReminderBanner from '../components/ReminderBanner/ReminderBanner';
import LatestNews from '../components/LatestNews/LatestNews';
import ChairmanMessage from '../components/ChairmanMessage/ChairmanMessage';
import Announcements from '../components/Announcements/Announcements';
import ApplicationList from '../components/ApplicationList/ApplicationList';
import WeeklyMotivation from '../components/WeeklyMotivation/WeeklyMotivation';
import OfficeLocations from '../components/OfficeLocations/OfficeLocations';
import OrgChart from '../components/OrgChart/OrgChart';
import EmployeeDirectory from '../components/EmployeeDirectory/EmployeeDirectory';
import SafeLocations from '../components/SafeLocations/SafeLocations';
import MeetingRooms from '../components/MeetingRooms/MeetingRooms';
import styles from './Home.module.scss';

export default function HomeModern() {
  return (
    <>
      {/* Welcome Bar */}
      <div className={styles.welcomeBar}>
        <div className={styles.welcomeText}>
          <h2>Welcome back, Ahmed</h2>
          <p>Saudi Tabreed District Cooling Company &bull; Dashboard</p>
        </div>
        <div className={styles.quickStats}>
          <div className={styles.statBadge}>
            <span className={styles.statIcon}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></span>
            <span className={styles.statValue}>751,000 TR</span>
            <span className={styles.statLabel}>Capacity</span>
          </div>
          <div className={styles.statBadge}>
            <span className={styles.statIcon}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg></span>
            <span className={styles.statValue}>8</span>
            <span className={styles.statLabel}>Projects</span>
          </div>
          <div className={styles.statBadge}>
            <span className={styles.statIcon}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg></span>
            <span className={styles.statValue}>394</span>
            <span className={styles.statLabel}>Employees</span>
          </div>
        </div>
      </div>

      <ReminderBanner />

      <div className={styles.dashboard}>
        <div className={styles.newsSection}><LatestNews /></div>
        <div className={styles.chairmanSection}><ChairmanMessage /></div>
        <div className={styles.announcementsSection}><Announcements /></div>
        <div className={styles.appsSection}><ApplicationList /></div>
        <div className={styles.motivationSection}><WeeklyMotivation /></div>
        <div className={styles.locationsSection}><OfficeLocations /></div>
        <div className={styles.orgChartSection}><OrgChart /></div>
        <div className={styles.directorySection}><EmployeeDirectory /></div>
        <div className={styles.roomsSection}><MeetingRooms /></div>
        <div className={styles.safeSection}><SafeLocations /></div>
      </div>
    </>
  );
}

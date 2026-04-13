import ReminderBanner from '../../components/ReminderBanner/ReminderBanner';
import LatestNews from '../../components/LatestNews/LatestNews';
import ChairmanMessage from '../../components/ChairmanMessage/ChairmanMessage';
import Announcements from '../../components/Announcements/Announcements';
import ApplicationList from '../../components/ApplicationList/ApplicationList';
import WeeklyMotivation from '../../components/WeeklyMotivation/WeeklyMotivation';
import OfficeLocations from '../../components/OfficeLocations/OfficeLocations';
import OrgChart from '../../components/OrgChart/OrgChart';
import EmployeeDirectory from '../../components/EmployeeDirectory/EmployeeDirectory';
import SafeLocations from '../../components/SafeLocations/SafeLocations';
import MeetingRooms from '../../components/MeetingRooms/MeetingRooms';
import styles from './ThemeExecutive.module.scss';

export default function ThemeExecutive() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Executive Hero - Left border accent, stats row, newspaper feel */}
      <div className={styles.hero}>
        <div className={styles.heroDots} />
        <div className={styles.heroLeft}>
          <h1>Saudi Tabreed Portal</h1>
          <p>District Cooling Company — Internal Dashboard</p>
          <div className={styles.heroStatsRow}>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>751K</span><span className={styles.heroStatLabel}>TR Capacity</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>8+</span><span className={styles.heroStatLabel}>Projects</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>394</span><span className={styles.heroStatLabel}>Employees</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>6M</span><span className={styles.heroStatLabel}>TR Target</span></div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <img src="/images/logo.png" alt="" className={styles.heroLogo} />
          <span className={styles.heroDate}>{today}</span>
        </div>
      </div>

      <ReminderBanner />

      {/* 3-column newspaper layout */}
      <div className={styles.grid3}>
        <div className={styles.span2}><LatestNews /></div>
        <div><ChairmanMessage /></div>
      </div>

      <div className={styles.grid3}>
        <div><Announcements /></div>
        <div><OrgChart /></div>
        <div><OfficeLocations /></div>
      </div>

      <div className={styles.span3} style={{ marginBottom: 12 }}><ApplicationList /></div>

      <div className={styles.grid2}>
        <div><WeeklyMotivation /></div>
        <div><EmployeeDirectory /></div>
      </div>

      <div className={styles.grid2}>
        <div><MeetingRooms /></div>
        <div><SafeLocations /></div>
      </div>
    </>
  );
}

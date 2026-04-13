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
  return (
    <>
      {/* Dark Hero Banner */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <img src="/images/logo.png" alt="" className={styles.heroLogo} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Saudi Tabreed Dashboard</h1>
          <p className={styles.heroSub}>District Cooling Company &bull; Internal Portal</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>751K</span><span className={styles.heroStatLabel}>TR Capacity</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>8+</span><span className={styles.heroStatLabel}>Projects</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>394</span><span className={styles.heroStatLabel}>Employees</span></div>
          </div>
        </div>
      </div>

      <ReminderBanner />

      <div className={styles.grid}>
        <div><LatestNews /></div>
        <div><ChairmanMessage /></div>
      </div>

      <div className={styles.gridRow} style={{ marginTop: 14 }}>
        <div><Announcements /></div>
        <div><OrgChart /></div>
      </div>

      <div className={styles.gridFull} style={{ marginTop: 14 }}><ApplicationList /></div>
      <div className={styles.gridFull} style={{ marginTop: 14 }}><WeeklyMotivation /></div>

      <div className={styles.gridRow} style={{ marginTop: 14 }}>
        <div><OfficeLocations /></div>
        <div><EmployeeDirectory /></div>
      </div>

      <div className={styles.gridRow} style={{ marginTop: 14 }}>
        <div><SafeLocations /></div>
        <div><MeetingRooms /></div>
      </div>
    </>
  );
}

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

export default function Home() {
  return (
    <>
      <ReminderBanner />

      <div className={styles.dashboard}>
        <div className={styles.newsSection}>
          <LatestNews />
        </div>
        <div className={styles.chairmanSection}>
          <ChairmanMessage />
        </div>

        <div className={styles.announcementsSection}>
          <Announcements />
        </div>

        <div className={styles.appsSection}>
          <ApplicationList />
        </div>

        <div className={styles.motivationSection}>
          <WeeklyMotivation />
        </div>
        <div className={styles.locationsSection}>
          <OfficeLocations />
        </div>

        <div className={styles.orgChartSection}>
          <OrgChart />
        </div>
        <div className={styles.directorySection}>
          <EmployeeDirectory />
        </div>

        <div className={styles.safeSection}>
          <SafeLocations />
        </div>
        <div className={styles.roomsSection}>
          <MeetingRooms />
        </div>
      </div>
    </>
  );
}

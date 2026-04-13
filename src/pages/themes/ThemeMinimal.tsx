import { Zap } from 'lucide-react';
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
import styles from './ThemeMinimal.module.scss';

export default function ThemeMinimal() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className={styles.welcome}>
        <div className={styles.welcomeLeft}>
          <h1>Good morning, Ahmed</h1>
          <p>Here's what's happening at Saudi Tabreed today</p>
        </div>
        <span className={styles.welcomeDate}>{today}</span>
      </div>

      <div className={styles.spotlight}>
        <div className={styles.spotlightIcon}><Zap size={22} /></div>
        <div className={styles.spotlightText}>
          <h3>751,000 TR Cooling Capacity</h3>
          <p>Serving 8+ mega developments across Saudi Arabia aligned with Vision 2030</p>
        </div>
      </div>

      <ReminderBanner />

      <div className={styles.masonry}>
        <div className={styles.masonryItem}><ChairmanMessage /></div>
        <div className={styles.masonryItem}><LatestNews /></div>
        <div className={styles.masonryItem}><Announcements /></div>
        <div className={styles.masonryItem}><ApplicationList /></div>
        <div className={styles.masonryItem}><OrgChart /></div>
        <div className={styles.masonryItem}><EmployeeDirectory /></div>
        <div className={styles.masonryItem}><WeeklyMotivation /></div>
        <div className={styles.masonryItem}><OfficeLocations /></div>
        <div className={styles.masonryItem}><MeetingRooms /></div>
        <div className={styles.masonryItem}><SafeLocations /></div>
      </div>
    </>
  );
}

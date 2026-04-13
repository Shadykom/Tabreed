import { Zap, Briefcase, Users } from 'lucide-react';
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
  return (
    <>
      {/* Pill-shaped top bar instead of gradient hero */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1>Welcome back, Ahmed</h1>
          <p>Saudi Tabreed District Cooling Company</p>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.pill}><span className={styles.pillIcon}><Zap size={13} /></span> 751K TR</div>
          <div className={styles.pill}><span className={styles.pillIcon}><Briefcase size={13} /></span> 8 Projects</div>
          <div className={styles.pill}><span className={styles.pillIcon}><Users size={13} /></span> 394</div>
        </div>
      </div>

      <ReminderBanner />

      {/* Bento grid - Apple widget style layout */}
      <div className={styles.bento}>
        <div className={styles.bentoWide}><ChairmanMessage /></div>
        <div className={styles.bentoWide}><LatestNews /></div>

        <div className={styles.bentoFull}><ApplicationList /></div>

        <div className={styles.bentoTriple}><Announcements /></div>
        <div><OrgChart /></div>

        <div className={styles.bentoFull}><WeeklyMotivation /></div>

        <div><OfficeLocations /></div>
        <div><EmployeeDirectory /></div>
        <div><MeetingRooms /></div>
        <div><SafeLocations /></div>
      </div>
    </>
  );
}

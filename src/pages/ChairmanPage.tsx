import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import type { ChairmanMessage } from '../types';
import styles from './ChairmanPage.module.scss';

const fullMessage = `Saudi Tabreed's strategy is to grow and to broaden the portfolio across the wider geographical platform of Saudi Arabia.

Thus providing the platform to initiate and facilitate the acceptance and the willingness of the government and semi government entities in Saudi Arabia to partner and co-invest in energy efficient cooling schemes under long-term concessions and sustainable frameworks such as BOO/BOTs.

Our portfolio now comprises 751,000 TR of gross contracted Tons Refrigerant capacity of cooling services which include Saudi Aramco in Dhahran, Jabal Omar in Makkah, King Abdullah Financial District in Riyadh, King Khaled International Airport, The Village Mall in Jeddah, King Fahd University of Petroleum and Minerals Business Park Complex, NEOM Oxagon and The RedSea Project.

In line with Saudi Vision 2030, we aim to raise competitiveness in the local energy sector by providing the most efficient and sustainable district cooling solutions. Our goal for the coming 5 years is to expand the portfolio to 6 Million Tons Refrigerant capacity in the Kingdom of Saudi Arabia.

We are committed to working together as we move forward in our mission to enhance Saudi Arabia's urban development through innovative, advanced, and highly efficient district cooling solutions.`;

export default function ChairmanPage() {
  const navigate = useNavigate();
  const { data: chairman } = useApi<ChairmanMessage>(api.getChairman);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroPattern} />

        <div className={styles.heroContent}>
          <div className={styles.heroQuoteMark}>"</div>
          <h1 className={styles.heroTitle}>
            Saudi Tabreed's strategy is to grow and to broaden the portfolio across the wider geographical platform of Saudi Arabia.
          </h1>
          <div className={styles.authorDivider} />
          <div className={styles.authorName}>{chairman?.name || 'Mohammed Abunayyan'}</div>
          <div className={styles.authorTitle}>{chairman?.title || 'Chairman of the Board'}</div>
        </div>

        <div className={styles.heroPhoto}>
          <img
            className={styles.photoImg}
            src={chairman?.image || ''}
            alt={chairman?.name || 'Chairman'}
          />
        </div>
      </div>

      {/* Full Message */}
      <div className={styles.messageCard}>
        <div className={styles.messageBody}>
          {(chairman?.message || fullMessage).split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.visionBadge}>
          <Target size={16} />
          Aligned with Saudi Vision 2030
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>751,000 <span className={styles.statSuffix}>TR</span></div>
          <div className={styles.statLabel}>Contracted Cooling Capacity</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>6M <span className={styles.statSuffix}>TR</span></div>
          <div className={styles.statLabel}>5-Year Expansion Target</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>8+ <span className={styles.statSuffix}>Projects</span></div>
          <div className={styles.statLabel}>Major Developments Served</div>
        </div>
      </div>
    </div>
  );
}

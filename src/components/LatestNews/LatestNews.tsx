import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, MessageSquare, Share2 } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { NewsArticle } from '../../types';
import styles from './LatestNews.module.scss';

export default function LatestNews() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: news } = useApi<NewsArticle[]>(api.getNews);
  const [search, setSearch] = useState('');

  const filtered = (news || []).filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title={t('news.title')} viewAllText="View All" onViewAll={() => navigate('/news')}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={16} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('news.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.newsList}>
        {filtered.map((article) => (
          <div key={article.id} className={styles.newsItem}>
            <img
              className={styles.thumbnail}
              src={article.image}
              alt={article.title}
              loading="lazy"
            />
            <div className={styles.newsContent}>
              <div className={styles.topRow}>
                <span className={styles.category}>{article.category}</span>
                <span className={styles.shareCount}>
                  <Share2 size={11} /> {article.likes || 0}
                </span>
              </div>
              <div className={styles.newsTitle}>{article.title}</div>
              <div className={styles.newsSummary}>{article.summary}</div>
              <div className={styles.newsMeta}>
                <div className={styles.metaLeft}>
                  <span className={styles.authorTag}>{article.author}</span>
                  <span className={styles.metaItem}>
                    <Clock size={11} /> {article.date}
                  </span>
                  <span className={styles.metaItem}>
                    <MessageSquare size={11} /> {article.comments}
                  </span>
                </div>
                <button className={styles.readMore} onClick={() => navigate(`/news/${article.id}`)}>{t('news.readMore')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

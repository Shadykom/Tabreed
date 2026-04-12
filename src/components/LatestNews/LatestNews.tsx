import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Clock, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { NewsArticle } from '../../types';
import styles from './LatestNews.module.scss';

export default function LatestNews() {
  const { t } = useTranslation();
  const { data: news } = useApi<NewsArticle[]>(api.getNews);
  const [search, setSearch] = useState('');

  const filtered = (news || []).filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title={t('news.title')}>
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
            <div
              className={styles.thumbnail}
              role="img"
              aria-label={article.title}
            />
            <div className={styles.newsContent}>
              <div className={styles.category}>{article.category}</div>
              <div className={styles.newsTitle}>{article.title}</div>
              <div className={styles.newsSummary}>{article.summary}</div>
              <div className={styles.newsMeta}>
                <div className={styles.metaLeft}>
                  <span className={styles.metaItem}>
                    <Clock size={12} />
                    {article.date}
                  </span>
                  <span className={styles.metaItem}>
                    <MessageSquare size={12} />
                    {article.comments}
                  </span>
                </div>
                <button className={styles.readMore}>{t('news.readMore')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

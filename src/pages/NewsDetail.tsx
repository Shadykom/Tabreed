import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Clock, MessageSquare, Heart, Share2,
  Globe, Link2, BookOpen, Tag, User,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import type { NewsArticle } from '../types';
import styles from './NewsDetail.module.scss';

function categoryToVariant(cat: string): 'important' | 'scheduled' | 'announcement' | 'info' {
  const c = cat.toLowerCase();
  if (c.includes('hse') || c.includes('safety') || c.includes('alert')) return 'important';
  if (c.includes('event') || c.includes('schedul')) return 'scheduled';
  if (c.includes('info') || c.includes('update')) return 'info';
  return 'announcement';
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: news, loading, error } = useApi<NewsArticle[]>(api.getNews);

  const article = news?.find((n) => String(n.id) === id);
  const related = news?.filter((n) => String(n.id) !== id).slice(0, 3) ?? [];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton}>
          <div className={`${styles.skeletonHero} skeleton`} />
          <div className={`${styles.skeletonTitle} skeleton`} />
          <div className={`${styles.skeletonBody} skeleton`} />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <BookOpen size={48} className={styles.notFoundIcon} />
          <h2>{error ? 'Failed to load article' : 'Article not found'}</h2>
          <Button variant="primary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> {t('nav.home')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </button>

      <article className={styles.article}>
        {/* Hero Image */}
        <div className={styles.heroWrapper}>
          <img
            className={styles.heroImage}
            src={article.image}
            alt={article.title}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroMeta}>
            <Badge variant={categoryToVariant(article.category)}>
              <Tag size={11} /> {article.category}
            </Badge>
          </div>
        </div>

        {/* Article Body */}
        <Card className={styles.bodyCard}>
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>{article.title}</h1>

            <div className={styles.metaRow}>
              {article.author && (
                <span className={styles.metaItem}>
                  <User size={14} />
                  {article.author}
                </span>
              )}
              <span className={styles.metaItem}>
                <Clock size={14} />
                {article.date}
              </span>
              <span className={styles.metaItem}>
                <MessageSquare size={14} />
                {article.comments} comments
              </span>
              <span className={styles.metaItem}>
                <Heart size={14} />
                {article.likes ?? 0} likes
              </span>
            </div>
          </header>

          <div className={styles.divider} />

          <div className={styles.body}>
            <p className={styles.lead}>{article.summary}</p>
            <p>
              Saudi Tabreed continues to drive sustainable district cooling solutions
              across the Kingdom, reinforcing its commitment to energy efficiency and
              environmental responsibility. This initiative forms part of Tabreed's
              broader Vision 2030 alignment strategy.
            </p>
            <p>
              The company's engineering teams have implemented cutting-edge chilled
              water distribution networks that significantly reduce energy consumption
              compared to traditional air-conditioning systems. By centralising cooling
              production, Tabreed delivers greater reliability and lower lifecycle costs
              to its customers.
            </p>
            <p>
              Management affirmed that upcoming expansions in Riyadh and Jeddah are
              on track, with commissioning expected ahead of schedule. Partnerships with
              leading contractors and technology providers underpin the accelerated
              delivery timeline.
            </p>
          </div>

          {/* Engagement Row */}
          <div className={styles.engagementRow}>
            <div className={styles.engagementLeft}>
              <button className={styles.engageBtn}>
                <Heart size={18} /> <span>{article.likes ?? 0}</span>
              </button>
              <button className={styles.engageBtn}>
                <MessageSquare size={18} /> <span>{article.comments}</span>
              </button>
            </div>

            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>
                <Share2 size={14} /> Share
              </span>
              <button className={`${styles.shareBtn} ${styles.twitter}`} aria-label="Share on Twitter">
                <Globe size={16} />
              </button>
              <button className={`${styles.shareBtn} ${styles.linkedin}`} aria-label="Share on LinkedIn">
                <Globe size={16} />
              </button>
              <button className={`${styles.shareBtn} ${styles.copyLink}`} aria-label="Copy link">
                <Link2 size={16} />
              </button>
            </div>
          </div>
        </Card>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Articles</h2>
            <div className={styles.relatedGrid}>
              {related.map((rel) => (
                <button
                  key={rel.id}
                  className={styles.relatedCard}
                  onClick={() => navigate(`/news/${rel.id}`)}
                >
                  <img
                    className={styles.relatedImage}
                    src={rel.image}
                    alt={rel.title}
                    loading="lazy"
                  />
                  <div className={styles.relatedInfo}>
                    <Badge variant={categoryToVariant(rel.category)}>
                      {rel.category}
                    </Badge>
                    <p className={styles.relatedArticleTitle}>{rel.title}</p>
                    <span className={styles.relatedDate}>
                      <Clock size={11} /> {rel.date}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

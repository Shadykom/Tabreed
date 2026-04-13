import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

interface NewsItem {
  id: number; title: string; summary: string; image: string;
  category: string; date: string; comments: number; author?: string; likes?: number;
}

export default function AllNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(setNews).catch(() => {});
  }, []);

  const categories = ['All', ...new Set(news.map(n => n.category))];

  const filtered = news.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || n.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.4s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)', fontSize: '0.8125rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>All News & Articles</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{filtered.length} articles found</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search news..."
            style={{ width: '100%', height: 42, paddingInlineStart: 42, paddingInlineEnd: 14, border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', outline: 'none', background: 'white' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: 3 }}>
          {categories.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: category === c ? 'var(--color-accent)' : 'transparent', color: category === c ? 'white' : 'var(--color-text-secondary)', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
        {paged.map(article => (
          <Card key={article.id}>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/news/${article.id}`)}>
              {article.image && (
                <img src={article.image} alt={article.title} loading="lazy"
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />
              )}
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '2px 8px', background: 'var(--color-accent-light)', borderRadius: 'var(--radius-full)' }}>
                {article.category}
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '8px 0 6px', lineHeight: 1.4 }}>{article.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
                {article.summary}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  {article.author && <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>{article.author}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {article.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageSquare size={11} /> {article.comments}</span>
                </div>
                <Button variant="primary" size="sm">Read More</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-light)' }}>
          <Calendar size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p>No news articles found matching your search.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, background: 'white' }}>
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', background: page === p ? 'var(--color-accent)' : 'transparent', color: page === p ? 'white' : 'var(--color-text-secondary)' }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1, background: 'white' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

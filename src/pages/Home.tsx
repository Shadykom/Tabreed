import { useState, useEffect, lazy, Suspense } from 'react';

const ThemeModern = lazy(() => import('./HomeModern'));
const ThemeExecutive = lazy(() => import('./themes/ThemeExecutive'));
const ThemeMinimal = lazy(() => import('./themes/ThemeMinimal'));

export default function Home() {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    fetch('/api/theme').then(r => r.json()).then(d => {
      const t = d.theme || 'modern';
      setTheme(t);
      // Apply theme to root element - changes ALL CSS variables globally
      document.documentElement.setAttribute('data-theme', t === 'modern' ? '' : t);
    }).catch(() => {});
  }, []);

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-light)' }}>Loading dashboard...</div>}>
      {theme === 'executive' && <ThemeExecutive />}
      {theme === 'minimal' && <ThemeMinimal />}
      {theme === 'modern' && <ThemeModern />}
    </Suspense>
  );
}

import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load themes
const ThemeModern = lazy(() => import('./HomeModern'));
const ThemeExecutive = lazy(() => import('./themes/ThemeExecutive'));
const ThemeMinimal = lazy(() => import('./themes/ThemeMinimal'));

export default function Home() {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    fetch('/api/theme').then(r => r.json()).then(d => setTheme(d.theme || 'modern')).catch(() => {});
  }, []);

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading dashboard...</div>}>
      {theme === 'executive' && <ThemeExecutive />}
      {theme === 'minimal' && <ThemeMinimal />}
      {theme === 'modern' && <ThemeModern />}
    </Suspense>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

const TEST_USERS = [
  { email: 'admin@sauditabreed.com', password: 'Tabreed@2026', role: 'Admin' },
  { email: 'ahmed.qahtani@sauditabreed.com', password: 'Tabreed@2026', role: 'Editor' },
  { email: 'sara.malik@sauditabreed.com', password: 'Tabreed@2026', role: 'User' },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillTestUser = (u: typeof TEST_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandSide}>
        <div className={styles.brandBg} />
        <div className={styles.brandContent}>
          <svg className={styles.logoIcon} viewBox="0 0 80 80" fill="none">
            <defs>
              <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#88BBFF" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <path d="M40 4l10 16h20l-16 12 6 20-20-14-20 14 6-20-16-12h20z" fill="url(#loginGrad)" opacity="0.95" />
            <circle cx="40" cy="40" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
          </svg>
          <h1 className={styles.brandName}>Saudi Tabreed</h1>
          <p className={styles.brandSubtitle}>Internal Portal</p>
          <p className={styles.brandDesc}>
            Pioneering district cooling solutions across the Kingdom of Saudi Arabia.
            Contracted capacity of 751,000 TR serving mega developments aligned with Vision 2030.
          </p>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>Sign in to access the Saudi Tabreed portal</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input className={styles.input} type="email" placeholder="name@sauditabreed.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input className={styles.input} type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className={styles.forgot}>Forgot Password?</button>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.testUsers}>
            <div className={styles.testUsersTitle}>Test Accounts</div>
            {TEST_USERS.map((u) => (
              <div key={u.email} className={styles.testUser} onClick={() => fillTestUser(u)}>
                <span className={styles.testUserEmail}>{u.email}</span>
                <span className={styles.testUserRole}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

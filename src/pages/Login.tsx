import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { isAzureADConfigured } from '../auth/msalConfig';
import styles from './Login.module.scss';

const TEST_USERS = [
  { email: 'admin@sauditabreed.com', password: 'Tabreed@2026', role: 'Admin', color: '#EF4444' },
  { email: 'ahmed.qahtani@sauditabreed.com', password: 'Tabreed@2026', role: 'Editor', color: '#4A7FD4' },
  { email: 'sara.malik@sauditabreed.com', password: 'Tabreed@2026', role: 'User', color: '#22C55E' },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const azureConfigured = isAzureADConfigured();

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

  const fillUser = (u: typeof TEST_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
  };

  return (
    <div className={styles.page}>
      {/* ── Left: Brand Panel ── */}
      <div className={styles.brand}>
        <div className={styles.brandOverlay} />
        {/* Animated particles */}
        <div className={styles.particles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }} />
          ))}
        </div>
        {/* Dot pattern */}
        <div className={styles.dotPattern} />

        <div className={styles.brandContent}>
          <img src="/images/logo.png" alt="Saudi Tabreed" className={styles.brandLogo} />
          <h1 className={styles.brandTitle}>Saudi Tabreed</h1>
          <p className={styles.brandSub}>District Cooling Company</p>
          <div className={styles.brandDivider} />
          <p className={styles.brandDesc}>
            Pioneering sustainable district cooling solutions across the Kingdom of Saudi Arabia,
            serving mega developments aligned with Vision 2030.
          </p>
          <div className={styles.brandStats} style={{ display: 'none' }}>
            <div className={styles.brandStat}>
              <span className={styles.brandStatNum}>751K</span>
              <span className={styles.brandStatLabel}>TR Capacity</span>
            </div>
            <div className={styles.brandStatDivider} />
            <div className={styles.brandStat}>
              <span className={styles.brandStatNum}>8+</span>
              <span className={styles.brandStatLabel}>Projects</span>
            </div>
            <div className={styles.brandStatDivider} />
            <div className={styles.brandStat}>
              <span className={styles.brandStatNum}>394</span>
              <span className={styles.brandStatLabel}>Employees</span>
            </div>
          </div>
        </div>

        <div className={styles.brandFooter}>
          &copy; 2026 Saudi Tabreed District Cooling Company. All rights reserved.
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <img src="/images/logo.png" alt="" className={styles.formLogo} />
            <h2 className={styles.formTitle}>Welcome Back</h2>
            <p className={styles.formSub}>Sign in to access your portal dashboard</p>
          </div>

          {/* SSO Button */}
          {azureConfigured && (
            <button className={styles.ssoBtn} onClick={() => {/* MSAL login redirect */}}>
              <svg width="20" height="20" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
              Sign in with Microsoft SSO
            </button>
          )}

          <button className={styles.ssoBtn} onClick={() => {/* MSAL login */}} style={{ background: 'linear-gradient(135deg, #0078D4, #005A9E)' }}>
            <svg width="20" height="20" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
            Sign in with Microsoft 365 / SSO
          </button>

          <div className={styles.divider}>
            <span>or sign in with credentials</span>
          </div>

          {error && <div className={styles.error}><ShieldCheck size={16} />{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input className={styles.input} type="email" placeholder="name@sauditabreed.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.options}>
              <label className={styles.remember}><input type="checkbox" /> Remember me</label>
              <button type="button" className={styles.forgot}>Forgot Password?</button>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className={styles.testSection}>
            <div className={styles.testTitle}>Quick Access — Test Accounts</div>
            <div className={styles.testGrid}>
              {TEST_USERS.map((u) => (
                <button key={u.email} className={styles.testCard} onClick={() => fillUser(u)}>
                  <div className={styles.testRole} style={{ background: u.color }}>{u.role}</div>
                  <div className={styles.testEmail}>{u.email.split('@')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone, Building2, Briefcase, Calendar, MapPin } from 'lucide-react';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
// Button available for future use

interface Employee {
  id: number; name: string; department: string; title: string; avatar: string;
}

function getEmail(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@sauditabreed.com`;
}

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [emp, setEmp] = useState<Employee | null>(null);

  useEffect(() => {
    fetch('/api/employees').then(r => r.json()).then((list: Employee[]) => {
      const found = list.find(e => String(e.id) === id);
      setEmp(found || null);
    }).catch(() => {});
  }, [id]);

  if (!emp) return <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading...</div>;

  const email = getEmail(emp.name);
  const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}`;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.4s ease both' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)', fontSize: '0.8125rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero */}
      <Card>
        <div style={{ background: 'linear-gradient(135deg, #1B3A6B, #4A7FD4)', borderRadius: 12, padding: '32px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar name={emp.name} src={emp.avatar || undefined} size="xl" />
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'white', margin: 0 }}>{emp.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', margin: '4px 0' }}>{emp.title}</p>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{emp.department}</span>
          </div>
        </div>

        {/* Contact Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#EBF3FF', borderRadius: 10, textDecoration: 'none', color: '#1B3A6B', fontWeight: 600, fontSize: '0.875rem', flex: 1, justifyContent: 'center' }}>
            <Mail size={16} color="#4A7FD4" /> Send Email
          </a>
          <a href={teamsUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#EDE9FE', borderRadius: 10, textDecoration: 'none', color: '#1B3A6B', fontWeight: 600, fontSize: '0.875rem', flex: 1, justifyContent: 'center' }}>
            <MessageCircle size={16} color="#8B5CF6" /> Teams Chat
          </a>
          <a href="tel:+966500000001" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#DCFCE7', borderRadius: 10, textDecoration: 'none', color: '#1B3A6B', fontWeight: 600, fontSize: '0.875rem', flex: 1, justifyContent: 'center' }}>
            <Phone size={16} color="#22C55E" /> Call
          </a>
        </div>

        {/* Profile Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: Briefcase, label: 'Position', value: emp.title },
            { icon: Building2, label: 'Department', value: emp.department },
            { icon: Mail, label: 'Email', value: email },
            { icon: Phone, label: 'Phone', value: '+966 50 000 0001' },
            { icon: MapPin, label: 'Office', value: 'Khobar Head Office' },
            { icon: Calendar, label: 'Joined', value: '2022' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#f9fafb', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>
                <f.icon size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>{f.label}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1B3A6B' }}>{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

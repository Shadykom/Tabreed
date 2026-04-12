import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Paperclip, X, CheckCircle, AlertCircle,
  ChevronDown, Building2, FileText, Home,
  UploadCloud,
} from 'lucide-react';
import Card from '../components/common/Card';
import styles from './ServiceRequest.module.scss';

// ── Department / Service Data ─────────────────────────────────────────────
type Department =
  | 'Executive'
  | 'Engineering'
  | 'Operations'
  | 'Finance'
  | 'HR'
  | 'IT'
  | 'HSE'
  | 'Marketing';

const DEPARTMENTS: Department[] = [
  'Executive',
  'Engineering',
  'Operations',
  'Finance',
  'HR',
  'IT',
  'HSE',
  'Marketing',
];

const SERVICES: Record<Department, string[]> = {
  Executive: [
    'Board Report Preparation',
    'Executive Meeting Scheduling',
    'Document Approval Request',
    'VIP Travel Arrangement',
    'Strategic Briefing',
  ],
  Engineering: [
    'Technical Drawing Review',
    'Design Approval',
    'Site Inspection Request',
    'Equipment Specification',
    'Project Kick-off',
  ],
  Operations: [
    'Maintenance Work Order',
    'Asset Transfer',
    'Operational Report',
    'Plant Visit Coordination',
    'Shutdown Planning',
  ],
  Finance: [
    'Invoice Processing',
    'Budget Request',
    'Reimbursement Claim',
    'Purchase Order',
    'Financial Report',
  ],
  HR: [
    'Leave Request',
    'Employment Certificate',
    'Training Enrollment',
    'Onboarding Request',
    'Performance Review',
  ],
  IT: [
    'Network Support',
    'Software Installation',
    'Access Request',
    'Hardware Request',
    'Incident Report',
  ],
  HSE: [
    'Safety Incident Report',
    'Risk Assessment',
    'Permit to Work',
    'HSE Training Request',
    'Safety Inspection',
  ],
  Marketing: [
    'Design Request',
    'Content Creation',
    'Event Coordination',
    'Social Media Request',
    'Campaign Approval',
  ],
};

type Priority = 'Urgent' | 'High' | 'Normal';

const PRIORITIES: { value: Priority; label: string; className: string }[] = [
  { value: 'Urgent', label: 'Urgent',  className: styles.urgent  },
  { value: 'High',   label: 'High',    className: styles.high    },
  { value: 'Normal', label: 'Normal',  className: styles.normal  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const MAX_FILES   = 5;
const MAX_FILE_MB = 10;

// ── Component ─────────────────────────────────────────────────────────────
export default function ServiceRequest() {
  const navigate = useNavigate();

  // Form state
  const [department, setDepartment] = useState<Department | ''>('');
  const [service,    setService]    = useState('');
  const [priority,   setPriority]   = useState<Priority>('Normal');
  const [summary,    setSummary]    = useState('');
  const [description,setDescription]= useState('');
  const [files,      setFiles]      = useState<File[]>([]);
  const [dragOver,   setDragOver]   = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [requestId,  setRequestId]  = useState('');
  const [error,      setError]      = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    const errs: string[] = [];

    Array.from(incoming).forEach((f) => {
      if (next.length >= MAX_FILES) {
        errs.push(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        errs.push(`"${f.name}" exceeds ${MAX_FILE_MB} MB limit.`);
        return;
      }
      if (!next.find((x) => x.name === f.name && x.size === f.size)) {
        next.push(f);
      }
    });

    setFiles(next);
    if (errs.length) setError(errs[0]);
    else setError('');
  }, [files]);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Drag & Drop ────────────────────────────────
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true);  };
  const onDragLeave = ()                    => { setDragOver(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Reset ──────────────────────────────────────
  const reset = () => {
    setDepartment('');
    setService('');
    setPriority('Normal');
    setSummary('');
    setDescription('');
    setFiles([]);
    setError('');
    setSubmitted(false);
    setRequestId('');
  };

  // ── Submit ─────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) { setError('Please select a target department.'); return; }
    if (!service)    { setError('Please select a service type.');       return; }
    if (!summary.trim()) { setError('Request summary is required.');    return; }

    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('department', department);
      formData.append('service',    service);
      formData.append('priority',   priority);
      formData.append('summary',    summary.trim());
      formData.append('description', description.trim());

      // Attach user info from localStorage if available
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          formData.append('requesterName',       u.name       || '');
          formData.append('requesterEmail',      u.email      || '');
          formData.append('requesterDepartment', u.department || '');
        }
      } catch { /* ignore */ }

      files.forEach((f) => formData.append('attachments', f));

      const res = await fetch('/api/service-requests', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setRequestId(data.id || data.requestId || 'SR-' + Date.now());
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────
  if (submitted) {
    return (
      <div className={styles.page}>
        <Card className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={40} />
          </div>
          <div>
            <h2 className={styles.successTitle}>Request Submitted Successfully!</h2>
            <p className={styles.successBody}>
              Your service request has been sent to the{' '}
              <strong>{department}</strong> department. You will be notified
              once it is reviewed and assigned.
            </p>
          </div>

          <div className={styles.successMeta}>
            <div className={styles.successMetaRow}>
              <span className={styles.successMetaLabel}>Request ID</span>
              <span className={styles.successMetaValue}>{requestId}</span>
            </div>
            <div className={styles.successMetaRow}>
              <span className={styles.successMetaLabel}>Department</span>
              <span className={styles.successMetaValue}>{department}</span>
            </div>
            <div className={styles.successMetaRow}>
              <span className={styles.successMetaLabel}>Service</span>
              <span className={styles.successMetaValue}>{service}</span>
            </div>
            <div className={styles.successMetaRow}>
              <span className={styles.successMetaLabel}>Priority</span>
              <span className={`${styles.priorityBadge} ${styles[priority.toLowerCase() as 'urgent' | 'high' | 'normal']}`}>
                <span
                  className={styles.pillDot}
                  style={{
                    background:
                      priority === 'Urgent' ? '#EF4444'
                      : priority === 'High'  ? '#F59E0B'
                      : '#4A7FD4',
                  }}
                />
                {priority}
              </span>
            </div>
            <div className={styles.successMetaRow}>
              <span className={styles.successMetaLabel}>Submitted</span>
              <span className={styles.successMetaValue}>
                {new Date().toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className={styles.successActions}>
            <button className={styles.newRequestBtn} onClick={reset}>
              <Send size={16} />
              New Request
            </button>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>
              <Home size={16} />
              Back to Home
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Form screen ────────────────────────────────
  const services = department ? SERVICES[department] : [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>Department Service Request</h1>
          <p className={styles.pageSubtitle}>
            Submit and track requests between departments
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          {/* ── Left Column ────────────────────────── */}
          <Card className={styles.formCard}>
            <div className={styles.cardSectionTitle}>
              <Building2 size={18} />
              Request Details
            </div>

            <div className={styles.fieldGroup}>
              {/* Target Department */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Target Department
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value as Department | '');
                      setService('');
                    }}
                    required
                  >
                    <option value="">Select department...</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectArrow} />
                </div>
              </div>

              {/* Service Type */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Service Type
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={!department}
                    required
                  >
                    <option value="">
                      {department ? 'Select service...' : 'Choose a department first'}
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectArrow} />
                </div>
              </div>

              {/* Priority */}
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <div className={styles.priorityGroup}>
                  {PRIORITIES.map(({ value, label, className }) => (
                    <button
                      key={value}
                      type="button"
                      className={[
                        styles.priorityPill,
                        className,
                        priority === value ? styles.selected : '',
                      ].join(' ')}
                      onClick={() => setPriority(value)}
                    >
                      <span
                        className={styles.pillDot}
                        style={{
                          background:
                            value === 'Urgent' ? '#EF4444'
                            : value === 'High' ? '#F59E0B'
                            : '#4A7FD4',
                        }}
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ── Right Column ───────────────────────── */}
          <Card className={styles.formCard}>
            <div className={styles.cardSectionTitle}>
              <FileText size={18} />
              Request Information
            </div>

            <div className={styles.fieldGroup}>
              {/* Summary */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Request Summary
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Brief title of your request..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Provide additional details, context, or requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              {/* File Upload */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Supporting Documents
                </label>

                {/* Drop zone */}
                <div
                  className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="*/*"
                    style={{ display: 'none' }}
                    onChange={(e) => addFiles(e.target.files)}
                  />
                  <UploadCloud size={32} className={styles.dropIcon} />
                  <p className={styles.dropTitle}>
                    Drop files here or{' '}
                    <span style={{ color: 'var(--color-accent)' }}>click to upload</span>
                  </p>
                  <p className={styles.dropSubtitle}>
                    Up to {MAX_FILES} files &middot; Max {MAX_FILE_MB} MB each
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className={styles.fileList}>
                    {files.map((f, i) => (
                      <div key={`${f.name}-${i}`} className={styles.fileItem}>
                        <div className={styles.fileIcon}>
                          <Paperclip size={14} />
                        </div>
                        <div className={styles.fileInfo}>
                          <div className={styles.fileName}>{f.name}</div>
                          <div className={styles.fileSize}>{formatBytes(f.size)}</div>
                        </div>
                        <button
                          type="button"
                          className={styles.fileRemove}
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Form Actions ─────────────────────────── */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

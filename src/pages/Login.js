import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const T = {
  bg:      '#0f172a',
  surface: '#1e293b',
  primary: '#3b82f6',
  danger:  '#ef4444',
  success: '#22c55e',
  text:    '#f1f5f9',
  muted:   '#94a3b8',
  border:  '#334155',
};

const ROLES = [
  { id: 'fleet-manager',  label: 'Fleet Manager',  desc: 'Manage vehicles & assignments' },
  { id: 'driver',         label: 'Driver',          desc: 'View routes & trip logs'      },
  { id: 'service-center', label: 'Service Center',  desc: 'Handle maintenance & repairs' },
  { id: 'admin',          label: 'Admin',           desc: 'Full system access'           },
];

const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

function Input({ type = 'text', placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...s.input, borderColor: focused ? T.primary : T.border }}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function PasswordInput({ placeholder = '••••••••', value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...s.input, borderColor: focused ? T.primary : T.border }}
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function ErrorBox({ msg }) {
  return msg ? <div style={s.errorBanner}>{msg}</div> : null;
}

function SuccessBox({ msg }) {
  return msg ? <div style={s.successBanner}>{msg}</div> : null;
}

function SubmitBtn({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      style={{ ...s.submitBtn, background: hovered ? '#2563eb' : T.primary }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

function RolePicker({ onSelect }) {
  return (
    <>
      <h1 style={s.title}>Welcome back</h1>
      <p style={s.subtitle}>Select your role to continue</p>
      <div style={s.roleGrid}>
        {ROLES.map((r) => <RoleCard key={r.id} role={r} onSelect={onSelect} />)}
      </div>
    </>
  );
}

function RoleCard({ role, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...s.roleCard,
        borderColor: hovered ? T.primary : T.border,
        background:  hovered ? '#1e3a5f' : T.surface,
      }}
      onClick={() => onSelect(role)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={s.roleLabel}>{role.label}</span>
      <span style={s.roleDesc}>{role.desc}</span>
    </button>
  );
}

function LoginForm({ role, onBack, onForgot, navigate }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password)  { setError('Please fill in all fields.'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address (must contain @).'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    navigate(`/dashboard/${role.id}`);
  };

  return (
    <>
      <button style={s.backBtn} onClick={onBack}>← Back</button>
      <div style={s.roleTag}>
        <span style={{ color: T.primary, fontWeight: 600 }}>{role.label}</span>
      </div>
      <h1 style={{ ...s.title, marginTop: 8 }}>Sign in</h1>
      <p style={s.subtitle}>Enter your credentials to access the dashboard</p>

      <ErrorBox msg={error} />

      <form onSubmit={handleSubmit} noValidate>
        <label style={s.label}>Email</label>
        <Input type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={s.label}>Password</label>
        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
          <button type="button" style={s.textBtn} onClick={onForgot}>Forgot password?</button>
        </div>

        <SubmitBtn label={`Sign In as ${role.label}`} />
      </form>
    </>
  );
}

function ForgotPassword({ onBack, onSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email)               { setError('Please enter your email.'); return; }
    if (!isValidEmail(email)) { setError('Enter a valid email address (must contain @).'); return; }
    setError('');
    setSent(true);
  };

  return (
    <>
      <button style={s.backBtn} onClick={onBack}>← Back to Sign In</button>
      <h1 style={s.title}>Forgot Password</h1>
      <p style={s.subtitle}>We'll send a reset link to your email</p>

      <ErrorBox msg={error} />
      {sent && <SuccessBox msg={`Reset link sent to ${email}. Check your inbox.`} />}

      {!sent && (
        <form onSubmit={handleSubmit} noValidate>
          <label style={s.label}>Email</label>
          <Input type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <SubmitBtn label="Send Reset Link" />
        </form>
      )}

      {sent && (
        <button
          style={{ ...s.submitBtn, background: T.surface, border: `1px solid ${T.border}`, marginTop: 12 }}
          onClick={() => { setSent(false); setEmail(''); onSuccess(); }}
        >
          Back to Sign In
        </button>
      )}
    </>
  );
}

function ChangePassword({ onBack }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!current || !newPass || !confirm) { setError('Please fill in all fields.'); return; }
    if (current.length < 6)              { setError('Current password must be at least 6 characters.'); return; }
    if (newPass.length < 6)              { setError('New password must be at least 6 characters.'); return; }
    if (newPass !== confirm)             { setError('Passwords do not match.'); return; }
    if (newPass === current)             { setError('New password must be different from current password.'); return; }
    setSuccess('Password changed successfully!');
    setCurrent(''); setNewPass(''); setConfirm('');
  };

  return (
    <>
      <button style={s.backBtn} onClick={onBack}>← Back to Sign In</button>
      <h1 style={s.title}>Change Password</h1>
      <p style={s.subtitle}>Update your account password</p>

      <ErrorBox msg={error} />
      <SuccessBox msg={success} />

      <form onSubmit={handleSubmit} noValidate>
        <label style={s.label}>Current Password</label>
        <PasswordInput placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />

        <label style={s.label}>New Password</label>
        <PasswordInput placeholder="New password (min 6 chars)" value={newPass} onChange={(e) => setNewPass(e.target.value)} />

        <label style={s.label}>Confirm New Password</label>
        <PasswordInput placeholder="Repeat new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <SubmitBtn label="Update Password" />
      </form>
    </>
  );
}

export default function Login() {
  const [view, setView] = useState('roles');
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const selectRole = (r) => { setRole(r); setView('login'); };

  return (
    <div style={s.page}>
      <div style={s.brand}>
        <span style={s.brandName}>FleetGuard</span>
      </div>

      <div style={s.card}>
        {view === 'roles' && <RolePicker onSelect={selectRole} />}
        {view === 'login' && (
          <>
            <LoginForm role={role} onBack={() => setView('roles')} onForgot={() => setView('forgot')} navigate={navigate} />
            <p style={s.changePassRow}>
              Want to update your password?{' '}
              <button style={s.textBtn} onClick={() => setView('change-password')}>Change Password</button>
            </p>
          </>
        )}
        {view === 'forgot'          && <ForgotPassword onBack={() => setView('login')} onSuccess={() => setView('login')} />}
        {view === 'change-password' && <ChangePassword onBack={() => setView('login')} />}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: T.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    fontFamily: "'Inter','Segoe UI',sans-serif",
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 },
  brandName: { fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: '-0.5px' },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
    padding: '40px 36px',
    width: '100%',
    maxWidth: 460,
  },
  title:    { margin: 0, fontSize: 22, fontWeight: 700, color: T.text },
  subtitle: { margin: '4px 0 24px', fontSize: 13, color: T.muted },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  roleCard: {
    border: '1px solid',
    borderRadius: 12,
    padding: '18px 14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    transition: 'border-color 0.2s, background 0.2s',
    textAlign: 'left',
  },
  roleLabel: { fontSize: 14, fontWeight: 600, color: T.text },
  roleDesc:  { fontSize: 11, color: T.muted, lineHeight: 1.4 },
  backBtn: {
    background: 'none', border: 'none', color: T.muted,
    fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 16,
  },
  roleTag: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: 999, padding: '4px 12px', fontSize: 13, marginBottom: 4,
  },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: T.muted, marginBottom: 4 },
  input: {
    width: '100%',
    background: T.bg,
    border: '1px solid',
    borderRadius: 10,
    color: T.text,
    fontSize: 15,
    padding: '10px 14px',
    marginBottom: 16,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%', background: T.primary, color: '#fff',
    border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
    padding: '11px 0', cursor: 'pointer', transition: 'background 0.2s',
  },
  textBtn: {
    background: 'none', border: 'none', color: '#60a5fa',
    fontSize: 13, cursor: 'pointer', padding: 0,
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.1)', border: `1px solid ${T.danger}`,
    borderRadius: 10, color: T.danger, fontSize: 13,
    padding: '8px 12px', marginBottom: 16,
  },
  successBanner: {
    background: 'rgba(34,197,94,0.1)', border: `1px solid ${T.success}`,
    borderRadius: 10, color: T.success, fontSize: 13,
    padding: '8px 12px', marginBottom: 16,
  },
  changePassRow: {
    textAlign: 'center', marginTop: 20, fontSize: 13, color: T.muted,
  },
};

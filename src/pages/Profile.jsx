import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Edit3, Save, X,
  Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Camera,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const inputBase = {
  width: '100%', padding: `${SPACING[3]} ${SPACING[4]}`,
  background: 'rgba(5,8,16,0.7)', border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.btn, color: COLORS.textPrimary,
  fontSize: FONT.size.sm, outline: 'none', boxSizing: 'border-box',
  fontFamily: FONT.family, transition: 'border-color 0.2s ease',
};

const labelStyle = {
  display: 'block', fontSize: FONT.size.xs,
  fontWeight: FONT.weight.medium, color: COLORS.textSecondary,
  marginBottom: SPACING[2], textTransform: 'uppercase', letterSpacing: '0.06em',
};

const cardStyle = {
  background: COLORS.card, border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.lg, padding: SPACING[6], boxShadow: SHADOWS.card,
};

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [toast, setToast]     = useState({ msg: '', type: 'success' });
  const [showPw, setShowPw]   = useState({ cur: false, nw: false, cn: false });

  const [form, setForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@fleetguard.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    role: 'Fleet Manager',
  });
  const [draft, setDraft] = useState({ ...form });
  const [pw, setPw]       = useState({ cur: '', nw: '', cn: '' });
  const [pwErr, setPwErr] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const handleSave = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }
    setForm({ ...draft });
    setEditing(false);
    showToast('Profile updated successfully.');
  };

  const handleCancel = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  const handlePwSave = () => {
    if (!pw.cur) { setPwErr('Enter your current password.'); return; }
    if (pw.nw.length < 8) { setPwErr('New password must be at least 8 characters.'); return; }
    if (pw.nw !== pw.cn) { setPwErr('Passwords do not match.'); return; }
    setPwErr('');
    setPw({ cur: '', nw: '', cn: '' });
    showToast('Password changed successfully.');
  };

  const Field = ({ k, label, type = 'text', placeholder = '' }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {editing ? (
        <input
          type={type}
          style={inputBase}
          value={draft[k]}
          placeholder={placeholder}
          onChange={e => setDraft({ ...draft, [k]: e.target.value })}
          onFocus={e => e.currentTarget.style.borderColor = COLORS.primary}
          onBlur={e => e.currentTarget.style.borderColor = COLORS.border}
        />
      ) : (
        <p style={{ fontSize: FONT.size.sm, color: COLORS.textPrimary, fontWeight: FONT.weight.medium, margin: 0, padding: `${SPACING[3]} 0` }}>
          {form[k] || <span style={{ color: COLORS.textSecondary }}>—</span>}
        </p>
      )}
    </div>
  );

  const PwField = ({ k, label }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPw[k] ? 'text' : 'password'}
          style={{ ...inputBase, paddingRight: '44px' }}
          placeholder="••••••••"
          value={pw[k]}
          onChange={e => setPw({ ...pw, [k]: e.target.value })}
          onFocus={e => e.currentTarget.style.borderColor = COLORS.primary}
          onBlur={e => e.currentTarget.style.borderColor = COLORS.border}
        />
        <button
          type="button"
          onClick={() => setShowPw({ ...showPw, [k]: !showPw[k] })}
          style={{ position: 'absolute', right: SPACING[3], top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, display: 'flex', alignItems: 'center', padding: 0 }}
        >
          {showPw[k] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT.family, minHeight: '100vh' }}>
      <Navbar />

      {toast.msg && (
        <div style={{
          position: 'fixed', top: '76px', right: SPACING[6], zIndex: 200,
          display: 'flex', alignItems: 'center', gap: SPACING[3],
          background: toast.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: RADIUS.btn, padding: `${SPACING[3]} ${SPACING[5]}`,
          boxShadow: SHADOWS.card, backdropFilter: 'blur(12px)',
          animation: 'fadeInRight 0.3s ease forwards',
        }}>
          {toast.type === 'success'
            ? <CheckCircle2 size={15} color={COLORS.success} />
            : <AlertCircle size={15} color={COLORS.danger} />}
          <span style={{ fontSize: FONT.size.sm, color: toast.type === 'success' ? COLORS.success : COLORS.danger, fontWeight: FONT.weight.medium }}>{toast.msg}</span>
        </div>
      )}

      <main>
        <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,8,16,0.55)' }} />
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: `0 ${SPACING[6]} ${SPACING[16]}` }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: SPACING[4], marginTop: '-52px', marginBottom: SPACING[8] }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: SPACING[5] }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blueMid})`, border: `4px solid ${COLORS.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.glowBlue }}>
                  <User size={42} color={COLORS.white} strokeWidth={1.5} />
                </div>
                <button style={{ position: 'absolute', bottom: 2, right: 2, width: '28px', height: '28px', borderRadius: '50%', background: COLORS.primary, border: `2px solid ${COLORS.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: SHADOWS.glowSm }}>
                  <Camera size={13} color={COLORS.white} strokeWidth={2} />
                </button>
              </div>
              <div style={{ paddingBottom: SPACING[2] }}>
                <h1 style={{ fontSize: FONT.size['2xl'], fontWeight: FONT.weight.bold, margin: 0 }}>{form.name}</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: SPACING[2], fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, background: 'rgba(74,144,226,0.12)', border: `1px solid rgba(74,144,226,0.3)`, padding: `3px ${SPACING[3]}`, borderRadius: RADIUS.full }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.primaryLight }} />
                  {form.role}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: SPACING[3] }}>
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[2]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.textSecondary; e.currentTarget.style.color = COLORS.textPrimary; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textSecondary; }}
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[2]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, border: 'none', cursor: 'pointer', boxShadow: SHADOWS.glowSm, transition: 'background 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryDark; e.currentTarget.style.boxShadow = SHADOWS.glowBlue; }}
                    onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.boxShadow = SHADOWS.glowSm; }}
                  >
                    <Save size={14} /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[2]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, border: 'none', cursor: 'pointer', boxShadow: SHADOWS.glowSm, transition: 'background 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryDark; e.currentTarget.style.boxShadow = SHADOWS.glowBlue; }}
                  onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.boxShadow = SHADOWS.glowSm; }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: SPACING[6] }}>

            <div style={cardStyle}>
              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: SPACING[6] }}>
                Account Details
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[5] }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[3] }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: RADIUS.btn, background: 'rgba(74,144,226,0.1)', border: `1px solid rgba(74,144,226,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: editing ? '28px' : '2px' }}>
                    <User size={15} color={COLORS.primary} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}><Field k="name" label="Full Name" placeholder="Your full name" /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[3] }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: RADIUS.btn, background: 'rgba(74,144,226,0.1)', border: `1px solid rgba(74,144,226,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: editing ? '28px' : '2px' }}>
                    <Mail size={15} color={COLORS.primary} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}><Field k="email" label="Email Address" type="email" placeholder="you@company.com" /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[3] }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: RADIUS.btn, background: 'rgba(74,144,226,0.1)', border: `1px solid rgba(74,144,226,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: editing ? '28px' : '2px' }}>
                    <Phone size={15} color={COLORS.primary} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}><Field k="phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[3] }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: RADIUS.btn, background: 'rgba(74,144,226,0.1)', border: `1px solid rgba(74,144,226,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: editing ? '28px' : '2px' }}>
                    <MapPin size={15} color={COLORS.primary} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}><Field k="location" label="Location" placeholder="City, State" /></div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: SPACING[6] }}>
                Change Password
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
                <PwField k="cur" label="Current Password" />
                <PwField k="nw"  label="New Password" />
                <PwField k="cn"  label="Confirm New Password" />

                {pwErr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[2]} ${SPACING[3]}`, borderRadius: RADIUS.btn, background: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.3)` }}>
                    <AlertCircle size={13} color={COLORS.danger} />
                    <span style={{ fontSize: FONT.size.xs, color: COLORS.danger }}>{pwErr}</span>
                  </div>
                )}

                <button
                  onClick={handlePwSave}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SPACING[2], padding: `${SPACING[3]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, border: 'none', cursor: 'pointer', boxShadow: SHADOWS.glowSm, marginTop: SPACING[2], transition: 'background 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryDark; e.currentTarget.style.boxShadow = SHADOWS.glowBlue; }}
                  onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.boxShadow = SHADOWS.glowSm; }}
                >
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

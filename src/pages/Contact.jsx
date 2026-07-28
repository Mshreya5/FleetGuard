import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const contactInfo = [
  { icon: Mail,   label: 'Email',   value: 'support@fleetguard.io' },
  { icon: Phone,  label: 'Phone',   value: '+1 (800) 555-0199' },
  { icon: MapPin, label: 'Address', value: '123 Fleet Avenue, Austin, TX 78701' },
];

const inputStyle = {
  width: '100%', padding: `${SPACING[3]} ${SPACING[4]}`,
  background: 'rgba(5,8,16,0.6)', border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.btn, color: COLORS.textPrimary,
  fontSize: FONT.size.sm, outline: 'none',
  boxSizing: 'border-box',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT.family, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ position: 'relative', padding: `${SPACING[24]} 0`, paddingTop: '120px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.80)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,8,16,0.55)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '500px', height: '400px', borderRadius: '50%', background: 'rgba(29,78,216,0.12)', filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: `0 ${SPACING[6]}` }}>

          <div style={{ marginBottom: SPACING[12] }}>
            <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: SPACING[3] }}>Get In Touch</p>
            <h1 style={{ fontSize: FONT.size['3xl'], fontWeight: FONT.weight.bold, color: COLORS.textPrimary, lineHeight: 1.2 }}>Contact Us</h1>
            <div style={{ marginTop: SPACING[4], width: '56px', height: '3px', borderRadius: '2px', background: COLORS.primary }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: SPACING[10], alignItems: 'start' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[6] }}>
              <p style={{ color: COLORS.textSecondary, fontSize: FONT.size.base, lineHeight: 1.75 }}>
                Have questions about FleetGuard? Our team is ready to help you get started
                with fleet management and compliance tracking.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: SPACING[4] }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: RADIUS.btn, flexShrink: 0,
                      background: 'rgba(74,144,226,0.1)', border: `1px solid rgba(74,144,226,0.2)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={COLORS.primary} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: FONT.size.sm, color: COLORS.textPrimary, margin: `${SPACING[1]} 0 0`, fontWeight: FONT.weight.medium }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
              border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg,
              padding: SPACING[8], boxShadow: SHADOWS.card,
            }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: `${SPACING[8]} 0` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: `1px solid rgba(34,197,94,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: SPACING[4] }}>
                    <Send size={22} color={COLORS.success} />
                  </div>
                  <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginBottom: SPACING[2] }}>Message Sent!</h3>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Name</label>
                    <input
                      required
                      style={inputStyle}
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Email</label>
                    <input
                      required
                      type="email"
                      style={inputStyle}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Message</label>
                    <textarea
                      required
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="How can we help?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SPACING[2],
                    padding: `${SPACING[3]} ${SPACING[6]}`, borderRadius: RADIUS.btn,
                    background: COLORS.primary, color: COLORS.white,
                    fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold,
                    border: 'none', cursor: 'pointer', boxShadow: SHADOWS.glowSm,
                  }}>
                    Send Message <Send size={14} />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

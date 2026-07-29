import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const contactInfo = [
<<<<<<< HEAD
  { icon: Mail, label: 'Email', value: 'support@fleetguard.io' },
  { icon: Phone, label: 'Phone', value: '+1 (800) 555-0199' },
  { icon: MapPin, label: 'Address', value: '123 Fleet Avenue, Austin, TX 78701' },
];

const inputStyle = {
  width: '100%',
  padding: `${SPACING[3]} ${SPACING[4]}`,
  background: 'rgba(5,8,16,0.6)',
  border: `1px solid ${COLORS.border}`,
  borderRadius: RADIUS.btn,
  color: COLORS.textPrimary,
  fontSize: FONT.size.sm,
  outline: 'none',
  boxSizing: 'border-box',
};

=======
  {
    icon: Mail,
    label: 'Support Email',
    value: 'support@fleetguard.com',
  },
  {
    icon: Phone,
    label: 'Customer Support',
    value: '+91 98765 43210',
  },
  {
    icon: MapPin,
    label: 'Head Office',
    value: 'XYZ, Bengaluru, Karnataka',
  },
];

>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
export default function Contact() {
  const inputStyle = {
    width: '100%',
    padding: `${SPACING[3]} ${SPACING[4]}`,
    background: 'rgba(5,8,16,0.6)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADIUS.btn,
    color: COLORS.textPrimary,
    fontSize: FONT.size.sm,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: FONT.family,
  };
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill all the fields.");
      return;
    }

    setSent(true);

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.textPrimary,
        fontFamily: FONT.family,
        minHeight: '100vh',
      }}
    >
      <Navbar />

      <section
        style={{
          position: 'relative',
          padding: `${SPACING[24]} 0`,
          paddingTop: '120px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.82)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1280px',
            margin: '0 auto',
            padding: `0 ${SPACING[6]}`,
          }}
        >
          <div style={{ marginBottom: SPACING[12] }}>
            <p
              style={{
                fontSize: FONT.size.xs,
                color: COLORS.primaryLight,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Get In Touch
            </p>

            <h1
              style={{
                fontSize: FONT.size["3xl"],
                fontWeight: FONT.weight.bold,
              }}
            >
              Contact FleetGuard Support
            </h1>

            <p
              style={{
                color: COLORS.textSecondary,
                maxWidth: "700px",
                marginTop: SPACING[4],
                lineHeight: 1.8,
              }}
            >
              Need assistance with FleetGuard?
              Whether you're facing issues related to fleet management,
              vehicle compliance, driver assignments, maintenance tracking,
              notifications, or account access, our support team is always
              ready to help.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: SPACING[10],
            }}
          >
            {/* Left Section */}

<<<<<<< HEAD
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[6] }}>
              <p style={{ color: COLORS.textSecondary, fontSize: FONT.size.base, lineHeight: 1.75 }}>
                Have questions about FleetGuard? Our team is ready to help you get started
                with fleet management and compliance tracking.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: SPACING[4] }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: RADIUS.btn, flexShrink: 0, background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={COLORS.primary} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: FONT.size.sm, color: COLORS.textPrimary, margin: `${SPACING[1]} 0 0`, fontWeight: FONT.weight.medium }}>{value}</p>
                    </div>
=======
            <div>
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: SPACING[4],
                    marginBottom: SPACING[5],
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: RADIUS.btn,
                      background: "rgba(59,130,246,0.1)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon color={COLORS.primary} />
>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
                  </div>

                  <div>
                    <p
                      style={{
                        color: COLORS.textSecondary,
                        margin: 0,
                      }}
                    >
                      {label}
                    </p>

                    <strong>{value}</strong>
                  </div>
                </div>
              ))}

              {/* Support Hours */}

              <div
                style={{
                  marginTop: 35,
                  background: "rgba(59,130,246,0.08)",
                  padding: 25,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 15,
                  }}
                >
                  <Clock color={COLORS.primary} />

                  <h3 style={{ margin: 0 }}>
                    Support Hours
                  </h3>
                </div>

                <p>Monday - Friday : 9:00 AM - 6:00 PM</p>

                <p>Saturday : 10:00 AM - 2:00 PM</p>

                <p>Sunday : Closed</p>
              </div>
            </div>

<<<<<<< HEAD
            <div style={{ background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: SPACING[8], boxShadow: SHADOWS.card }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: `${SPACING[8]} 0` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: SPACING[4] }}>
                    <Send size={22} color={COLORS.success} />
                  </div>
                  <h3 style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginBottom: SPACING[2] }}>Message Sent!</h3>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary }}>We'll get back to you within 24 hours.</p>
=======
            {/* Contact Form */}

            <div
              style={{
                background: "rgba(13,21,38,0.85)",
                padding: SPACING[8],
                borderRadius: RADIUS.lg,
                border: `1px solid ${COLORS.border}`,
                boxShadow: SHADOWS.card,
              }}
            >
              {sent ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <Send
                    size={40}
                    color={COLORS.success}
                  />

                  <h2>
                    Thank You!
                  </h2>

                  <p
                    style={{
                      color: COLORS.textSecondary,
                      lineHeight: 1.8,
                    }}
                  >
                    Your message has been received successfully.
                    Our FleetGuard support team will contact you
                    within one business day.
                  </p>
>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: SPACING[4],
                  }}
                >
                  <div>
<<<<<<< HEAD
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Name</label>
                    <input required style={inputStyle} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
=======
                    <label>Name</label>

                    <input
                      required
                      style={inputStyle}
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />
>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
                  </div>

                  <div>
<<<<<<< HEAD
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Email</label>
                    <input required type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary, marginBottom: SPACING[2] }}>Message</label>
                    <textarea required rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SPACING[2], padding: `${SPACING[3]} ${SPACING[6]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, border: 'none', cursor: 'pointer', boxShadow: SHADOWS.glowSm }}>
                    Send Message <Send size={14} />
=======
                    <label>Email</label>

                    <input
                      required
                      type="email"
                      style={inputStyle}
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: FONT.size.xs,
                        color: COLORS.textSecondary,
                        marginBottom: SPACING[2],
                      }}
                    >
                      Subject
                    </label>

                    <input
                      required
                      style={inputStyle}
                      placeholder="Enter subject"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Message */}

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: FONT.size.xs,
                        color: COLORS.textSecondary,
                        marginBottom: SPACING[2],
                      }}
                    >
                      Message
                    </label>

                    <textarea
                      required
                      rows={6}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                      }}
                      placeholder="Describe your issue, feedback, or enquiry..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Submit Button */}

                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px",
                      border: "none",
                      borderRadius: RADIUS.btn,
                      cursor: "pointer",
                      background: COLORS.primary,
                      color: COLORS.white,
                      fontWeight: FONT.weight.semibold,
                      fontSize: FONT.size.sm,
                      boxShadow: SHADOWS.glowSm,
                      transition: "0.3s",
                    }}
                  >
                    Send Message

                    <Send size={16} />
>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Extra Information */}

          <div
            style={{
              marginTop: "70px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "25px",
            }}
          >
            <div
              style={{
                background: "rgba(13,21,38,0.75)",
                padding: "25px",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <h3 style={{ color: COLORS.primary }}>
                Technical Support
              </h3>

              <p style={{ color: COLORS.textSecondary }}>
                Get assistance with login issues, dashboard errors,
                compliance tracking, and system functionality.
              </p>
            </div>

            <div
              style={{
                background: "rgba(13,21,38,0.75)",
                padding: "25px",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <h3 style={{ color: COLORS.primary }}>
                Fleet Assistance
              </h3>

              <p style={{ color: COLORS.textSecondary }}>
                Need help managing vehicles, drivers, maintenance,
                compliance documents, or notifications? Contact us anytime.
              </p>
            </div>

            <div
              style={{
                background: "rgba(13,21,38,0.75)",
                padding: "25px",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <h3 style={{ color: COLORS.primary }}>
                Business Enquiries
              </h3>

              <p style={{ color: COLORS.textSecondary }}>
                For partnerships, enterprise support, product demos,
                or feature requests, our team will respond within
                one working day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
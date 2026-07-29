import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const contactInfo = [
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

export default function Contact() {
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
                  </div>

                  <div>
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
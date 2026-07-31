import React, { useState } from 'react';
import { useCompliance } from '../hooks/useCompliance';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { upcomingExpiries } = useCompliance();

  const urgentExpiries = upcomingExpiries.filter(item => item.daysRemaining <= 7);

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="fm-nav-action-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Compliance Alerts"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {urgentExpiries.length > 0 && <span className="fm-notification-dot"></span>}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '320px',
            backgroundColor: 'var(--fm-surface)',
            border: '1px solid var(--fm-border)',
            borderRadius: 'var(--fm-radius-lg)',
            boxShadow: 'var(--fm-shadow)',
            zIndex: 100,
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--fm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '13px' }}>Compliance Alerts</span>
            <span className="fm-badge fm-badge-danger">{urgentExpiries.length} Critical</span>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {urgentExpiries.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--fm-muted-text)', fontSize: '13px' }}>
                No critical compliance alerts!
              </div>
            ) : (
              urgentExpiries.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--fm-border)',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontWeight: '600', color: 'var(--fm-text)', marginBottom: '2px' }}>
                    {item.registrationNumber} - {item.docName}
                  </div>
                  <div style={{ color: item.daysRemaining < 0 ? 'var(--fm-danger)' : 'var(--fm-accent)' }}>
                    {item.daysRemaining < 0
                      ? 'Expired on ' + item.expiryDate
                      : `Expires in ${item.daysRemaining} days (${item.expiryDate})`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

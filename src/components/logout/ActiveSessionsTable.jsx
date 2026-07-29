import React from 'react';
import { Monitor, Smartphone, Tablet, MapPin, XCircle } from 'lucide-react';

const DEVICE_ICON = { laptop: Monitor, phone: Smartphone, tablet: Tablet };

export default function ActiveSessionsTable({ sessions, onEndSession }) {
  return (
    <div className="lg-table-wrap">
      <table className="lg-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Browser</th>
            <th>Location</th>
            <th>Login Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => {
            const DevIcon = DEVICE_ICON[s.deviceType] || Monitor;
            return (
              <tr key={s.id}>
                <td>
                  <div className="lg-device-cell">
                    <div className="lg-device-icon"><DevIcon size={15} /></div>
                    <div>
                      <div className="lg-device-name">{s.device}</div>
                      <div className="lg-device-sub">{s.os}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#94a3b8', fontSize: 12 }}>{s.browser}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}>
                    <MapPin size={11} /> {s.location}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: '#94a3b8' }}>{s.loginTime}</td>
                <td>
                  <span className={`lg-status-badge ${s.isCurrent ? 'current' : s.status === 'Active' ? 'active' : 'expired'}`}>
                    <span className="lg-status-dot" />
                    {s.isCurrent ? 'Current Session' : s.status}
                  </span>
                </td>
                <td>
                  {!s.isCurrent && s.status === 'Active' ? (
                    <button className="lg-btn lg-btn-sm lg-btn-danger-outline" onClick={() => onEndSession(s.id)}>
                      <XCircle size={12} /> End
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#334155' }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

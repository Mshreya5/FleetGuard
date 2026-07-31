import { useState, useEffect } from 'react';
import axios from 'axios';

const priorityClass = (p) => p === 'High' ? 'badge danger' : p === 'Medium' ? 'badge warning' : 'badge success';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/admin/notifications');
      setNotifications(data.notifications || []);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`/api/admin/notifications/read/${id}`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch {
      alert('Failed to mark as read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      alert('Failed to delete notification.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Alerts</p>
          <h3>Notifications</h3>
        </div>
        <p className="muted">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <p className="muted">Loading notifications...</p>
      ) : error ? (
        <p className="muted">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="muted" style={{ marginTop: '16px' }}>No notifications found.</p>
      ) : (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{
              background: n.isRead ? '#111827' : '#1e293b',
              border: `1px solid ${n.isRead ? '#334155' : '#3b82f6'}`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{n.title}</span>
                  <span className={priorityClass(n.priority)}>{n.priority}</span>
                  {!n.isRead && <span className="badge success" style={{ fontSize: '0.75rem' }}>New</span>}
                </div>
                <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.88rem' }}>{n.message}</p>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {n.type} · {new Date(n.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {!n.isRead && (
                  <button type="button" className="nav-item" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleMarkRead(n._id)}>
                    Mark Read
                  </button>
                )}
                <button type="button" className="nav-item" style={{ padding: '4px 10px', fontSize: '0.8rem', borderColor: '#ef4444', color: '#fda4af' }} onClick={() => handleDelete(n._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminNotifications;

import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { CATEGORY_META, PRIORITY_COLOR } from '../../data/notificationData';

export default function NotificationWidget() {
  const { notifications, unreadCount, markRead, deleteOne } = useNotifications();
  const latest = notifications.slice(0, 5);

  return (
    <div className="nc-widget">
      <div className="nc-widget-header">
        <div className="nc-widget-title">
          <Bell size={14} />
          Recent Notifications
          {unreadCount > 0 && <span className="nc-widget-badge">{unreadCount}</span>}
        </div>
        <Link to="/notifications" className="nc-widget-viewall">
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="nc-widget-list">
        {latest.length === 0 ? (
          <div className="nc-widget-empty">No notifications</div>
        ) : (
          latest.map(n => {
            const meta = CATEGORY_META[n.category] || CATEGORY_META.System;
            const Icon = meta.icon;
            return (
              <div
                key={n.id}
                className={`nc-widget-item${n.read ? '' : ' nc-widget-item--unread'}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div className="nc-widget-icon" style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                  <Icon size={13} style={{ color: meta.color }} />
                </div>
                <div className="nc-widget-info">
                  <span className="nc-widget-item-title">{n.title}</span>
                  <div className="nc-widget-item-meta">
                    <span className="nc-widget-time">{n.time}</span>
                    <span className="nc-widget-priority" style={{ color: PRIORITY_COLOR[n.priority] }}>{n.priority}</span>
                  </div>
                </div>
                {!n.read && <span className="nc-widget-unread-dot" />}
              </div>
            );
          })
        )}
      </div>

      <Link to="/notifications" className="nc-widget-footer">
        View All Notifications <ArrowRight size={13} />
      </Link>
    </div>
  );
}

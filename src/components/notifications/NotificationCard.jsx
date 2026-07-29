import React from 'react';
import { Trash2 } from 'lucide-react';
import { CATEGORY_META, PRIORITY_COLOR } from '../../data/notificationData';

export default function NotificationCard({ notification, onRead, onDelete, showDetail = false }) {
  const { id, title, category, priority, time, read, detail } = notification;
  const meta = CATEGORY_META[category] || CATEGORY_META.System;
  const Icon = meta.icon;

  return (
    <div
      className={`nc-card${read ? '' : ' nc-card--unread'}`}
      onClick={() => !read && onRead(id)}
      style={{ '--nc-cat-color': meta.color, '--nc-cat-bg': meta.bg, '--nc-cat-border': meta.border }}
    >
      <div className="nc-card-icon" style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
        <Icon size={15} style={{ color: meta.color }} />
      </div>

      <div className="nc-card-body">
        <div className="nc-card-top">
          <span className="nc-card-title">{title}</span>
          <div className="nc-card-actions">
            <span className="nc-priority-dot" style={{ background: PRIORITY_COLOR[priority] }} title={priority} />
            <button className="nc-delete-btn" onClick={e => { e.stopPropagation(); onDelete(id); }} aria-label="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <div className="nc-card-meta">
          <span className="nc-cat-chip" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>{category}</span>
          <span className="nc-priority-chip" style={{ color: PRIORITY_COLOR[priority] }}>{priority}</span>
          <span className="nc-time">{time}</span>
          {!read && <span className="nc-unread-dot" />}
        </div>
        {showDetail && detail && <p className="nc-card-detail">{detail}</p>}
      </div>
    </div>
  );
}

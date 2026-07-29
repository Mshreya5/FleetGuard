import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from './NotificationBadge';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <button className="nc-bell-btn" onClick={() => navigate('/notifications')} aria-label="Notifications" title="Notifications">
      <Bell size={18} />
      <NotificationBadge count={unreadCount} />
      <span className="nc-bell-tooltip">Notifications</span>
    </button>
  );
}

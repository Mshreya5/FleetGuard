import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_NOTIFICATIONS, genId, ACTION_TEMPLATES } from '../data/notificationData';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteOne = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const addFromAction = useCallback((actionType, meta = '') => {
    const template = ACTION_TEMPLATES[actionType];
    if (!template) return;
    const { title, category, priority } = template(meta);
    const newNotif = {
      id: genId(),
      title,
      category,
      priority,
      time: 'Just now',
      read: false,
      detail: `Auto-generated from action: ${actionType}. ${meta}`,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, deleteOne, clearAll, addFromAction }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

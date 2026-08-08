import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/notifications?limit=100', { headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(typeof data.unreadCount === 'number' ? data.unreadCount : 0);
      }
    } catch (err) {
      console.warn('[NotificationContext] Fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', headers });
      fetchNotifications();
    } catch (err) {
      console.warn('[NotificationContext] markRead warning:', err.message);
    }
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      await fetch('/api/notifications/mark-all-read', { method: 'POST', headers });
      fetchNotifications();
    } catch (err) {
      console.warn('[NotificationContext] markAllRead warning:', err.message);
    }
  }, [fetchNotifications]);

  const deleteOne = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', headers });
      fetchNotifications();
    } catch (err) {
      console.warn('[NotificationContext] deleteOne warning:', err.message);
    }
  }, [fetchNotifications]);

  const clearAll = useCallback(async () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      await fetch('/api/notifications/clear', { method: 'DELETE', headers });
      fetchNotifications();
    } catch (err) {
      console.warn('[NotificationContext] clearAll warning:', err.message);
    }
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markRead,
        markAllRead,
        deleteOne,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

const NotificationPanel = ({ notifications }) => {
  return (
    <section className="card-section notifications-panel">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Operations</p>
          <h3>Recent Notifications</h3>
        </div>
      </div>

      <ul className="notification-list">
        {notifications.map((notification) => (
          <li key={notification}>{notification}</li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationPanel;

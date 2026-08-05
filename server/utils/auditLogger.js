const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

/**
 * Centrally log audit events AND database-driven notifications to MongoDB
 */
const logAudit = async ({
  user = 'System',
  userEmail = '',
  role = 'System',
  action,
  module = 'General',
  status = 'Success',
  ip = '127.0.0.1',
  browser = 'System',
  os = 'System',
  prev = 'N/A',
  next = 'N/A',
  reason = '',
  details = {},
  // Optional notification overrides
  createNotification = true,
  title,
  message,
  category,
  priority,
  targetRole,
}) => {
  try {
    // 1. Save Audit Log in MongoDB
    const entry = new AuditLog({
      user,
      userEmail,
      role,
      action,
      module,
      status,
      ip,
      browser,
      os,
      prev: typeof prev === 'object' ? JSON.stringify(prev) : String(prev),
      next: typeof next === 'object' ? JSON.stringify(next) : String(next),
      reason: reason || action,
      details,
    });
    await entry.save();

    // 2. Save Notification in MongoDB
    if (createNotification && action) {
      let notifCategory = category;
      if (!notifCategory) {
        if (module.includes('Vehicle') || action.includes('Vehicle')) notifCategory = 'Fleet';
        else if (module.includes('Compliance') || action.includes('Compliance')) notifCategory = 'Compliance';
        else if (module.includes('Driver') || action.includes('Driver') || action.includes('Checklist') || action.includes('Trip')) notifCategory = 'Driver';
        else if (module.includes('Maintenance') || module.includes('Service') || action.includes('Service') || action.includes('Issue')) notifCategory = 'Maintenance';
        else if (module.includes('Auth') || action.includes('Login') || action.includes('Password') || action.includes('User')) notifCategory = 'Security';
        else notifCategory = 'System';
      }

      let notifPriority = priority;
      if (!notifPriority) {
        if (status === 'Failed' || action.includes('Expired') || action.includes('Deleted')) notifPriority = 'High';
        else if (action.includes('Override') || action.includes('Block')) notifPriority = 'Critical';
        else notifPriority = 'Medium';
      }

      let notifTargetRole = targetRole;
      if (!notifTargetRole) {
        if (notifCategory === 'Driver') notifTargetRole = 'Driver';
        else if (notifCategory === 'Maintenance') notifTargetRole = 'Service Center';
        else if (notifCategory === 'Fleet' || notifCategory === 'Compliance') notifTargetRole = 'Fleet Manager';
        else notifTargetRole = 'Admin';
      }

      const notifMessage = message || `${action} by ${user} (${role}). ${next !== 'N/A' && next ? next : ''}`;

      await Notification.create({
        role: notifTargetRole,
        title: title || `${action}`,
        message: notifMessage,
        description: notifMessage,
        type: status === 'Failed' ? 'error' : status === 'Warning' ? 'warning' : 'info',
        category: notifCategory,
        priority: notifPriority,
        createdBy: user,
      });
    }

    return entry;
  } catch (err) {
    console.warn('[AuditLogger Warning]: Unable to save audit log entry:', err.message);
    return null;
  }
};

module.exports = { logAudit, logEvent: logAudit };

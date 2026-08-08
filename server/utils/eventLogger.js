const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

/**
 * Centrally log system event to both AuditLog and Notification collections in MongoDB
 */
async function logEvent({
  user = 'System',
  userEmail = '',
  role = 'Admin',
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
  // Notification options
  createNotification = true,
  title,
  message,
  category = 'General',
  priority = 'Medium',
  targetRole = 'All', // 'Admin', 'Fleet Manager', 'Driver', 'Service Center', 'All'
  userId = null,
  driverId = null,
  referenceId = '',
  notifType = 'info',
}) {
  try {
    // 1. Create AuditLog in MongoDB
    const auditEntry = await AuditLog.create({
      user,
      userEmail,
      role,
      action,
      module,
      status,
      ip,
      browser,
      os,
      prev,
      next,
      reason: reason || action,
      details,
    });

    // 2. Create Notification in MongoDB
    let notifEntry = null;
    if (createNotification) {
      notifEntry = await Notification.create({
        userId,
        driverId,
        role: targetRole,
        title: title || action,
        message: message || `${action} by ${user}`,
        description: message || `${action} by ${user}`,
        type: notifType,
        category,
        priority,
        referenceId,
        createdBy: user,
      });
    }

    return { auditEntry, notifEntry };
  } catch (err) {
    console.error('[EventLogger Error]:', err.message);
    return null;
  }
}

module.exports = { logEvent };

const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const { search, role, action, date, page = 1, limit = 50 } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { user: searchRegex },
        { userEmail: searchRegex },
        { action: searchRegex },
        { module: searchRegex },
        { reason: searchRegex }
      ];
    }

    if (role && role !== 'All Roles' && role !== 'All') {
      query.role = role;
    }

    if (action && action !== 'All Actions' && action !== 'All') {
      query.action = new RegExp(action, 'i');
    }

    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: dateStart, $lte: dateEnd };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();

    // Calculate dynamic summary metrics from MongoDB
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayCount = await AuditLog.countDocuments({ createdAt: { $gte: startOfToday } });
    const failedCount = await AuditLog.countDocuments({ status: 'Failed' });

    const distinctUsers = await AuditLog.distinct('user');
    const activeUsersCount = distinctUsers.length;

    const formattedLogs = logs.map((log) => ({
      id: log.eventId || log._id,
      ts: new Date(log.createdAt || log.timestamp).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      user: log.user,
      userEmail: log.userEmail || '',
      role: log.role,
      action: log.action,
      module: log.module,
      status: log.status,
      ip: log.ip || '127.0.0.1',
      browser: log.browser || 'System',
      os: log.os || 'System',
      prev: log.prev || 'N/A',
      next: log.next || 'N/A',
      reason: log.reason || log.action,
    }));

    res.status(200).json({
      success: true,
      total,
      todayCount,
      failedCount,
      activeUsers: activeUsersCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      logs: formattedLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAuditLogs };

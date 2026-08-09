const Notification = require('../models/Notification');

/**
 * GET /api/notifications
 * Fetch notifications from MongoDB with role-based filtering & dynamic unread count
 */
const getNotifications = async (req, res) => {
  try {
    const { category, priority, search, page = 1, limit = 50 } = req.query;
    const userRole = req.user ? req.user.role : 'Admin';
    const userId = req.user ? req.user.id : null;

    let roleQuery = {};
    if (userRole === 'Admin') {
      // Admin receives all notifications
      roleQuery = {};
    } else if (userRole === 'Fleet Manager') {
      roleQuery = { role: { $in: ['Fleet Manager', 'Admin', 'All'] } };
    } else if (userRole === 'Driver') {
      roleQuery = {
        $or: [
          { role: { $in: ['Driver', 'All'] } },
          { userId: userId },
          { driverId: 'driver-001' }
        ]
      };
    } else if (userRole === 'Service Center') {
      roleQuery = { role: { $in: ['Service Center', 'All'] } };
    }

    let filter = { ...roleQuery };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { message: searchRegex },
        { description: searchRegex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ ...roleQuery, read: false });

    const notificationsList = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const formatted = notificationsList.map((n) => ({
      id: n.notificationId || n._id,
      _id: n._id,
      title: n.title,
      message: n.message || n.description,
      detail: n.description || n.message,
      category: n.category,
      priority: n.priority,
      read: Boolean(n.read),
      time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: n.createdAt,
    }));

    res.status(200).json({
      success: true,
      total,
      unreadCount,
      notifications: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark single notification as read in MongoDB
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    let notification = await Notification.findOne({
      $or: [{ notificationId: id }, { _id: id }]
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    const userRole = req.user ? req.user.role : 'Admin';
    const roleQuery = userRole === 'Admin' ? {} : { role: { $in: [userRole, 'All'] } };
    const unreadCount = await Notification.countDocuments({ ...roleQuery, read: false });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications for user's role as read in MongoDB
 */
const markAllAsRead = async (req, res) => {
  try {
    const userRole = req.user ? req.user.role : 'Admin';
    const roleQuery = userRole === 'Admin' ? {} : { role: { $in: [userRole, 'All'] } };

    await Notification.updateMany({ ...roleQuery, read: false }, { $set: { read: true } });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/notifications/clear
 * Clear read notifications in MongoDB
 */
const clearNotifications = async (req, res) => {
  try {
    const userRole = req.user ? req.user.role : 'Admin';
    const roleQuery = userRole === 'Admin' ? {} : { role: { $in: [userRole, 'All'] } };

    await Notification.deleteMany({ ...roleQuery, read: true });

    const unreadCount = await Notification.countDocuments({ ...roleQuery, read: false });

    res.status(200).json({
      success: true,
      message: 'Read notifications cleared',
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
};

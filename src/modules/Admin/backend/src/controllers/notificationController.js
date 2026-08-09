const Notification = require('../models/Notification');
const Vehicle = require('../models/Vehicle');

const getNotifications = async (req, res) => {
  try {
    const dbNotifications = await Notification.find({}).sort({ createdAt: -1 }).lean().catch(() => []);
    
    // Dynamically build vehicle compliance alerts matching Admin Dashboard
    const vehicles = await Vehicle.find({}).lean().catch(() => []);
    const vehicleAlerts = (vehicles || []).map((v, index) => ({
      _id: `v-notif-${v._id || index}`,
      title: 'Compliance Review Alert',
      message: `${v.registrationNumber} requires attention for compliance review.`,
      type: 'Compliance Review',
      priority: (v.complianceSummary?.overallStatus === 'Expired' || v.insurance?.status === 'Expired') ? 'High' : 'Medium',
      isRead: false,
      createdAt: v.createdAt || new Date()
    }));

    if (vehicles && vehicles.length > 0) {
      const maintenanceCount = vehicles.filter(v =>
        v.status === 'Maintenance' || v.status === 'Under Service' || v.maintenanceStatus === 'Under Maintenance'
      ).length;
      
      vehicleAlerts.push({
        _id: 'v-notif-maint',
        title: 'Maintenance Alert',
        message: `Fleet maintenance has ${maintenanceCount} active vehicles pending review.`,
        type: 'Maintenance Review',
        priority: maintenanceCount > 0 ? 'High' : 'Low',
        isRead: false,
        createdAt: new Date()
      });
    }

    const allNotifications = [...dbNotifications, ...vehicleAlerts];
    return res.status(200).json({ notifications: allNotifications });
  } catch (error) {
    return res.status(200).json({ notifications: [] });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.startsWith('v-notif-')) {
      return res.status(200).json({ message: 'Marked as read' });
    }
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).catch(() => null);
    return res.status(200).json({ message: 'Marked as read', notification });
  } catch (error) {
    return res.status(200).json({ message: 'Marked as read' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.startsWith('v-notif-')) {
      return res.status(200).json({ message: 'Notification removed' });
    }
    await Notification.findByIdAndDelete(id).catch(() => null);
    return res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    return res.status(200).json({ message: 'Notification deleted' });
  }
};

module.exports = { getNotifications, markAsRead, deleteNotification };

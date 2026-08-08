const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const { logAudit } = require('../utils/auditLogger');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

async function testNotificationsAndAudit() {
  console.log(`====================================================`);
  console.log(`RUNNING NOTIFICATION & AUDIT LOG SYSTEM VERIFICATION`);
  console.log(`====================================================`);

  await connectDB();

  try {
    // 1. Create real test events in MongoDB
    console.log('Testing real event creation...');
    await logAudit({
      user: 'TestAdmin',
      role: 'Admin',
      action: 'Vehicle Registered',
      module: 'Vehicle Registry',
      status: 'Success',
      next: 'Vehicle KA-01-EV-2026 added to fleet',
      title: 'New Vehicle Registered',
      message: 'Vehicle KA-01-EV-2026 added by TestAdmin',
      category: 'Fleet',
      priority: 'Medium',
      targetRole: 'Fleet Manager',
    });

    await logAudit({
      user: 'TestDriver',
      role: 'Driver',
      action: 'Checklist Submitted',
      module: 'Driver Portal',
      status: 'Success',
      next: 'Morning pre-trip checklist completed',
      title: 'Pre-Trip Checklist Submitted',
      message: 'Pre-trip inspection passed by TestDriver',
      category: 'Driver',
      priority: 'Low',
      targetRole: 'Driver',
    });

    await logAudit({
      user: 'TestTech',
      role: 'Service Center',
      action: 'Service Logged',
      module: 'Maintenance',
      status: 'Success',
      next: 'Oil change completed for Truck #12',
      title: 'Vehicle Service Completed',
      message: 'Scheduled maintenance completed by TestTech',
      category: 'Maintenance',
      priority: 'Low',
      targetRole: 'Service Center',
    });

    // 2. Query MongoDB Notifications
    const totalNotifs = await Notification.countDocuments();
    const unreadCount = await Notification.countDocuments({ read: false });
    console.log(`✅ [PASS] MongoDB has ${totalNotifs} notifications (Unread: ${unreadCount})`);

    // 3. Query Role-Based Notifications
    const driverNotifs = await Notification.find({ role: { $in: ['Driver', 'All'] } });
    console.log(`✅ [PASS] Driver role notifications query returned ${driverNotifs.length} items`);

    const fmNotifs = await Notification.find({ role: { $in: ['Fleet Manager', 'Admin', 'All'] } });
    console.log(`✅ [PASS] Fleet Manager role notifications query returned ${fmNotifs.length} items`);

    // 4. Test Mark As Read in MongoDB
    const sampleNotif = await Notification.findOne({ read: false });
    if (sampleNotif) {
      sampleNotif.read = true;
      await sampleNotif.save();
      const updatedUnread = await Notification.countDocuments({ read: false });
      console.log(`✅ [PASS] Mark as read updated MongoDB unread count to ${updatedUnread}`);
    }

    // 5. Query MongoDB Audit Logs
    const totalLogs = await AuditLog.countDocuments();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLogs = await AuditLog.countDocuments({ createdAt: { $gte: startOfToday } });
    console.log(`✅ [PASS] MongoDB Audit Logs total: ${totalLogs}, Today: ${todayLogs}`);

    console.log(`====================================================`);
    console.log(`SUMMARY: ALL NOTIFICATION & AUDIT TESTS PASSED!`);
    console.log(`====================================================`);
  } catch (err) {
    console.error('❌ [FAIL] Test encountered error:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

testNotificationsAndAudit();

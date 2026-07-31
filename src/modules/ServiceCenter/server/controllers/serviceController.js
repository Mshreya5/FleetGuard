const ServiceQueue = require('../models/ServiceQueue');
const ServiceLog = require('../models/ServiceLog');

const fallbackQueue = [];
const fallbackLogs = [];

function getFallbackData() {
  return {
    queue: fallbackQueue,
    logs: fallbackLogs,
  };
}

async function getDashboardData(req, res) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const fallbackData = getFallbackData();
    let waitingCount = 0;
    let inServiceCount = 0;
    let completedTodayCount = 0;
    let totalRevenue = 0;
    let queueRecords = fallbackData.queue;
    let serviceLogs = fallbackData.logs;

    try {
      const ServiceHistory = require('../models/ServiceHistory');

      const [waiting, inService, completedLogsCount, completedHistoryCount, queued, logs, histories] = await Promise.all([
        ServiceQueue.countDocuments({ status: 'Waiting' }),
        ServiceQueue.countDocuments({ status: 'In Progress' }),
        ServiceLog.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
        ServiceHistory.countDocuments({ status: 'Completed', createdAt: { $gte: startOfToday, $lte: endOfToday } }),
        ServiceQueue.find().sort({ createdAt: -1 }).limit(10),
        ServiceLog.find().sort({ createdAt: -1 }).limit(6),
        ServiceHistory.find({ status: 'Completed' }).sort({ createdAt: -1 }).limit(10),
      ]);

      waitingCount = waiting;
      inServiceCount = inService;
      completedTodayCount = completedLogsCount + completedHistoryCount;
      queueRecords = queued.length ? queued : queueRecords;
      serviceLogs = logs.length ? logs : serviceLogs;

      const logRev = logs.reduce((sum, log) => sum + (Number(log.revenue) || 0), 0);
      const historyRev = histories.reduce((sum, h) => sum + (Number(h.cost) || 0), 0);
      totalRevenue = logRev + historyRev;

      if (!totalRevenue) {
        totalRevenue = serviceLogs.reduce((sum, log) => sum + (Number(log.revenue) || 0), 0);
      }
    } catch (dbError) {
      console.warn('Using fallback service center data:', dbError.message);
      totalRevenue = serviceLogs.reduce((sum, log) => sum + (Number(log.revenue) || 0), 0);
    }

    const upcomingServices = queueRecords
      .filter((record) => record.status !== 'Completed')
      .slice(0, 5)
      .map((record) => ({
        vehicleNumber: record.vehicleNumber,
        ownerName: record.ownerBranch,
        serviceType: record.issue,
        scheduledDate: record.createdAt ? new Date(record.createdAt).toISOString().split('T')[0] : 'TBD',
        mechanic: 'Assigned Mechanic',
        status: record.status,
      }));

    const recentActivities = serviceLogs.map((log, index) => ({
      id: index + 1,
      title: `${log.serviceType} completed`,
      detail: `${log.vehicle} logged by ${log.mechanicName}.`,
      time: `${index + 1} hr ago`,
    }));

    return res.status(200).json({
      stats: {
        vehiclesWaiting: waitingCount,
        vehiclesInService: inServiceCount,
        completedToday: completedTodayCount,
        totalRevenue,
        upcomingServices: upcomingServices.length,
      },
      recentActivities,
      upcomingServices,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load dashboard data', error: error.message });
  }
}

async function getQueue(req, res) {
  try {
    const { search = '', priority, status } = req.query;
    const query = {};

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { ownerBranch: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const records = await ServiceQueue.find(query).sort({ createdAt: -1 });
      if (records.length) {
        return res.status(200).json(records);
      }
    } catch (dbError) {
      console.warn('Using fallback queue data:', dbError.message);
    }

    const fallbackRecords = getFallbackData().queue.filter((record) => {
      const matchesPriority = !query.priority || record.priority === query.priority;
      const matchesStatus = !query.status || record.status === query.status;
      const matchesSearch = !search || [record.vehicleNumber, record.ownerBranch, record.vehicleModel].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );
      return matchesPriority && matchesStatus && matchesSearch;
    });

    return res.status(200).json(fallbackRecords);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch service queue', error: error.message });
  }
}

async function createQueueItem(req, res) {
  try {
    const item = await ServiceQueue.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to create queue item', error: error.message });
  }
}

async function updateQueueItem(req, res) {
  try {
    const item = await ServiceQueue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Queue item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to update queue item', error: error.message });
  }
}

async function deleteQueueItem(req, res) {
  try {
    const item = await ServiceQueue.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Queue item not found' });
    }

    return res.status(200).json({ message: 'Queue item deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Unable to delete queue item', error: error.message });
  }
}

async function getServiceLogs(req, res) {
  try {
    const logs = await ServiceLog.find().sort({ createdAt: -1 });
    if (logs.length) {
      return res.status(200).json(logs);
    }
  } catch (dbError) {
    console.warn('Using fallback service log data:', dbError.message);
  }

  return res.status(200).json(getFallbackData().logs);
}

async function createServiceLog(req, res) {
  try {
    const log = await ServiceLog.create(req.body);
    return res.status(201).json(log);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to save service log', error: error.message });
  }
}

async function getServiceLogById(req, res) {
  try {
    const log = await ServiceLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Service log not found' });
    }
    return res.status(200).json(log);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to fetch service log', error: error.message });
  }
}

async function updateServiceLog(req, res) {
  try {
    const log = await ServiceLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!log) {
      return res.status(404).json({ message: 'Service log not found' });
    }

    return res.status(200).json(log);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to update service log', error: error.message });
  }
}

async function deleteServiceLog(req, res) {
  try {
    const log = await ServiceLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Service log not found' });
    }

    return res.status(200).json({ message: 'Service log deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Unable to delete service log', error: error.message });
  }
}

module.exports = {
  getDashboardData,
  getQueue,
  createQueueItem,
  updateQueueItem,
  deleteQueueItem,
  getServiceLogs,
  createServiceLog,
  getServiceLogById,
  updateServiceLog,
  deleteServiceLog,
};

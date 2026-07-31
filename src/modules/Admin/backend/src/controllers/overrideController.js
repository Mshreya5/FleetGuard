const OverrideLog = require('../models/OverrideLog');

const getOverrideLogs = async (req, res) => {
  try {
    const { search = '', filter = 'all', sort = 'desc' } = req.query;
    let query = {};

    if (filter !== 'all') query.status = filter;

    let logs = await OverrideLog.find(query)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .lean();

    if (search) {
      const term = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.vehicleNumber.toLowerCase().includes(term) ||
          l.driver.toLowerCase().includes(term)
      );
    }

    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load override logs', error: error.message });
  }
};

const createOverrideLog = async (req, res) => {
  try {
    const { vehicleNumber, driver, fleetManager, overrideReason, status } = req.body;
    if (!vehicleNumber || !driver || !fleetManager || !overrideReason) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const log = await OverrideLog.create({ vehicleNumber, driver, fleetManager, overrideReason, status });
    return res.status(201).json({ message: 'Override log created', log });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create override log', error: error.message });
  }
};

module.exports = { getOverrideLogs, createOverrideLog };

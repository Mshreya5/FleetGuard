const Maintenance = require('../models/Maintenance');

const getServiceCostSummary = async (req, res) => {
  try {
    const records = await Maintenance.find({}).lean();

    const totalCost = records.reduce((sum, r) => sum + r.cost, 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCost = records
      .filter((r) => new Date(r.serviceDate) >= monthStart)
      .reduce((sum, r) => sum + r.cost, 0);

    const uniqueVehicles = new Set(records.map((r) => r.vehicle)).size;
    const avgCostPerVehicle = uniqueVehicles ? Math.round(totalCost / uniqueVehicles) : 0;

    const recent = await Maintenance.find({}).sort({ serviceDate: -1 }).limit(5).lean();

    return res.status(200).json({
      summary: { totalCost, monthlyCost, avgCostPerVehicle },
      recentRecords: recent,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load service cost data', error: error.message });
  }
};

const getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find({}).sort({ serviceDate: -1 }).lean();
    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load maintenance records', error: error.message });
  }
};

module.exports = { getServiceCostSummary, getAllMaintenance };

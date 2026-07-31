const Vehicle = require('../models/Vehicle');

const getOverdueCompliance = async (req, res) => {
  try {
    const { search = '', filter = 'all', page = 1, limit = 10 } = req.query;
    const today = new Date();
    const vehicles = await Vehicle.find({}).lean();

    const overdueRecords = [];

    vehicles.forEach((vehicle) => {
      const docs = [
        { type: 'Insurance', expiryDate: vehicle.insurance?.expiryDate, status: vehicle.insurance?.status },
        { type: 'Pollution Certificate', expiryDate: vehicle.pollution?.expiryDate, status: vehicle.pollution?.status },
        { type: 'Fitness Certificate', expiryDate: vehicle.fitness?.expiryDate, status: vehicle.fitness?.status },
      ];

      docs.forEach((doc) => {
        if (doc.status === 'Expired' && doc.expiryDate) {
          const expiry = new Date(doc.expiryDate);
          const overdueDays = Math.ceil((today - expiry) / (1000 * 60 * 60 * 24));
          overdueRecords.push({
            registrationNumber: vehicle.registrationNumber,
            model: vehicle.model,
            branch: vehicle.branch,
            documentType: doc.type,
            expiryDate: expiry.toLocaleDateString('en-GB'),
            overdueDays,
            currentStatus: 'Expired',
          });
        }
      });
    });

    let filtered = overdueRecords;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((r) => r.registrationNumber.toLowerCase().includes(term));
    }

    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.documentType === filter);
    }

    const total = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.status(200).json({
      records: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load overdue compliance data', error: error.message });
  }
};

module.exports = { getOverdueCompliance };

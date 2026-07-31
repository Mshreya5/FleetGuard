const AlertSettings = require('../models/AlertSettings');

const getAlertSettings = async (req, res) => {
  try {
    let settings = await AlertSettings.findOne({});
    if (!settings) {
      settings = await AlertSettings.create({});
    }
    return res.status(200).json({ settings });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load alert settings', error: error.message });
  }
};

const updateAlertSettings = async (req, res) => {
  try {
    const { thirtyDays, fifteenDays, sevenDays, customDays } = req.body;
    let settings = await AlertSettings.findOne({});
    if (!settings) {
      settings = await AlertSettings.create({ thirtyDays, fifteenDays, sevenDays, customDays });
    } else {
      settings.thirtyDays = thirtyDays ?? settings.thirtyDays;
      settings.fifteenDays = fifteenDays ?? settings.fifteenDays;
      settings.sevenDays = sevenDays ?? settings.sevenDays;
      settings.customDays = customDays ?? settings.customDays;
      await settings.save();
    }
    return res.status(200).json({ message: 'Alert settings updated', settings });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update alert settings', error: error.message });
  }
};

module.exports = { getAlertSettings, updateAlertSettings };

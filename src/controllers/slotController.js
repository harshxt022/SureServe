const slotService = require('../services/slotService');

exports.getSlotsForDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
    const slots = await slotService.generateSlotsForDate(id, date);
    res.json({ providerId: id, date, slots });
  } catch (e) { next(e); }
};

exports.getSlotsForRange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    const data = await slotService.generateSlotsForRange(id, from, to);
    res.json({ providerId: id, days: data });
  } catch (e) { next(e); }
};

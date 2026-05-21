const prisma = require('../config/prisma');

exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({});
    
    // Map base_price back to basePrice and id to _id for frontend compatibility
    const mapped = services.map(s => ({
        ...s,
        _id: s.id,
        basePrice: s.base_price
    }));
    
    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

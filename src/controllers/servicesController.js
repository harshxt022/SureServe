const ServicesModel = require('../models/servicesModel');

exports.getAllServices = async (req, res) => {
  try {
    const services = await ServicesModel.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const slotRoutes = require('./slotRoutes');
const bookingRoutes = require('./bookingRoutes');
const providerRoutes = require('./providerRoutes');
const notificationRoutes = require('./notificationRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const publicRoutes = require('./publicRoutes');

router.get('/', (req, res) => {
  res.send('Welcome to SureServe API');
});

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/', slotRoutes); // Mounts /providers/:id/slots
router.use('/bookings', bookingRoutes);
router.use('/provider', providerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboards', dashboardRoutes);
router.use('/chat', require('./chatRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/payments', require('./paymentRoutes'));

module.exports = router;

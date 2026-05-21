const cron = require('node-cron');
const prisma = require('../config/prisma');
const notificationService = require('../services/notificationService');

module.exports = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const expired = await prisma.booking.findMany({
        where: {
          status: 'PENDING',
          expires_at: { lt: now }
        }
      });

      for (const b of expired) {
        let timeline = Array.isArray(b.timeline) ? b.timeline : [];
        timeline.push({ status: 'EXPIRED', at: now.toISOString(), note: 'Auto-expired (no provider response)' });
        
        await prisma.booking.update({
          where: { id: b.id },
          data: { status: 'EXPIRED', timeline }
        });

        await notificationService.notifyCustomer(b.customer_id, {
          type: 'BOOKING_EXPIRED',
          title: 'Provider didn\'t respond',
          body: 'Please book another slot or provider.',
          link: `/bookings/${b.id}`
        });
      }
      if (expired.length) console.log(`[cron] Expired ${expired.length} bookings`);
    } catch (e) {
      console.error('[cron] Error expiring bookings', e);
    }
  });
};

const prisma = require('../config/prisma');
const dayjs = require('dayjs');

exports.customerDashboard = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const now = new Date();

    const [upcomingBookings, pastBookings, allCompleted] = await Promise.all([
      prisma.booking.findMany({
        where: { customer_id: customerId, status: { in: ['PENDING','ACCEPTED','IN_PROGRESS'] } },
        include: { provider: { include: { user: true } }, service: true },
        orderBy: { scheduled_date: 'asc' },
        take: 5
      }),
      prisma.booking.findMany({
        where: { customer_id: customerId, status: { in: ['COMPLETED','REVIEWED','CANCELLED','REJECTED','EXPIRED'] } },
        include: { provider: { include: { user: true } }, service: true },
        orderBy: { scheduled_date: 'desc' },
        take: 5
      }),
      prisma.booking.findMany({
        where: { customer_id: customerId, status: { in: ['COMPLETED','REVIEWED'] } },
        select: { pricing: true }
      })
    ]);

    const totalSpent = allCompleted.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    const completedCount = allCompleted.length;

    const mapBooking = b => ({
      ...b,
      _id: b.id,
      customerId: b.customer_id,
      providerId: { _id: b.provider_id, name: b.provider.user.name, avgRating: b.provider.avg_rating },
      serviceId: { _id: b.service.id, name: b.service.name, icon: b.service.icon },
      scheduledDate: b.scheduled_date,
      slotStart: b.slot_start,
      slotEnd: b.slot_end
    });

    res.json({
      stats: {
        upcomingCount: upcomingBookings.length,
        completedCount,
        totalSpent
      },
      upcoming: upcomingBookings.map(mapBooking),
      past: pastBookings.map(mapBooking)
    });
  } catch (e) { next(e); }
};

exports.providerDashboard = async (req, res, next) => {
  try {
    const providerId = req.user.providerId;
    const today = dayjs().startOf('day').toDate();
    const tomorrow = dayjs().endOf('day').toDate();
    const weekStart = dayjs().startOf('week').toDate();

    const [pending, todayJobs, weekEarningsBookings, reviews, totalJobs] = await Promise.all([
      prisma.booking.findMany({
        where: { provider_id: providerId, status: 'PENDING' },
        include: { customer: true, service: true },
        orderBy: { created_at: 'asc' }
      }),
      prisma.booking.findMany({
        where: { provider_id: providerId, status: { in: ['ACCEPTED','IN_PROGRESS'] } },
        include: { customer: true, service: true },
        orderBy: [{ scheduled_date: 'asc' }, { slot_start: 'asc' }]
      }),
      prisma.booking.findMany({
        where: { provider_id: providerId, status: { in: ['COMPLETED','REVIEWED'] }, scheduled_date: { gte: weekStart } },
        select: { pricing: true }
      }),
      prisma.review.findMany({
        where: { provider_id: providerId },
        select: { rating: true }
      }),
      prisma.booking.count({
        where: { provider_id: providerId, status: { in: ['COMPLETED','REVIEWED'] } }
      })
    ]);

    const weekEarnings = weekEarningsBookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    const ratingCount = reviews.length;
    const avgRating = ratingCount ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount : 0;

    const mapBooking = b => ({
      ...b,
      _id: b.id,
      customerId: { _id: b.customer_id, name: b.customer.name, phone: b.customer.phone },
      serviceId: { _id: b.service.id, name: b.service.name },
      scheduledDate: b.scheduled_date,
      slotStart: b.slot_start,
      slotEnd: b.slot_end
    });

    res.json({
      stats: {
        pendingRequests: pending.length,
        todayJobsCount: todayJobs.length,
        weekEarnings,
        avgRating,
        ratingCount,
        totalJobs
      },
      pendingRequests: pending.map(mapBooking),
      todayJobs: todayJobs.map(mapBooking)
    });
  } catch (e) { next(e); }
};

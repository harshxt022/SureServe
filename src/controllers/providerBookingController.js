const prisma = require('../config/prisma');
const bookingService = require('../services/bookingService');

exports.list = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const providerId = req.user.providerId;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let where = { provider_id: providerId };
    
    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      where.scheduled_date = {
        gte: new Date(d.setHours(0,0,0,0)),
        lte: new Date(d.setHours(23,59,59,999))
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: { select: { name: true, phone: true } },
          service: { select: { name: true } }
        },
        orderBy: [
          { scheduled_date: 'asc' },
          { slot_start: 'asc' }
        ],
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where })
    ]);

    const mapped = bookings.map(b => ({
      ...b,
      _id: b.id,
      customerId: { _id: b.customer_id, name: b.customer.name, phone: b.customer.phone },
      providerId: { _id: b.provider_id, name: 'You' },
      serviceId: { _id: b.service_id, name: b.service.name },
      scheduledDate: b.scheduled_date,
      slotStart: b.slot_start,
      slotEnd: b.slot_end
    }));

    res.json({
      data: mapped,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (e) { next(e); }
};

exports.accept = async (req, res, next) => {
  try { res.json(await bookingService.providerAccept(req.user.providerId, req.params.id)); }
  catch (e) { next(e); }
};
exports.reject = async (req, res, next) => {
  try { res.json(await bookingService.providerReject(req.user.providerId, req.params.id, req.body.reason)); }
  catch (e) { next(e); }
};
exports.start = async (req, res, next) => {
  try { res.json(await bookingService.providerStart(req.user.providerId, req.params.id, req.body.otp)); }
  catch (e) { next(e); }
};
exports.complete = async (req, res, next) => {
  try { res.json(await bookingService.providerComplete(req.user.providerId, req.params.id)); }
  catch (e) { next(e); }
};

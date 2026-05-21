const prisma = require('../config/prisma');
const bookingService = require('../services/bookingService');

exports.create = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (e) { next(e); }
};

exports.listMine = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { customer_id: req.user.id };
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: filter,
        include: {
          provider: {
            include: { user: { select: { name: true } } }
          },
          service: true
        },
        orderBy: { scheduled_date: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where: filter })
    ]);

    const mapped = bookings.map(b => ({
      ...b,
      _id: b.id,
      customerId: b.customer_id,
      providerId: {
        _id: b.provider_id,
        name: b.provider.user.name,
        avgRating: b.provider.avg_rating
      },
      serviceId: {
        _id: b.service.id,
        name: b.service.name,
        icon: b.service.icon,
        category: b.service.category
      },
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

exports.getOne = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        provider: { include: { user: true } },
        service: true,
        customer: true
      }
    });
    
    if (!booking) return res.status(404).json({ message: 'Not found' });
    
    // Authz: Token ID is user ID for customers, provider ID for providers
    const isOwner = booking.customer_id === req.user.id || booking.provider_id === req.user.id;
    if (!isOwner) return res.status(403).json({ message: 'Forbidden' });
    
    res.json({
      ...booking,
      _id: booking.id,
      customerId: { _id: booking.customer_id, name: booking.customer.name, phone: booking.customer.phone },
      providerId: { _id: booking.provider_id, name: booking.provider.user.name },
      serviceId: { _id: booking.service.id, name: booking.service.name, icon: booking.service.icon },
      scheduledDate: booking.scheduled_date,
      slotStart: booking.slot_start,
      slotEnd: booking.slot_end,
      providerResponse: {
        respondedAt: booking.responded_at,
        rejectionReason: booking.rejection_reason,
        expiresAt: booking.expires_at
      },
      paymentStatus: booking.payment_status
    });
  } catch (e) { next(e); }
};

exports.cancel = async (req, res, next) => {
  try {
    const booking = await bookingService.customerCancel(req.user.id, req.params.id);
    res.json(booking);
  } catch (e) { next(e); }
};

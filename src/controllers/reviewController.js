const prisma = require('../config/prisma');

exports.submitReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user.id;

    // Verify booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only review COMPLETED bookings' });
    }

    // Check for existing review
    const existing = await prisma.review.findFirst({ where: { booking_id: bookingId } });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted for this booking' });
    }

    // Transaction to create review, update booking status, and recalculate provider rating
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create review
      const review = await tx.review.create({
        data: {
          booking_id: bookingId,
          customer_id: customerId,
          provider_id: booking.provider_id,
          rating,
          comment
        }
      });

      // 2. Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'REVIEWED' }
      });

      // 3. Recalculate rating
      const allReviews = await tx.review.findMany({
        where: { provider_id: booking.provider_id },
        select: { rating: true }
      });
      
      const ratingCount = allReviews.length;
      const avgRating = ratingCount > 0 
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount 
        : 0;

      // 4. Update provider
      await tx.provider.update({
        where: { id: booking.provider_id },
        data: {
          rating_count: ratingCount,
          avg_rating: avgRating
        }
      });

      return review;
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getProviderReviews = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { provider_id: providerId },
        include: {
          customer: { select: { name: true } },
          booking: { include: { service: { select: { name: true } } } }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where: { provider_id: providerId } })
    ]);

    const mapped = reviews.map(r => ({
      _id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      customerName: r.customer.name,
      serviceName: r.booking.service.name
    }));

    res.json({
      data: mapped,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

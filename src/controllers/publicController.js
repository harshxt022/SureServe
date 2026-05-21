const prisma = require('../config/prisma');

exports.getProviders = async (req, res, next) => {
  try {
    const { service } = req.query;
    let where = {};

    if (service) {
      where = {
        OR: [
          { main_profession: { contains: service, mode: 'insensitive' } },
          {
            services: {
              some: {
                service: {
                  OR: [
                    { name: { contains: service, mode: 'insensitive' } },
                    { category: { contains: service, mode: 'insensitive' } }
                  ]
                }
              }
            }
          }
        ]
      };
    }

    const { minRating, maxPrice, experience, sort } = req.query;

    if (minRating) {
      where.avg_rating = { gte: parseFloat(minRating) };
    }

    if (experience) {
      where.experience_years = { gte: parseInt(experience) };
    }

    if (maxPrice) {
      // We filter based on custom_price or base_price
      // Prisma JSON or relation filtering for max price can be tricky, 
      // but we can filter where there is SOME service that costs <= maxPrice
      where.services = {
        ...where.services,
        some: {
          ...where.services?.some,
          OR: [
            { custom_price: { lte: parseFloat(maxPrice) } },
            { custom_price: null, service: { base_price: { lte: parseFloat(maxPrice) } } }
          ]
        }
      };
    }

    let orderBy = {};
    if (sort === 'rating') orderBy = { avg_rating: 'desc' };
    else if (sort === 'experience') orderBy = { experience_years: 'desc' };
    // 'price' sort is tricky directly in Prisma due to nested relation, so we'll leave it default if not one of above
    else orderBy = { avg_rating: 'desc' };

    const providers = await prisma.provider.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true } },
        services: {
          include: {
            service: true
          }
        },
        availability: { select: { is_accepting_bookings: true } }
      },
      orderBy
    });

    const result = providers.map(p => {
      return {
        _id: p.id,
        name: p.user.name,
        phone: p.user.phone,
        bio: p.bio,
        experience_years: p.experience_years,
        main_profession: p.main_profession,
        avg_rating: p.avg_rating,
        rating_count: p.rating_count,
        servicesOffered: p.services.map(s => ({
          _id: s.service.id,
          name: s.service.name,
          category: s.service.category,
          basePrice: s.custom_price ?? s.service.base_price,
          icon: s.service.icon
        })),
        isAcceptingBookings: p.availability ? p.availability.is_accepting_bookings : true
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        services: { include: { service: true } },
        availability: true,
        reviews: {
          include: { customer: { select: { name: true } }, booking: { include: { service: { select: { name: true } } } } },
          orderBy: { created_at: 'desc' },
          take: 5
        }
      }
    });

    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    res.json({
      _id: provider.id,
      name: provider.user.name,
      email: provider.user.email,
      phone: provider.user.phone,
      bio: provider.bio,
      experience_years: provider.experience_years,
      main_profession: provider.main_profession,
      avg_rating: provider.avg_rating,
      rating_count: provider.rating_count,
      isAcceptingBookings: provider.availability ? provider.availability.is_accepting_bookings : true,
      servicesOffered: provider.services.map(s => ({
        _id: s.service.id,
        name: s.service.name,
        category: s.service.category,
        basePrice: s.custom_price ?? s.service.base_price,
        icon: s.service.icon,
        description: s.service.description
      })),
      reviews: provider.reviews.map(r => ({
        _id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
        customerName: r.customer.name,
        serviceName: r.booking.service.name
      }))
    });
  } catch (err) {
    next(err);
  }
};

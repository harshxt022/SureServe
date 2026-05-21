const prisma = require('../config/prisma');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [usersCount, providersCount, bookingsCount, completedBookings] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({ where: { role: 'provider' } }),
      prisma.booking.count(),
      prisma.booking.findMany({
        where: { status: 'COMPLETED' },
        select: { pricing: true }
      })
    ]);

    const totalRevenue = completedBookings.reduce((sum, b) => {
      const pricingObj = typeof b.pricing === 'string' ? JSON.parse(b.pricing) : b.pricing;
      return sum + (pricingObj?.total || 0);
    }, 0);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        customer: { select: { name: true } },
        provider: { include: { user: { select: { name: true } } } },
        service: { select: { name: true } }
      }
    });

    res.json({
      stats: {
        totalUsers: usersCount,
        totalProviders: providersCount,
        totalBookings: bookingsCount,
        totalRevenue
      },
      recentBookings: recentBookings.map(b => {
        const pricingObj = typeof b.pricing === 'string' ? JSON.parse(b.pricing) : b.pricing;
        return {
          id: b.id,
          customerName: b.customer.name,
          providerName: b.provider.user.name,
          serviceName: b.service.name,
          status: b.status,
          date: b.created_at,
          price: pricingObj?.total || 0
        };
      })
    });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { role: 'customer' };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: parseInt(limit), orderBy: { created_at: 'desc' } }),
      prisma.user.count({ where })
    ]);

    res.json({
      data: users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.created_at })),
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) { next(err); }
};

exports.listProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({ 
        where, 
        skip, 
        take: parseInt(limit), 
        include: { user: true },
        orderBy: { user: { created_at: 'desc' } }
      }),
      prisma.provider.count({ where })
    ]);

    res.json({
      data: providers.map(p => ({
        id: p.id,
        userId: p.user_id,
        name: p.user.name,
        email: p.user.email,
        phone: p.user.phone,
        profession: p.main_profession,
        experience: p.experience_years,
        rating: p.avg_rating,
        createdAt: p.user.created_at
      })),
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) { next(err); }
};

exports.createService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, icon, durationMinutes } = req.body;
    const service = await prisma.service.create({
      data: {
        name, description, category, icon,
        base_price: parseFloat(basePrice),
        duration_minutes: parseInt(durationMinutes) || 60
      }
    });
    res.status(201).json({ ...service, basePrice: service.base_price, _id: service.id });
  } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, icon, durationMinutes } = req.body;
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        name, description, category, icon,
        base_price: basePrice !== undefined ? parseFloat(basePrice) : undefined,
        duration_minutes: durationMinutes !== undefined ? parseInt(durationMinutes) : undefined
      }
    });
    res.json({ ...service, basePrice: service.base_price, _id: service.id });
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    // Check for active bookings
    const activeCount = await prisma.booking.count({
      where: {
        service_id: req.params.id,
        status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] }
      }
    });
    
    if (activeCount > 0) {
      return res.status(400).json({ message: 'Cannot delete service with active bookings' });
    }

    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) { next(err); }
};

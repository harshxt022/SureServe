const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const initialDatabaseSetup = async () => {
  try {
    const servicesToInsert = [
      { name: 'Electrician', description: 'General electrical repair', base_price: 500, category: 'electrical', icon: '⚡' },
      { name: 'Switch Repair', description: 'Fix switches', base_price: 200, category: 'electrical', icon: '🔌' },
      { name: 'Fan Installation', description: 'Ceiling/exhaust fans', base_price: 350, category: 'electrical', icon: '💨' },
      { name: 'Plumber', description: 'General plumbing repair', base_price: 450, category: 'plumbing', icon: '🔧' },
      { name: 'Pipe Leak Repair', description: 'Seal leaking pipes', base_price: 600, category: 'plumbing', icon: '💧' },
      { name: 'AC Repair', description: 'Cooling issues', base_price: 800, category: 'ac-services', icon: '❄️' },
      { name: 'AC Installation', description: 'Split/Window AC', base_price: 1500, category: 'ac-services', icon: '🛠️' },
      { name: 'House Cleaning', description: 'General cleaning', base_price: 1200, category: 'cleaning', icon: '🧹' },
      { name: 'Sofa Cleaning', description: 'Deep sofa clean', base_price: 800, category: 'cleaning', icon: '🛋️' },
      { name: 'Carpenter', description: 'Woodwork repairs', base_price: 400, category: 'carpentry', icon: '🔨' },
      { name: 'Refrigerator Repair', description: 'Cooling & gas issues', base_price: 900, category: 'appliances', icon: '🧊' },
      { name: 'Washing Machine Repair', description: 'Motor & drum repairs', base_price: 750, category: 'appliances', icon: '👕' },
      { name: 'Interior Painting', description: 'Full room painting', base_price: 5000, category: 'painting', icon: '🎨' },
      { name: 'General Pest Control', description: 'Complete pest elimination', base_price: 1500, category: 'pest-control', icon: '🪳' },
      { name: 'TV Installation', description: 'Wall mounting & setup', base_price: 450, category: 'installations', icon: '📺' },
      { name: 'Gardening', description: 'Planting & maintenance', base_price: 300, category: 'outdoor', icon: '🌿' }
    ];

    for (const service of servicesToInsert) {
      const existing = await prisma.service.findFirst({ where: { name: service.name } });
      if (existing) {
        await prisma.service.update({ where: { id: existing.id }, data: service });
      } else {
        await prisma.service.create({ data: service });
      }
    }
    console.log('Database services synchronized via Prisma.');

    // Seed Admin User
    const adminEmail = 'admin@sureserve.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: adminEmail,
          password_hash: hashedPassword,
          phone: '0000000000',
          role: 'admin'
        }
      });
      console.log('Admin user seeded (admin@sureserve.com).');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

module.exports = {
  initialDatabaseSetup
};

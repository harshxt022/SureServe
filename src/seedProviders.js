const prisma = require('./config/prisma');
const bcrypt = require('bcryptjs');

const seedProviders = async () => {
    try {
        console.log('Connected to Prisma DB for seeding');

        const services = await prisma.service.findMany();
        if (services.length === 0) {
            console.log('No services found. Run initDb.js first.');
            process.exit(0);
        }

        const providersData = [
            { name: 'Ramesh Sharma', email: 'ramesh@example.com', phone: '9876543210', role: 'provider', bio: 'Expert Electrician with 10 years experience.', main_profession: 'Master Electrician', avgRating: 4.9, ratingCount: 120 },
            { name: 'Amit Verma', email: 'amit@example.com', phone: '9876543211', role: 'provider', bio: 'Specialist in leak detection and plumbing repairs.', main_profession: 'Plumbing Expert', avgRating: 5.0, ratingCount: 85 },
            { name: 'Suresh Kumar', email: 'suresh@example.com', phone: '9876543212', role: 'provider', bio: 'Professional AC Repair & Servicing.', main_profession: 'AC Technician', avgRating: 4.7, ratingCount: 64 },
            { name: 'Rajesh Singh', email: 'rajesh@example.com', phone: '9876543213', role: 'provider', bio: 'Carpentry and furniture repairs.', main_profession: 'Carpenter', avgRating: 4.8, ratingCount: 45 },
            { name: 'Priya Patel', email: 'priya@example.com', phone: '9876543214', role: 'provider', bio: 'Deep cleaning and sanitation services.', main_profession: 'Cleaning Expert', avgRating: 4.9, ratingCount: 200 },
            { name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543215', role: 'provider', bio: 'Home appliance repair specialist.', main_profession: 'Appliance Repair', avgRating: 4.6, ratingCount: 30 },
            { name: 'Sanjay Dutt', email: 'sanjay@example.com', phone: '9876543216', role: 'provider', bio: 'Professional house painting and wall putty.', main_profession: 'Painter', avgRating: 4.8, ratingCount: 55 },
            { name: 'Sunil Gavaskar', email: 'sunil@example.com', phone: '9876543217', role: 'provider', bio: 'Expert in pest control and termite treatment.', main_profession: 'Pest Control', avgRating: 4.7, ratingCount: 40 },
            { name: 'Manoj Bajpayee', email: 'manoj@example.com', phone: '9876543218', role: 'provider', bio: 'Experienced gardener and lawn maintenance.', main_profession: 'Gardener', avgRating: 4.9, ratingCount: 25 }
        ];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (let p of providersData) {
            let user = await prisma.user.findUnique({ where: { email: p.email } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name: p.name,
                        email: p.email,
                        phone: p.phone,
                        role: 'provider',
                        password_hash: hashedPassword
                    }
                });
            }

            let provider = await prisma.provider.findUnique({ where: { user_id: user.id } });
            if (!provider) {
                provider = await prisma.provider.create({
                    data: {
                        user_id: user.id,
                        bio: p.bio,
                        main_profession: p.main_profession,
                        avg_rating: p.avgRating,
                        rating_count: p.ratingCount,
                        experience_years: 5
                    }
                });
            }

            let matchingServices = [];
            if (p.main_profession.includes('Electrician')) matchingServices = services.filter(s => s.category === 'electrical' || s.name.toLowerCase().includes('electric'));
            else if (p.main_profession.includes('Plumbing')) matchingServices = services.filter(s => s.category === 'plumbing' || s.name.toLowerCase().includes('plumb'));
            else if (p.main_profession.includes('AC')) matchingServices = services.filter(s => s.category === 'ac-services' || s.name.toLowerCase().includes('ac'));
            else if (p.main_profession.includes('Carpenter')) matchingServices = services.filter(s => s.category === 'carpentry' || s.name.toLowerCase().includes('carpent'));
            else if (p.main_profession.includes('Cleaning')) matchingServices = services.filter(s => s.category === 'cleaning' || s.name.toLowerCase().includes('clean'));
            else if (p.main_profession.includes('Appliance')) matchingServices = services.filter(s => s.category === 'appliances' || s.name.toLowerCase().includes('appliance'));
            else if (p.main_profession.includes('Painter')) matchingServices = services.filter(s => s.category === 'painting' || s.name.toLowerCase().includes('paint'));
            else if (p.main_profession.includes('Pest')) matchingServices = services.filter(s => s.category === 'pest-control' || s.name.toLowerCase().includes('pest'));
            else if (p.main_profession.includes('Gardener')) matchingServices = services.filter(s => s.category === 'outdoor' || s.name.toLowerCase().includes('garden'));
            
            if (matchingServices.length === 0) {
                matchingServices = [services[0]]; // Fallback
            }

            for (const s of matchingServices) {
                await prisma.providerService.upsert({
                    where: {
                        provider_id_service_id: {
                            provider_id: provider.id,
                            service_id: s.id
                        }
                    },
                    update: {},
                    create: {
                        provider_id: provider.id,
                        service_id: s.id,
                        custom_price: s.base_price
                    }
                });
            }

            await prisma.providerAvailability.upsert({
                where: { provider_id: provider.id },
                update: {},
                create: {
                    provider_id: provider.id,
                    is_accepting_bookings: true,
                    weekly_schedule: {
                        mon: [{ start: "09:00", end: "17:00" }],
                        tue: [{ start: "09:00", end: "17:00" }],
                        wed: [{ start: "09:00", end: "17:00" }],
                        thu: [{ start: "09:00", end: "17:00" }],
                        fri: [{ start: "09:00", end: "17:00" }],
                        sat: [{ start: "10:00", end: "14:00" }],
                        sun: []
                    }
                }
            });
        }

        console.log('Seeded providers successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedProviders();

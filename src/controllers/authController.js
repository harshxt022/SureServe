const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        phone,
        addresses: address ? [{ label: 'Home', line1: address, city: '', state: '', pincode: '' }] : [],
        role: 'customer'
      },
    });

    res.status(201).json({
      id: user.id,
      name,
      email,
      role: 'customer',
      token: generateToken(user.id, 'customer'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, experience_years, main_profession, bio } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find services that match the main_profession
    const matchingServices = await prisma.service.findMany({
      where: {
        OR: [
          { name: { contains: main_profession, mode: 'insensitive' } },
          { category: { contains: main_profession, mode: 'insensitive' } }
        ]
      }
    });

    // Create user and provider in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          phone,
          role: 'provider'
        }
      });

      const provider = await tx.provider.create({
        data: {
          user_id: user.id,
          bio,
          experience_years: parseInt(experience_years) || 0,
          main_profession,
        }
      });

      // Link matching services
      if (matchingServices.length > 0) {
        await tx.providerService.createMany({
          data: matchingServices.map(s => ({
            provider_id: provider.id,
            service_id: s.id,
            custom_price: s.base_price
          }))
        });
      }

      // Create default availability
      await tx.providerAvailability.create({
        data: {
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

      return { user, provider };
    });

    res.status(201).json({
      id: result.provider.id,
      name: result.user.name,
      email: result.user.email,
      role: 'provider',
      main_profession,
      token: generateToken(result.provider.id, 'provider'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { provider: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Role check to ensure provider is logging in as provider
    if (role === 'provider' && (!user.provider || user.role !== 'provider')) {
        return res.status(401).json({ message: 'Invalid credentials (not a provider)' });
    }

    const accountId = (role === 'provider' && user.provider) ? user.provider.id : user.id;
    const accountRole = user.role === 'admin' ? 'admin' : (role || user.role);

    res.json({
      id: accountId,
      name: user.name,
      email: user.email,
      role: accountRole,
      token: generateToken(accountId, accountRole),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    
    if (role === 'provider') {
      const provider = await prisma.provider.findUnique({ 
        where: { id },
        include: { user: true }
      });
      if (!provider) return res.status(404).json({ message: 'User not found' });
      
      // Flatten response for backwards compatibility
      res.json({
        _id: provider.id,
        name: provider.user.name,
        email: provider.user.email,
        phone: provider.user.phone,
        bio: provider.bio,
        experience_years: provider.experience_years,
        main_profession: provider.main_profession,
        role: provider.user.role
      });
    } else {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: Array.isArray(user.addresses) && user.addresses.length > 0 ? user.addresses[0].line1 : '',
        role: user.role
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const updates = req.body;

    let hashedPassword;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(updates.password, salt);
    }

    if (role === 'provider') {
      const provider = await prisma.provider.findUnique({ where: { id }, include: { user: true } });
      if (!provider) return res.status(404).json({ message: 'Provider not found' });

      // Check email uniqueness if changing
      if (updates.email && updates.email !== provider.user.email) {
        const existing = await prisma.user.findUnique({ where: { email: updates.email } });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: provider.user_id },
          data: {
            name: updates.name || undefined,
            email: updates.email || undefined,
            phone: updates.phone || undefined,
            password_hash: hashedPassword || undefined
          }
        });
        await tx.provider.update({
          where: { id },
          data: {
            experience_years: updates.experience_years ? parseInt(updates.experience_years) : undefined,
            main_profession: updates.main_profession || undefined,
            bio: updates.bio || undefined
          }
        });
      });
      
      const updatedUser = await prisma.user.findUnique({ where: { id: provider.user_id }});
      
      res.json({
        id: provider.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: 'provider',
        token: generateToken(provider.id, 'provider'),
      });
    } else {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (updates.email && updates.email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: updates.email } });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
      }

      let newAddresses = user.addresses || [];
      if (updates.address) {
          newAddresses = [{ label: 'Home', line1: updates.address, city: '', state: '', pincode: '' }];
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name: updates.name || undefined,
          email: updates.email || undefined,
          phone: updates.phone || undefined,
          addresses: newAddresses,
          password_hash: hashedPassword || undefined
        }
      });

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser.id, updatedUser.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    // Simulated email send
    console.log(`Password reset link: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`);

    res.json({ message: 'Password reset link generated. Check server console for the link.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

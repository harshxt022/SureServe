const User = require('../models/User');
const Provider = require('../models/Provider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      id: userId,
      name,
      email,
      role: 'user',
      token: generateToken(userId, 'user'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, experience_years, main_profession, bio } = req.body;

    const providerExists = await Provider.findByEmail(email);
    if (providerExists) {
      return res.status(400).json({ message: 'Provider already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const providerId = await Provider.create({
      name,
      email,
      password: hashedPassword,
      phone,
      experience_years,
      main_profession,
      bio
    });

    res.status(201).json({
      id: providerId,
      name,
      email,
      role: 'provider',
      main_profession,
      token: generateToken(providerId, 'provider'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Expect role ('user' or 'provider')

    let account;
    if (role === 'provider') {
      account = await Provider.findByEmail(email);
    } else {
      account = await User.findByEmail(email);
    }

    if (!account) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: account.id,
      name: account.name,
      email: account.email,
      role: role || 'user',
      token: generateToken(account.id, role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

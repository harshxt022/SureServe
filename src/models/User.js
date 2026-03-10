const db = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  create: async (userData) => {
    const { name, email, password, phone, address } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone, address]
    );
    return result.insertId;
  }
};

module.exports = User;

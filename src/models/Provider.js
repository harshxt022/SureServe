const db = require('../config/db');

const Provider = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM providers WHERE email = ?', [email]);
    return rows[0];
  },

  create: async (providerData) => {
    const { name, email, password, phone, experience_years, main_profession, bio } = providerData;
    const [result] = await db.query(
      'INSERT INTO providers (name, email, password, phone, experience_years, main_profession, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, experience_years, main_profession, bio]
    );
    return result.insertId;
  }
};

module.exports = Provider;

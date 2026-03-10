const db = require('../config/db');

const initialDatabaseSetup = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    );
  `;

  const insertDataQuery = `
    INSERT IGNORE INTO services (id, name, description) VALUES
      (1, 'Electrician', 'Electrical repair and installation services'),
      (2, 'Plumber', 'Plumbing repair and installation services'),
      (3, 'AC Repair', 'Air conditioning repair and maintenance'),
      (4, 'House Cleaning', 'Professional home cleaning services')
  `;

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createProvidersTableQuery = `
    CREATE TABLE IF NOT EXISTS providers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      experience_years INT,
      main_profession VARCHAR(255),
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createTableQuery);
    await db.query(createUsersTableQuery);
    await db.query(createProvidersTableQuery);

    const [rows] = await db.query('SELECT COUNT(*) AS count FROM services');
    if (rows[0].count === 0) {
      await db.query(insertDataQuery);
      console.log('Database seeded with initial services.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

module.exports = {
  initialDatabaseSetup
};

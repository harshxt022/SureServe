require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const indexRoutes = require('./routes/index');
const servicesRoutes = require('./routes/servicesRoutes');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', indexRoutes);
app.use('/services', servicesRoutes);

const { initialDatabaseSetup } = require('./config/initDb');

// Test Database Connection
db.query('SELECT 1')
  .then(async () => {
    console.log('MySQL connected successfully');
    await initialDatabaseSetup();
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

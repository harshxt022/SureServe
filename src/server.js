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
// Serve React static files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api', indexRoutes);
app.use('/api/services', servicesRoutes);

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

// React Catch-all Route for Client-Side Routing
// Should be placed after all API and static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

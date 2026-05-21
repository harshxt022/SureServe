require('dotenv').config();
const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index');
const servicesRoutes = require('./routes/servicesRoutes');
const path = require('path');
const http = require('http');
const expireJob = require('./jobs/expirePendingBookings');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Environment Validation
const requiredEnv = ['JWT_SECRET', 'DATABASE_URL', 'CLIENT_URL'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Environment variable ${env} is missing.`);
    process.exit(1);
  }
});

const { securityHeaders, rateLimiter } = require('./middleware/securityMiddleware');

// Middleware
app.use(securityHeaders);
app.use(rateLimiter);

// Dynamic CORS configuration to support Vite port shifts in development
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [process.env.CLIENT_URL];
    if (allowedOrigins.includes(origin) || 
        /^https?:\/\/localhost:\d+$/.test(origin) || 
        /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
// Serve React static files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api', indexRoutes);
app.use('/api/services', servicesRoutes);

const { initialDatabaseSetup } = require('./config/initDb');
const prisma = require('./config/prisma');

// Connect to Database
prisma.$connect()
  .then(async () => {
    console.log('PostgreSQL Connected via Prisma');
    await initialDatabaseSetup();
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  });

// Initialize Socket.io
const socket = require('./config/socket');
socket.init(server);

// Start Cron Jobs
expireJob();

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]:', err);
  const status = err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(status).json({ 
    message: err.message || 'Server error',
    ...(isDev && { stack: err.stack })
  });
});

// React Catch-all Route for Client-Side Routing
// Should be placed after all API and static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Handle port collision and other server startup errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[PORT COLLISION ERROR]: Port ${PORT} is already in use.`);
    console.error(`Please kill the process using port ${PORT} or configure a different port by setting PORT in your .env file.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

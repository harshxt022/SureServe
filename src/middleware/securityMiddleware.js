// Simple security headers (helmet alternative)
exports.securityHeaders = (req, res, next) => {
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

// Simple rate limiter using Map (express-rate-limit alternative)
const requestCounts = new Map();
setInterval(() => requestCounts.clear(), 15 * 60 * 1000); // Clear every 15 minutes

exports.rateLimiter = (req, res, next) => {
  // Bypass rate limiting in development to avoid local test blocks
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const ip = req.ip || req.connection.remoteAddress;
  const currentCount = requestCounts.get(ip) || 0;
  
  if (currentCount > 1000) { // 1000 requests per 15 minutes in production
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
  
  requestCounts.set(ip, currentCount + 1);
  next();
};

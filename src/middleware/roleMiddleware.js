exports.requireCustomer = (req, res, next) => {
  if (req.user?.role !== 'customer') return res.status(403).json({ message: 'Customers only' });
  next();
};
exports.requireProvider = (req, res, next) => {
  if (req.user?.role !== 'provider') return res.status(403).json({ message: 'Providers only' });
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
};

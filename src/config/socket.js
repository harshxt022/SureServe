const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map();   // userId -> Set<socketId>

exports.init = (server) => {
  io = new Server(server, {
    cors: {
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
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch { next(new Error('Unauthorized')); }
  });

  io.on('connection', (socket) => {
    const id = socket.user.id;
    if (!userSockets.has(id)) userSockets.set(id, new Set());
    userSockets.get(id).add(socket.id);

    socket.on('disconnect', () => {
      userSockets.get(id)?.delete(socket.id);
      if (!userSockets.get(id)?.size) userSockets.delete(id);
    });
  });
};

exports.emitToUser = (userId, event, payload) => {
  const sockets = userSockets.get(String(userId));
  if (!sockets || !io) return;
  sockets.forEach(sid => io.to(sid).emit(event, payload));
};

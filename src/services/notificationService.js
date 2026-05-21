const prisma = require('../config/prisma');
const socket = require('../config/socket');

async function _send(userId, payload) {
  const notif = await prisma.notification.create({ 
    data: {
      user_id: userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      link: payload.link || null
    }
  });

  const mapped = {
    _id: notif.id,
    userId: notif.user_id,
    type: notif.type,
    title: notif.title,
    body: notif.body,
    link: notif.link,
    read: notif.read,
    createdAt: notif.created_at
  };

  socket.emitToUser(userId, 'notification:new', mapped);
  socket.emitToUser(userId, payload.type.toLowerCase().replace('_',':'), payload.meta || {});
  return mapped;
}

exports.notifyCustomer = (userId, payload) => _send(userId, payload);

exports.notifyProvider = async (providerId, payload) => {
  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (provider && provider.user_id) {
    return _send(provider.user_id, payload);
  }
  return _send(providerId, payload);
};

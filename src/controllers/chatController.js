const prisma = require('../config/prisma');

exports.getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const messages = await prisma.message.findMany({ 
      where: { booking_id: bookingId },
      orderBy: { created_at: 'asc' },
      include: { sender: true, booking: true }
    });
    
    // Map to camelCase and resolve logical sender IDs
    const mapped = messages.map(m => {
      let logicalSenderId = m.sender_user_id;
      let senderRole = m.sender.role;
      // If the sender was the provider, we map it back to providerId for UI consistency
      if (senderRole === 'provider') {
         logicalSenderId = m.booking.provider_id;
      }
      return {
        _id: m.id,
        bookingId: m.booking_id,
        senderId: logicalSenderId,
        senderRole: senderRole,
        text: m.message,
        createdAt: m.created_at
      };
    });
    
    res.json(mapped);
  } catch (e) { next(e); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { bookingId, text } = req.body;
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }});
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isCustomer = booking.customer_id === req.user.id;
    const isProvider = booking.provider_id === req.user.id;

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized to chat in this booking' });
    }

    const senderId = req.user.id;
    let senderUserId = req.user.id;
    let receiverId;

    if (isProvider) {
        const provider = await prisma.provider.findUnique({ where: { id: senderId }});
        senderUserId = provider.user_id;
        receiverId = booking.customer_id;
    } else {
        receiverId = booking.provider_id;
    }

    const message = await prisma.message.create({
      data: {
        booking_id: bookingId,
        sender_user_id: senderUserId,
        message: text
      }
    });

    const mappedMessage = {
      _id: message.id,
      bookingId: message.booking_id,
      senderId: senderId,
      senderRole: req.user.role,
      receiverId,
      text: message.message,
      createdAt: message.created_at
    };

    // Emit via socket
    const socket = require('../config/socket');
    socket.emitToUser(receiverId, 'chat:message', mappedMessage);

    res.status(201).json(mappedMessage);
  } catch (e) { next(e); }
};

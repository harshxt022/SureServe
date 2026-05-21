const prisma = require('../config/prisma');

exports.list = async (req, res, next) => {
  try {
    const list = await prisma.notification.findMany({ 
        where: { user_id: req.user.id },
        orderBy: { created_at: 'desc' },
        take: 50
    });
    
    const mapped = list.map(n => ({
      ...n,
      _id: n.id,
      userId: n.user_id,
      createdAt: n.created_at
    }));
    
    res.json(mapped);
  } catch (e) { next(e); }
};

exports.markRead = async (req, res, next) => {
  try {
    // using updateMany to apply where condition without checking if it exists
    await prisma.notification.updateMany({ 
        where: { id: req.params.id, user_id: req.user.id },
        data: { read: true } 
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.markAllRead = async (req, res, next) => {
  try { 
      await prisma.notification.updateMany({ 
          where: { user_id: req.user.id, read: false }, 
          data: { read: true } 
      }); 
      res.json({ ok: true }); 
  }
  catch (e) { next(e); }
};

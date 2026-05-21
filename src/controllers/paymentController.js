const crypto = require('crypto');
const prisma = require('../config/prisma');

const RZP_KEY_ID = process.env.RZP_KEY_ID || 'rzp_test_SrgMHAzyX1fXzF';
const RZP_KEY_SECRET = process.env.RZP_KEY_SECRET || 'CdBt716nvdO6NhaFVdq2madW';

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    // Convert to paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay Error: ${errorText}`);
    }

    const order = await response.json();
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RZP_KEY_ID
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RZP_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is valid, update booking
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { payment_status: 'PAID' }
        });
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        provider: { include: { user: true } },
        service: true
      }
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Auth check
    const isOwner = booking.customer_id === req.user.id || booking.provider_id === req.user.id || req.user.role === 'admin';
    if (!isOwner) return res.status(403).json({ message: 'Forbidden' });

    const pricing = typeof booking.pricing === 'string' ? JSON.parse(booking.pricing) : booking.pricing;

    const invoice = {
      invoiceNumber: `INV-${booking.id.substring(0, 8).toUpperCase()}`,
      date: booking.created_at,
      status: booking.payment_status,
      customer: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      provider: {
        name: booking.provider.user.name,
        profession: booking.provider.main_profession
      },
      service: {
        name: booking.service.name,
        category: booking.service.category
      },
      pricing: pricing || { baseAmount: 0, taxes: 0, total: 0 }
    };

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

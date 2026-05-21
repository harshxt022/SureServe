const prisma = require('../config/prisma');
const generateBookingId = require('../utils/generateBookingId');
const otpService = require('./otpService');
const notificationService = require('./notificationService');

const EXPIRY_MIN = parseInt(process.env.BOOKING_EXPIRY_MINUTES || '15');

exports.createBooking = async (customerId, payload) => {
  const conflict = await prisma.booking.findFirst({
    where: {
      provider_id: payload.providerId,
      scheduled_date: new Date(payload.scheduledDate),
      slot_start: payload.slotStart,
      status: { in: ['PENDING','ACCEPTED','IN_PROGRESS'] }
    }
  });
  if (conflict) { const e = new Error('Slot just got taken. Please pick another.'); e.status = 409; throw e; }

  const expiresAt = new Date(Date.now() + EXPIRY_MIN * 60 * 1000);

  const booking = await prisma.booking.create({
    data: {
      booking_code: generateBookingId(),
      customer_id: customerId,
      provider_id: payload.providerId,
      service_id: payload.serviceId,
      scheduled_date: new Date(payload.scheduledDate),
      slot_start: payload.slotStart,
      slot_end: payload.slotEnd,
      address: payload.address,
      pricing: payload.pricing,
      notes: payload.notes,
      otp: otpService.generateOtp(),
      status: 'PENDING',
      timeline: [{ status: 'PENDING', at: new Date().toISOString(), by: customerId, note: 'Customer created request' }],
      expires_at: expiresAt
    }
  });

  await notificationService.notifyProvider(payload.providerId, {
    type: 'BOOKING_NEW',
    title: 'New booking request',
    body: `Slot ${booking.slot_start}–${booking.slot_end}`,
    link: `/provider/requests/${booking.id}`,
    meta: { bookingId: booking.id }
  });

  return { ...booking, _id: booking.id };
};

exports.providerAccept = async (providerId, bookingId) => {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, provider_id: providerId } });
  if (!booking) { const e = new Error('Booking not found'); e.status = 404; throw e; }
  if (booking.status !== 'PENDING') { const e = new Error(`Cannot accept from ${booking.status}`); e.status = 400; throw e; }

  let timeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  timeline.push({ status: 'ACCEPTED', at: new Date().toISOString(), by: providerId });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'ACCEPTED',
      responded_at: new Date(),
      timeline: timeline
    }
  });

  await notificationService.notifyCustomer(booking.customer_id, {
    type: 'BOOKING_ACCEPTED',
    title: 'Booking accepted ✅',
    body: `Your booking ${booking.booking_code} is confirmed`,
    link: `/bookings/${booking.id}`
  });
  return { ...updated, _id: updated.id };
};

exports.providerReject = async (providerId, bookingId, reason) => {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, provider_id: providerId } });
  if (!booking) { const e = new Error('Not found'); e.status = 404; throw e; }
  if (booking.status !== 'PENDING') { const e = new Error('Only PENDING can be rejected'); e.status = 400; throw e; }

  let timeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  timeline.push({ status: 'REJECTED', at: new Date().toISOString(), by: providerId, note: reason });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'REJECTED',
      responded_at: new Date(),
      rejection_reason: reason,
      timeline: timeline
    }
  });

  await notificationService.notifyCustomer(booking.customer_id, {
    type: 'BOOKING_REJECTED',
    title: 'Booking declined',
    body: reason || 'Provider unavailable. Please book another slot.',
    link: `/bookings/${booking.id}`
  });
  return { ...updated, _id: updated.id };
};

exports.customerCancel = async (customerId, bookingId) => {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, customer_id: customerId } });
  if (!booking) { const e = new Error('Not found'); e.status = 404; throw e; }
  if (!['PENDING','ACCEPTED'].includes(booking.status)) {
    const e = new Error('Cannot cancel this booking'); e.status = 400; throw e;
  }
  
  let timeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  timeline.push({ status: 'CANCELLED', at: new Date().toISOString(), by: customerId });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED',
      timeline: timeline
    }
  });

  await notificationService.notifyProvider(booking.provider_id, {
    type: 'BOOKING_CANCELLED',
    title: 'Booking cancelled by customer',
    body: booking.booking_code,
    link: `/provider/bookings/${booking.id}`
  });
  return { ...updated, _id: updated.id };
};

exports.providerStart = async (providerId, bookingId, otp) => {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, provider_id: providerId } });
  if (!booking) { const e = new Error('Not found'); e.status = 404; throw e; }
  if (booking.status !== 'ACCEPTED') { const e = new Error('Must be ACCEPTED'); e.status = 400; throw e; }
  if (booking.otp !== otp) { const e = new Error('Invalid OTP'); e.status = 400; throw e; }

  let timeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  timeline.push({ status: 'IN_PROGRESS', at: new Date().toISOString(), by: providerId });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'IN_PROGRESS',
      timeline: timeline
    }
  });
  return { ...updated, _id: updated.id };
};

exports.providerComplete = async (providerId, bookingId) => {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, provider_id: providerId } });
  if (!booking) { const e = new Error('Not found'); e.status = 404; throw e; }
  if (booking.status !== 'IN_PROGRESS') { const e = new Error('Must be IN_PROGRESS'); e.status = 400; throw e; }
  
  let timeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  timeline.push({ status: 'COMPLETED', at: new Date().toISOString(), by: providerId });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'COMPLETED',
      timeline: timeline
    }
  });

  await notificationService.notifyCustomer(booking.customer_id, {
    type: 'BOOKING_COMPLETED',
    title: 'Service completed',
    body: 'Please leave a review',
    link: `/bookings/${booking.id}/review`
  });
  return { ...updated, _id: updated.id };
};

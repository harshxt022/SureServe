const prisma = require('../config/prisma');

const mapAvailabilityToCamel = (doc) => {
  if (!doc) return {};
  return {
    ...doc,
    weeklySchedule: doc.weekly_schedule,
    slotDurationMinutes: doc.slot_duration_minutes,
    bufferMinutes: doc.buffer_minutes,
    advanceBookingDays: doc.advance_booking_days,
    minNoticeHours: doc.min_notice_hours,
    blackoutDates: doc.blackout_dates,
    customSlots: doc.custom_slots,
    isAcceptingBookings: doc.is_accepting_bookings
  };
};

exports.getMyAvailability = async (req, res, next) => {
  try {
    const doc = await prisma.providerAvailability.findUnique({ where: { provider_id: req.user.id } });
    res.json(mapAvailabilityToCamel(doc));
  } catch (e) { next(e); }
};

exports.upsertAvailability = async (req, res, next) => {
  try {
    const update = { ...req.body };
    const doc = await prisma.providerAvailability.upsert({
      where: { provider_id: req.user.id },
      update: {
        weekly_schedule: update.weeklySchedule,
        slot_duration_minutes: update.slotDurationMinutes,
        buffer_minutes: update.bufferMinutes,
        advance_booking_days: update.advanceBookingDays,
        min_notice_hours: update.minNoticeHours,
      },
      create: {
        provider_id: req.user.id,
        weekly_schedule: update.weeklySchedule || {},
        slot_duration_minutes: update.slotDurationMinutes,
        buffer_minutes: update.bufferMinutes,
        advance_booking_days: update.advanceBookingDays,
        min_notice_hours: update.minNoticeHours,
      }
    });
    res.json(mapAvailabilityToCamel(doc));
  } catch (e) { next(e); }
};

exports.addBlackout = async (req, res, next) => {
  try {
    const { date } = req.body;
    const current = await prisma.providerAvailability.findUnique({ where: { provider_id: req.user.id } });
    let blackouts = current && current.blackout_dates ? current.blackout_dates : [];
    if (!blackouts.includes(date)) blackouts.push(date);
    
    const doc = await prisma.providerAvailability.upsert({
      where: { provider_id: req.user.id },
      update: { blackout_dates: blackouts },
      create: {
        provider_id: req.user.id,
        weekly_schedule: {},
        blackout_dates: blackouts
      }
    });
    res.json(mapAvailabilityToCamel(doc));
  } catch (e) { next(e); }
};

exports.toggleAccepting = async (req, res, next) => {
  try {
    const { isAcceptingBookings } = req.body;
    const doc = await prisma.providerAvailability.upsert({
      where: { provider_id: req.user.id },
      update: { is_accepting_bookings: isAcceptingBookings },
      create: {
        provider_id: req.user.id,
        weekly_schedule: {},
        is_accepting_bookings: isAcceptingBookings
      }
    });
    res.json(mapAvailabilityToCamel(doc));
  } catch (e) { next(e); }
};

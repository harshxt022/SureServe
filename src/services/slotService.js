const dayjs = require('dayjs');
const prisma = require('../config/prisma');
const { getWeekdayKey, toMinutes, fromMinutes, isSameDay } = require('../utils/timeHelpers');

/**
 * Generate available slots for a provider on a given date.
 * Returns: [{ start: "10:00", end: "11:00", available: true }]
 */
exports.generateSlotsForDate = async (providerId, date) => {
  const availability = await prisma.providerAvailability.findUnique({ where: { provider_id: providerId } });
  if (!availability || !availability.is_accepting_bookings) return [];

  const target = dayjs(date).startOf('day');
  const now = dayjs();

  // Reject if outside booking horizon
  if (target.diff(now, 'day') > availability.advance_booking_days) return [];
  if (target.isBefore(now.startOf('day'))) return [];

  // Blackout check
  let blackoutDates = Array.isArray(availability.blackout_dates) ? availability.blackout_dates : [];
  if (blackoutDates.some(d => isSameDay(new Date(d), date))) return [];

  // Determine windows: customSlots override weekly
  const customSlots = Array.isArray(availability.custom_slots) ? availability.custom_slots : [];
  const custom = customSlots.find(c => isSameDay(new Date(c.date), date));
  
  let weeklySchedule = availability.weekly_schedule || {};
  const windows = custom ? custom.slots : (weeklySchedule[getWeekdayKey(date)] || []);
  if (!windows.length) return [];

  const duration = availability.slot_duration_minutes;
  const buffer   = availability.buffer_minutes;
  const minNoticeMs = availability.min_notice_hours * 60 * 60 * 1000;

  // Build raw slots
  const rawSlots = [];
  for (const w of windows) {
    let cursor = toMinutes(w.start);
    const end = toMinutes(w.end);
    while (cursor + duration <= end) {
      rawSlots.push({
        start: fromMinutes(cursor),
        end: fromMinutes(cursor + duration)
      });
      cursor += duration + buffer;
    }
  }

  // Get existing bookings for that date (PENDING + ACCEPTED + IN_PROGRESS block the slot)
  const dayStart = target.toDate();
  const dayEnd = target.endOf('day').toDate();
  
  const taken = await prisma.booking.findMany({
    where: {
      provider_id: providerId,
      scheduled_date: { gte: dayStart, lte: dayEnd },
      status: { in: ['PENDING','ACCEPTED','IN_PROGRESS'] }
    },
    select: { slot_start: true, slot_end: true }
  });

  const takenSet = new Set(taken.map(b => `${b.slot_start}-${b.slot_end}`));

  // Filter: remove taken + remove slots before now+minNotice
  return rawSlots.map(s => {
    const slotDateTime = dayjs(`${target.format('YYYY-MM-DD')}T${s.start}`);
    const isPast = slotDateTime.diff(now) < minNoticeMs;
    const isTaken = takenSet.has(`${s.start}-${s.end}`);
    return { ...s, available: !isPast && !isTaken };
  }).filter(s => s.available);
};

exports.generateSlotsForRange = async (providerId, fromDate, toDate) => {
  const result = [];
  let cursor = dayjs(fromDate);
  const end = dayjs(toDate);
  while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
    const slots = await exports.generateSlotsForDate(providerId, cursor.toDate());
    result.push({ date: cursor.format('YYYY-MM-DD'), slots });
    cursor = cursor.add(1, 'day');
  }
  return result;
};

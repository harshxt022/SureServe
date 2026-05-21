const dayjs = require('dayjs');

const WEEKDAYS = ['sun','mon','tue','wed','thu','fri','sat'];

exports.getWeekdayKey = (date) => WEEKDAYS[dayjs(date).day()];
exports.toMinutes = (hhmm) => {
  const [h,m] = hhmm.split(':').map(Number); return h*60 + m;
};
exports.fromMinutes = (mins) => {
  const h = String(Math.floor(mins/60)).padStart(2,'0');
  const m = String(mins%60).padStart(2,'0'); return `${h}:${m}`;
};
exports.isSameDay = (a,b) => dayjs(a).isSame(dayjs(b), 'day');

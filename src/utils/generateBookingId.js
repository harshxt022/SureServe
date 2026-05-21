const dayjs = require('dayjs');
module.exports = () => {
  const date = dayjs().format('YYYYMMDD');
  const rand = Math.floor(1000 + Math.random()*9000);
  return `SS-${date}-${rand}`;
};

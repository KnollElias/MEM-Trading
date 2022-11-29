var cron = require('node-cron');

function oneMinuteRoutine() {};

cron.schedule('* * * * *', () => {
  oneMinuteRoutine();
});
var cron = require('node-cron');

function oneMinuteRoutine() {
    console.log("hello routine every m1 candle close")
};

cron.schedule('1 * * * * *', () => {
  oneMinuteRoutine();
});
var cron = require("node-cron");
var bybit = require("./bybit-api.js");

function oneMinuteRoutine() {
    console.log("hello routine every m1 candle close")
};

cron.schedule("1 * * * * *", () => {
    oneMinuteRoutine();
});
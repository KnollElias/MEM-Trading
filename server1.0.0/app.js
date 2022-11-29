let cron = require("node-cron");
let bybit = require("./bybit-api.js");

function oneMinuteRoutine() {
    console.log("hello routine every m1 candle close")
    var close = bybit.getBTCUSD()
};

cron.schedule("1 * * * * *", () => {
    oneMinuteRoutine();
});
// @2021 reinvented the sma
// @2023 perfectionized martingale nodes
// @2025 realworld application with options in papertrading

const fs = require('fs');

const inputPath = "/home/main/Documents/GitHub/MEM-Trading/splitmartin/btc-usd-edited-test.csv";
const outputPath = "/home/main/Desktop/singlebacktest.csv";

// Load dataset
const data = fs.readFileSync(inputPath, 'utf8');
const rows = data.split('\n').slice(1); // Skip header row

// Parse dataset
const priceData = rows.map(row => {
    const [snapped_at, price, sma] = row.split(',');
    return { 
        snapped_at, 
        price: parseFloat(price), 
        sma: parseFloat(sma) 
    };
}).filter(row => !isNaN(row.price) && !isNaN(row.sma)); // Filter out rows with missing SMA

// Initialize balances and risk variables
let balance = 100;
let balanceLastRound = balance;
let risk = 1; // Start with initial risk

const riskInitial = 1;
const loss = 1;
const gain = 0.9;
const riskMultiplier = 2;

// Write header to output file
fs.writeFileSync(outputPath,  'date,price,sma,trend,risk,balance,trade\n');
console.log("grüezi");

// Main backtesting loop
priceData.forEach((row, i) => {
    const { snapped_at, price, sma } = row;
    const lastPrice = priceData[i - 1]?.price;
    const lastSma = priceData[i - 1]?.price;

    // get trend
    let lastTrend = 0;
    if (priceData[i - 1]?.price >= priceData[i - 1]?.sma) {
        lastTrend = 1;
    } else {
        lastTrend = -1;
    }
console.log(`${i},${price},${sma},${lastTrend},${risk},${balance}`)
    // get outcome
    if (lastTrend !== 0) { // uptrend
        if (lastTrend === 1 && price > lastPrice || lastTrend === -1 && price < lastPrice)
        {
            // won action
            console.warn("won")
        } else { // downtrend
            // lost action
            console.error("lost")
        }
    
    }


    


    // Determine trend and outcome
    let winThisRound = false;

    if (price > sma) {
        trend = 'bullish';
        winThisRound = (price > priceData[i - 1]?.price); // Price increased
    } else if (price < sma) {
        trend = 'bearish';
        winThisRound = (price < priceData[i - 1]?.price); // Price decreased
    } else {
        trend = 'neutral';
        winThisRound = (price > priceData[i - 1]?.price); // Default to bullish assumption
    }

    // Adjust risk based on last round outcome
    if (balance < balanceLastRound) {
        risk *= riskMultiplier; // Increase risk on loss
    } else {
        risk = riskInitial; // Reset risk on win
    }

    // Update balance
    if (winThisRound) {
        balance += risk * gain;
        risk = riskInitial;
    } else {
        balance -= risk * loss;
        risk = (risk * 2);
    }

    // Record balance for next round comparison
    balanceLastRound = balance;

    // Output to CSV
    // fs.appendFileSync(
    //     outputPath, `${snapped_at},${price},${sma},${trend},${risk},${balance}\n`
    // );
});

console.log('Backtest complete. Results saved to backtest.csv');
console.warn(`Final Balance: ${balance}`);

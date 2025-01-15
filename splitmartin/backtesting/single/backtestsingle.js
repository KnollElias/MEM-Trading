const fs = require('fs');

// Load dataset
const data = fs.readFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/btc-usd-edited.csv', 'utf8');
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
let balance = 12.5;
let balanceLastRound = balance;
let risk = 20; // Start with initial risk

const riskInitial = 20;
const loss = 1;
const gain = 0.9;
const riskMultiplier = 2;

// Write header to output file
fs.writeFileSync(        '/home/main/Documents/GitHub/MEM-Trading/splitmartin/backtesting/singlebacktest.csv',  'date,price,sma,trend,risk,balance\n');

// Main backtesting loop
priceData.forEach((row, i) => {
    const { snapped_at, price, sma } = row;

    // Determine trend and outcome
    let trend = '';
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
    fs.appendFileSync(
        '/home/main/Documents/GitHub/MEM-Trading/splitmartin/backtesting/singlebacktest.csv', 
        `${snapped_at},${price},${sma},${trend},${risk},${balance}\n`
    );
});

console.log('Backtest complete. Results saved to backtest.csv');
console.warn(`Final Balance: ${balance}`);

const fs = require('fs');
const csv = require('csv-parser');

if (fs.existsSync('output_with_outcome.csv')) fs.unlinkSync('output_with_outcome.csv');

let closingPrices = [];
let lossCount = 0;

function predictDirection(closingPrices, smaPeriod, emaPeriod) {
  const n = closingPrices.length;
  if (n < Math.max(smaPeriod, emaPeriod)) return "Insufficient data";
  let sma = 0;
  for (let i = n - smaPeriod; i < n; i++) sma += closingPrices[i];
  sma /= smaPeriod;
  let ema = sma;
  for (let i = n - emaPeriod; i < n; i++) ema = (closingPrices[i] * (2 / (emaPeriod + 1))) + (ema * (1 - (2 / (emaPeriod + 1))));
  const last5Prices = closingPrices.slice(-5);
  let countUp = 0;
  let countDown = 0;
  for (let i = 0; i < last5Prices.length - 1; i++) {
    if (last5Prices[i] < last5Prices[i + 1]) countUp++;
    else if (last5Prices[i] > last5Prices[i + 1]) countDown++;
  }
  const lastPrice = closingPrices[n - 1];
  if (countUp > countDown && ema > sma && lastPrice > ema) return "Positive";
  else if (countDown > countUp && sma > ema && lastPrice < sma) return "Negative";
  else return "Neutral";
}

function checkOutcome(prediction, currentPrice, nextPrice) {
  if (prediction === "Positive" && nextPrice > currentPrice) return "Win";
  if (prediction === "Negative" && nextPrice < currentPrice) return "Win";
  return "Loss";
}

const outputCsv = fs.createWriteStream('output_with_outcome.csv');
outputCsv.write('Index,ClosingPrice,Prediction,Outcome,ConsecutiveLosses\n');

fs.createReadStream('./EURUSDDaily.csv')
  .pipe(csv())
  .on('data', (row) => closingPrices.push(parseFloat(row.Close)))
  .on('end', () => {
    const smaPeriod = 5;
    const emaPeriod = 5;
    for (let i = Math.max(smaPeriod, emaPeriod); i < closingPrices.length - 1; i++) {
      const slice = closingPrices.slice(i - Math.max(smaPeriod, emaPeriod), i);
      const prediction = predictDirection(slice, smaPeriod, emaPeriod);
      const outcome = (prediction !== "Neutral") ? checkOutcome(prediction, closingPrices[i], closingPrices[i + 1]) : "Neutral";
      if (outcome === "Loss") lossCount++;
      else if (outcome === "Win") lossCount = 0;
      console.log(`Prediction for index ${i} is: ${prediction}, Outcome: ${outcome}, Closing Price: ${closingPrices[i]}, ConsecutiveLosses: ${lossCount}`);
      outputCsv.write(`${i},${closingPrices[i]},${prediction},${outcome},${(outcome !== "Neutral") ? lossCount : ''}\n`);
    }
    outputCsv.end();
  });

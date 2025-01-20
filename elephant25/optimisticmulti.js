const fs = require('fs');
const { start } = require('repl');

balances = [2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048];
balancesLastRound = [2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048];
nodeCount = 20;
nodeActive = nodeCount; // so the first iteration starts with one, could also set it to "1" but meh

riskInitial = 0.01;
risk = [riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial];
loss = 1;
gain = 1;
riskMulityplier = 2;

iterations = 9000000000000000000;

function upgradeNode() {
    nodeActive = nodeActive == nodeCount ? 1 : nodeActive + 1;
};

function getRandomBool() {
    return Math.random() >= 0.5;
}

// console.log("Index, " + " Node, " + " Outcome, " + " Risk, " + " Balance ");

for (i = 0; i < iterations; i++) {
    upgradeNode();
    winThisRound = getRandomBool();

    // raise risk if lost last round
    if (balances[nodeActive - 1] < balancesLastRound[nodeActive - 1]) { // lostLastRound
        risk[nodeActive - 1] *= riskMulityplier;
    } else {
        risk[nodeActive - 1] = riskInitial;
    }

    // update last round balances based on current risk
    if (winThisRound) {
        balances[nodeActive - 1] += risk[nodeActive - 1] * gain;
    } else {
        balances[nodeActive - 1] -= risk[nodeActive - 1] * loss;
    }

    if ((i % nodeCount) == 0) {
        // console.log("  ");
    }

    console.log("Iteration: " + i);
    
    if (balances[nodeActive - 1] > 0) {
        // console.warn("" + i + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
    } else {
        console.error("" + i  + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
        break;
        balances[nodeActive - 1] = 0;
        risk[nodeActive - 1] = 0;
        balances[nodeActive - 1] = 0;

    }
}

// fs.appendFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/output_multi.csv', `${balances[0] + balances[1] + balances[2] + balances[3] + balances[4] + balances[5] + balances[6] + balances[7]},\n`);
// console.log(balances);

const startingBalances = [2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048];
let staringSum = 0;
for (let i = 0; i < startingBalances.length; i++) {
    staringSum += startingBalances[i];
}

let finalSum = 0;
for (let i = 0; i < balances.length; i++) {
    finalSum += balances[i];
}
console.warn(`starting balance: ${staringSum}, final balance: ${finalSum}, profits: ${finalSum - staringSum}`)
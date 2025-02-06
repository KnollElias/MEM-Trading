const fs = require('fs');

balances = [520];
balancesLastRound = [520];
nodeCount = 1;
nodeActive = nodeCount; // so the first iteration starts with one, could also set it to "1" but meh

riskInitial = 1;
risk = [riskInitial];
loss = 1;
gain = 0.9;
riskMulityplier = 2;

iterations = 9000;

function upgradeNode() {
    nodeActive = nodeActive == nodeCount ? 1 : nodeActive + 1;
};

function getRandomBool() {
    return Math.random() >= 0.5;
}

console.log("Index, " + " Node, " + " Outcome, " + " Risk, " + " Balance ");

for (i = 0; i < iterations; i++) {
    upgradeNode();
    winThisRound = getRandomBool();

    totalbalance = fs.appendFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/output_single.csv', `${balances},\n`);


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
    
    if (balances[nodeActive - 1] > 0) {
        console.warn("" + i + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
    } else {
        console.error("" + i  + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
        break;
        balances[nodeActive - 1] = 0;
        risk[nodeActive - 1] = 0;
        balances[nodeActive - 1] = 0;

    }
}

fs.appendFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/output_single.csv', `${balances},\n`);
console.log(balances);
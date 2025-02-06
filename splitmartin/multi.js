const fs = require('fs');

startingBalancePerScale = 130;
balances = [startingBalancePerScale, startingBalancePerScale, startingBalancePerScale, startingBalancePerScale];
balancesLastRound = [startingBalancePerScale, startingBalancePerScale, startingBalancePerScale, startingBalancePerScale];
nodeCount = 4;
nodeActive = nodeCount; // so the first iteration starts with one, could also set it to "1" but meh

riskInitial = 1;
risk = [riskInitial, riskInitial, riskInitial, riskInitial];
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

    // fs.appendFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/output_multi.csv', `${balances[0] + balances[1] + balances[2] + balances[3] + balances[4] + balances[5] + balances[6] + balances[7]},\n`);


    // raise risk if lost last round
    if (balances[nodeActive - 1] < balancesLastRound[nodeActive - 1]) { // lostLastRound
        risk[nodeActive - 1] =  risk[nodeActive - 1] * riskMulityplier;
        console.log("new risk: for scale: " + nodeActive + " is: " + risk[nodeActive - 1]);
    } else {
        risk[nodeActive - 1] = riskInitial;
    }

    // update last round balances based on current risk
    if (winThisRound) {
        balances[nodeActive - 1] += risk[nodeActive - 1] * gain;
    } else {
        balances[nodeActive - 1] -= risk[nodeActive - 1] * loss;
    }

    
    if (balances[nodeActive - 1] > 0) {
        if ((i % nodeCount) == 0) {
            // console.log("  ");
            console.warn("" + i + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
        }
    } else {
        console.error("" + i  + ", " + nodeActive  + ", " + winThisRound  + ", " + risk[nodeActive - 1]  + ", " + balances[nodeActive - 1]);
        break;
        balances[nodeActive - 1] = 0;
        risk[nodeActive - 1] = 0;
        balances[nodeActive - 1] = 0;

    }
}

fs.appendFileSync('/home/main/Documents/GitHub/MEM-Trading/splitmartin/output_multi.csv', `${balances[0] + balances[1] + balances[2] + balances[3]},\n`);
console.log(balances);
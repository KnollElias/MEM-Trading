balances = [100, 100, 100, 100, 100, 100, 100, 100];
balancesLastRound = [100, 100, 100, 100, 100, 100, 100, 100];
nodeCount = 8;
nodeActive = nodeCount; // so the first iteration starts with one, could also set it to "1" but meh

riskInitial = 1;
risk = [riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial, riskInitial];
loss = 1;
gain = 0.9;
riskMulityplier = 2;

iterations = 16000;

function upgradeNode() {
    nodeActive = nodeActive == nodeCount ? 1 : nodeActive + 1;
};

function getRandomBool() {
    return Math.random() >= 0.5;
}

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
        console.log("  ");
    }
    
    if (balances[nodeActive - 1] > 0) {
        console.log("%cI: " + i + " Node: " + nodeActive + " Win: " + winThisRound + " Risk: " + risk[nodeActive - 1] + " Bal: " + balances[nodeActive - 1], "color: green;");
    } else {
        console.log("%cI: " + i + " Node: " + nodeActive + " Win: " + winThisRound + " Risk: " + risk[nodeActive - 1] + " Bal: " + balances[nodeActive - 1], "color: red;");
        balances[nodeActive - 1] = 0;
    }
}

console.log(balances);
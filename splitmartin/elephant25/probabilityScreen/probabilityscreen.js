const levels = 40; // Define the maximum martingale levels
const martingaleLostLevels = Array(levels).fill(0); // Track losses per level
let totalTries = 0;
const iterations = 9000000000; // Number of iterations for the simulation
const riskMultiplier = 2;

function getRandomBool() {
    return Math.random() >= 0.5;
}

// Function to log the results in a table
function logMartingaleResults() {
    console.clear();
    console.table({
        "Total Tries": totalTries,
        ...Object.fromEntries(martingaleLostLevels.map((count, level) => [`Level ${level + 1}`, count]))
    });
}

let lastConsoleClear = Date.now();

for (let i = 0; i < iterations; i++) {
    let riskLevel = 0;

    while (riskLevel < levels) {
        const winThisRound = getRandomBool();

        if (winThisRound) {
            // Win: Break out of the loop
            break;
        } else {
            // Loss: Increment risk level
            riskLevel++;
        }
    }

    // If we reached the max level, record it
    if (riskLevel > 0 && riskLevel <= levels) {
        martingaleLostLevels[riskLevel - 1]++;
    }

    // Increment total tries
    totalTries++;

    // Log results every 5 seconds
    if (Date.now() - lastConsoleClear >= 5000) {
        logMartingaleResults();
        lastConsoleClear = Date.now();
    }
}

// Final log after the simulation
logMartingaleResults();
console.log("Simulation completed.");

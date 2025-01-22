import './App.css';
import { useState, useEffect } from "react";

function App() {
  const PontLength = 3; // How many times one node can fail
  const NodeCount = 16; // How many different Scales there are
  const StartingInvestment = 1; // Base investment amount

  const [scales, setScales] = useState([]);
  const [currentNode, setCurrentNode] = useState(1); // Tracks the current node
  const [lastOutcome, setLastOutcome] = useState(null); // Stores the last outcome (win/loss)
  const [balance, setBalance] = useState(0); // Tracks the total balance
  const [unrealizedLoss, setUnrealizedLoss] = useState(0); // Tracks unrealized loss

  // Initialize scales on component mount
  useEffect(() => {
    initializeScales();
  }, []);

  const initializeScales = () => {
    const newScales = Array.from({ length: NodeCount }, (_, index) => ({
      index: index + 1,
      size: PontLength,
      state: 0, // Default state
      unrealizedLoss: 0,
    }));
    setScales(newScales);
    setUnrealizedLoss(0); // Reset unrealized loss
    setBalance(0); // Reset balance
  };

  const calculateUnrealizedLoss = () => {
    return scales.reduce((total, scale) => {
      const scaleLoss = scale.state > 0 ? StartingInvestment * (2 ** scale.state - 1) : 0;
      return total + scaleLoss;
    }, 0);
  };

  const updateNode = (nodeIndex, won) => {
    setScales((prevScales) =>
      prevScales.map((scale) => {
        if (scale.index === nodeIndex) {
          if (won) {
            // On win, reset state and unrealized loss
            const profit = StartingInvestment * (2 ** scale.state);
            setBalance((prevBalance) => prevBalance + profit);
            return { ...scale, state: 0, unrealizedLoss: 0 };
          } else {
            // On loss, calculate loss and increment state
            const lostAmount = StartingInvestment * (2 ** scale.state);
            setBalance((prevBalance) => prevBalance - lostAmount);

            const newState = scale.state + 1;
            const newUnrealizedLoss = StartingInvestment * (2 ** newState - 1);
            return { ...scale, state: newState, unrealizedLoss: newUnrealizedLoss };
          }
        }
        return scale;
      })
    );
  };

  const handleNext = () => {
    const currentScale = currentNode;
    const outcome = Math.random() < 0.5; // 50% chance of win/loss
    setLastOutcome(outcome ? "Win" : "Loss");

    // Update the current node
    updateNode(currentScale, outcome);

    // Dynamically update the unrealized loss
    setUnrealizedLoss(calculateUnrealizedLoss());

    // Move to the next node, wrapping around
    setCurrentNode((prevNode) => (prevNode % NodeCount) + 1);
  };

  const plotScales = (scales) => {
    return scales.map((scale, scaleIndex) => (
      <div key={scaleIndex} className="item">
        <div>
          Node: {scale.index}
        </div>
        {Array.from({ length: scale.size }).map((_, riskLevel) => (
          <div
            key={riskLevel}
            className={`${riskLevel > (scale.state - 1) ? 'free' : 'used'}`}
          >
            {riskLevel > (scale.state - 1) ? `Ok` : "Risk"}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="dash">
            <h2>Dashboard</h2>
            <div>Current Working Node: {currentNode}</div>
            <div>Last Outcome: {lastOutcome}</div>
            <div>Balance: {balance}</div>
            <div>Unrealized Loss: {unrealizedLoss}</div>
            <div>Profit: {balance - unrealizedLoss}</div>
            <button onClick={handleNext}>Next</button>
          </div>
          {plotScales(scales)}
        </div>
      </header>
    </div>
  );
}

export default App;

import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const PontLength = 7; // How many times one node can fail
  const NodeCount = 16; // How many different Scales there are
  const StartingInvestment = 1; // Base investment amount

  const [scales, setScales] = useState([]);
  const [currentNode, setCurrentNode] = useState(1); // Tracks the current node
  const [lastOutcome, setLastOutcome] = useState(null); // Stores the last outcome (win/loss)
  const [balance, setBalance] = useState(100); // Tracks the total balance
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
      profit: 0, // Track profit for this node
    }));
    setScales(newScales);
    setUnrealizedLoss(0); // Reset unrealized loss
    setBalance(100); // Reset balance
  };

  const calculateUnrealizedLoss = () => {
    return scales.reduce((total, scale) => {
      const scaleLoss = scale.state > 0 ? StartingInvestment * (2 ** scale.state - 1) : 0;
      return total + scaleLoss;
    }, 0);
  };

  const calculateDashboardProfit = () => {
    return (
      balance + scales.reduce((total, scale) => total + scale.profit, 0) - 100 // Starting balance
    );
  };
  

  const updateNode = (nodeIndex, won) => {
    let balanceUpdate = 0; // Temporary variable for balance change
  
    const updatedScales = scales.map((scale) => {
      if (scale.index === nodeIndex) {
        let nodeProfit = scale.profit; // Current node profit
  
        switch (scale.state) {
          case 0: // State 0: First trade
            if (won) {
              balanceUpdate += StartingInvestment; // Win: Add 1
              nodeProfit += StartingInvestment; // Update node profit
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit }; // Reset state
            } else {
              balanceUpdate -= StartingInvestment; // Loss: Subtract 1
              nodeProfit -= StartingInvestment; // Update node profit for the loss
              return { ...scale, state: 1, unrealizedLoss: StartingInvestment, profit: nodeProfit }; // Move to state 1
            }
  
          case 1: // State 1: Recover first loss
            if (won) {
              balanceUpdate += StartingInvestment * 2; // Win: Recover + profit
              nodeProfit += StartingInvestment; // Recover previous loss + profit
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit }; // Reset state
            } else {
              balanceUpdate -= StartingInvestment * 2; // Loss: Subtract 2
              nodeProfit -= StartingInvestment * 2; // Update node profit for the loss
              return {
                ...scale,
                state: 2,
                unrealizedLoss: StartingInvestment * 3, // Total unrealized loss: 1+2=3
                profit: nodeProfit,
              }; // Move to state 2
            }
  
          case 2: // State 2: Recover losses from state 1 and state 0
            if (won) {
              balanceUpdate += StartingInvestment * 4; // Win: Recover + profit
              nodeProfit += StartingInvestment; // Recover all losses + profit
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit }; // Reset state
            } else {
              balanceUpdate -= StartingInvestment * 4; // Loss: Subtract 4
              nodeProfit -= StartingInvestment * 4; // Update node profit for the loss
              return {
                ...scale,
                state: 3,
                unrealizedLoss: StartingInvestment * 7, // Total unrealized loss: 1+2+4=7
                profit: nodeProfit,
              }; // Move to state 3
            }
  
          default: // State 3 or higher: Continue doubling
            if (won) {
              const winAmount = StartingInvestment * (2 ** scale.state);
              balanceUpdate += winAmount; // Win: Recover + profit
              nodeProfit += StartingInvestment; // Recover all losses + profit
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit }; // Reset state
            } else {
              const lossAmount = StartingInvestment * (2 ** scale.state);
              balanceUpdate -= lossAmount; // Loss: Subtract loss
              nodeProfit -= lossAmount; // Update node profit for the loss
              return {
                ...scale,
                state: scale.state + 1,
                unrealizedLoss: StartingInvestment * ((2 ** (scale.state + 1)) - 1), // Update unrealized loss
                profit: nodeProfit,
              }; // Move to next state
            }
        }
      }
      return scale; // No change for other nodes
    });
  
    // Apply the changes to the state
    setScales(updatedScales);
    setBalance((prevBalance) => prevBalance + balanceUpdate); // Update balance
  };
    
  const handleNext = () => {
    const currentScale = currentNode;
    const outcome = Math.random() < 0.5; // 50% chance of win/loss
    setLastOutcome(outcome ? 'Win' : 'Loss');
  
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
        <div>Node: {scale.index}</div>
        {Array.from({ length: scale.size }).map((_, riskLevel) => (
          <div
            key={riskLevel}
            className={`${riskLevel > (scale.state - 1) ? 'free' : 'used'}`}
          >
            {riskLevel > (scale.state - 1) ? `Ok` : 'Risk'}
          </div>
        ))}
        <div>Profit: {scale.profit >= 0 ? scale.profit : `-${Math.abs(scale.profit)}`}</div> {/* Display node-specific profit */}
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
            <div>Profit: {calculateDashboardProfit()}</div>
            <button onClick={handleNext}>Next</button>
          </div>
          {plotScales(scales)}
        </div>
      </header>
    </div>
  );
}

export default App;
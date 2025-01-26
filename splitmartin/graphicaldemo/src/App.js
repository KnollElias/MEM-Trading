import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const PontLength = 5; // How many times one node can fail
  const NodeCount = 3; // How many different Scales there are
  const StartingInvestment = 1; // Base investment amount

  const [scales, setScales] = useState([]);
  const [currentNode, setCurrentNode] = useState(1); // Tracks the current node
  const [lastOutcome, setLastOutcome] = useState(null); // Stores the last outcome (win/loss)
  const [balance, setBalance] = useState(189); // Tracks the total balance
  const [unrealizedLoss, setUnrealizedLoss] = useState(0); // Tracks unrealized loss
  const [isWin, setIsWin] = useState(false); // Checkbox for win/loss toggle

  useEffect(() => {
    initializeScales();
  }, []);

  const initializeScales = () => {
    const newScales = Array.from({ length: NodeCount }, (_, index) => ({
      index: index + 1,
      size: PontLength,
      state: 0,
      unrealizedLoss: 0,
      profit: 0,
    }));
    setScales(newScales);
    setUnrealizedLoss(0);
    setBalance(189);
  };

  const calculateUnrealizedLoss = () => {
    return scales.reduce((total, scale) => {
      const scaleLoss = scale.state > 0 ? StartingInvestment * (2 ** scale.state - 1) : 0;
      return total + scaleLoss;
    }, 0);
  };

  const calculateDashboardProfit = () => {
    return (
      balance +
      scales.reduce((total, scale) => total + scale.profit, 0) -
      189
    );
  };

  const updateNode = (nodeIndex, won) => {
    let balanceUpdate = 0;

    const updatedScales = scales.map((scale) => {
      if (scale.index === nodeIndex) {
        let nodeProfit = scale.profit;

        switch (scale.state) {
          case 0:
            if (won) {
              balanceUpdate += StartingInvestment;
              nodeProfit += StartingInvestment;
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit };
            } else {
              balanceUpdate -= StartingInvestment;
              nodeProfit -= StartingInvestment;
              return { ...scale, state: 1, unrealizedLoss: StartingInvestment, profit: nodeProfit };
            }
          case 1:
            if (won) {
              balanceUpdate += StartingInvestment * 2;
              nodeProfit += StartingInvestment;
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit };
            } else {
              balanceUpdate -= StartingInvestment * 2;
              nodeProfit -= StartingInvestment * 2;
              return {
                ...scale,
                state: 2,
                unrealizedLoss: StartingInvestment * 3,
                profit: nodeProfit,
              };
            }
          case 2:
            if (won) {
              balanceUpdate += StartingInvestment * 4;
              nodeProfit += StartingInvestment;
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit };
            } else {
              balanceUpdate -= StartingInvestment * 4;
              nodeProfit -= StartingInvestment * 4;
              return {
                ...scale,
                state: 3,
                unrealizedLoss: StartingInvestment * 7,
                profit: nodeProfit,
              };
            }
          default:
            if (won) {
              const winAmount = StartingInvestment * (2 ** scale.state);
              balanceUpdate += winAmount;
              nodeProfit += StartingInvestment;
              return { ...scale, state: 0, unrealizedLoss: 0, profit: nodeProfit };
            } else {
              const lossAmount = StartingInvestment * (2 ** scale.state);
              balanceUpdate -= lossAmount;
              nodeProfit -= lossAmount;
              return {
                ...scale,
                state: scale.state + 1,
                unrealizedLoss: StartingInvestment * ((2 ** (scale.state + 1)) - 1),
                profit: nodeProfit,
              };
            }
        }
      }
      return scale;
    });

    setScales(updatedScales);
    setBalance((prevBalance) => prevBalance + balanceUpdate);
  };

  const handleNext = () => {
    const currentScale = currentNode;
    setLastOutcome(isWin ? 'Win' : 'Loss');
    updateNode(currentScale, isWin);
    setUnrealizedLoss(calculateUnrealizedLoss());
    setCurrentNode((prevNode) => (prevNode % NodeCount) + 1);
  };

  const plotScales = (scales) => {
    return scales.map((scale, scaleIndex) => (
      <div key={scaleIndex} className="item">
        <div>Node: {scale.index}</div>
        {Array.from({ length: scale.size }).map((_, riskLevel) => (
          <div
            key={riskLevel}
            className={riskLevel > scale.state - 1 ? 'free' : 'used'}
          >
            {riskLevel > scale.state - 1 ? 'Ok' : 'Risk'}
          </div>
        ))}
        <div>Profit: {scale.profit >= 0 ? scale.profit : `-${Math.abs(scale.profit)}`}</div>
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
            <label>
              <input
                type="checkbox"
                checked={isWin}
                onChange={() => setIsWin(!isWin)}
              />
              Win
            </label>
            <button onClick={handleNext}>Next</button>
          </div>
          {plotScales(scales)}
        </div>
      </header>
    </div>
  );
}

export default App;

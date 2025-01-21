import './App.css';
import { useState, useEffect } from "react";

function App() {
  const PontLength = 3; // How many times one node can fail
  const NodeCount = 16; // How many different Scales there are

  const [scales, setScales] = useState([]);

  // Function to initialize scales
  const initializeScales = () => {
    const newScales = Array.from({ length: NodeCount }, (_, index) => ({
      index: index + 1,
      size: PontLength,
      state: 0, // Default state
    }));
    setScales(newScales);
  };

  // Run the initializeScales function once on component mount
  useEffect(() => {
    initializeScales();
  }, []);

  const plotScales = (scales) => {
    return scales.map((scale, scaleIndex) => (
      <div key={scaleIndex} className="item">
        <div>
          Node: {scaleIndex+1}
        </div>
        {Array.from({ length: scale.size }).map((_, riskLevel) => (
          <div
            key={riskLevel}
            className={`${riskLevel > (scale.state-1) ? 'free' : 'used'}`}
          >
            {riskLevel > (scale.state-1) ? `Ok: ${((riskLevel+1)*(riskLevel+2))}`: "Risk"}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className='dash'>Dashboard
            <div>Current Working Node:</div>
            <div>Last Outcome:</div>
            <div>Next Outcome:</div>
            <div>Balance:</div>
            <div>Unrealized Loss:</div>
          </div>
          {plotScales(scales)}
        </div>
      </header>
    </div>
  );
}

export default App;

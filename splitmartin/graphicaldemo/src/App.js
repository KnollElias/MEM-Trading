import logo from './logo.svg';
import './App.css';
import {useState} from "react";

function App() {
  const PontLength = 3; // How many times i can fail
  const NodeCount = 16; // How many different Scales there are

  const [scales, setState] = useState([
    {
      index: 1,
      size: 3,
      state: 0,
    }
  ]);

  const plotScales = (scales) => {
    let output = "";
    for (let scale of scales) {
      for (let riskLevel = 0; riskLevel < scale.size; riskLevel++) {
        console.warn("risk level_: " + riskLevel)
        if (riskLevel > scale.state) {
          output += `<div>green</div>`;
        }
      }
      output += `<div>yellow</div>`;
    }
    return output;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='container'>
          {plotScales(scales)}
        </div>
      </header>
    </div>
  );
}

export default App;

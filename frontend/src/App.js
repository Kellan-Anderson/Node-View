import { useState } from 'react';
import Graph from './components/Graph';
import './App.css';

function App() {
    const d = require("./data/model.json");

    const [timestep, setTimestep] = useState(1);
    const [data, setData] = useState(d.timestep1);

    const handleChange = (value) => {
      setTimestep(value);
      setData(d['timestep' + value]);
    }


  return (
    <>
      <Graph data={data} />
      <input
        type="range"
        min="1"
        max="49"
        onChange={(e) => handleChange(e.target.value)}
        value={timestep} />
      <p>Timestep: {timestep}</p>
    </>
  );
}

export default App;

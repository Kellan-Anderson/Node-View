import { useState } from 'react';
import Graph from './components/Graph';
import './App.css';

function App() {
    const d = require("./data/model.json");

    const [timestep, setTimestep] = useState(1);
    const [data, setData] = useState(d.timestep1);

    const increase = () => {
      if(timestep + 1 != 50) {
        var newStep = timestep + 1;
        setTimestep(newStep);
        setData(d['timestep' + newStep]);
      }
    }

    const decrease = () => {
      if(timestep -1 != 0) {
        var newStep = timestep - 1;
        setTimestep(newStep);
        setData(d['timestep' + newStep]);
      }
    }


  return (
    <>
      <Graph data={data} />
      <button className='inline' onClick={decrease}>Decrease timestep</button>
      <p>Timestep: {timestep}</p>
      <button className='inline' onClick={increase}>Increase timestep</button>
    </>
  );
}

export default App;

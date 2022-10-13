import { useState } from 'react';
import Graph from './components/Graph';
import './App.css';

function App() {
    const d = require("./data/model.json");
    //console.log(data);

    const [timestep, setTimestep] = useState(1)
    const [data, setData] = useState(d.timestep1)

    const increase = () => {
      if(timestep + 1 != 50) {
        setTimestep(timestep + 1)
        //setData(d['timestep' + timestep.toString()])
      }
    }

    const decrease = () => {
      if(timestep -1 != 0) {
        setTimestep()
        //setData(d['timestep' + timestep.toString()])
      }
    }


  return (
    <>
      <Graph data={data} />
      <button className='inline' onClick={increase()}>Decrease timestep</button>
      <p>Timestep: {timestep}</p>
      <button className='inline' onClick={decrease()}>Increase timestep</button>
    </>
  );
}

export default App;

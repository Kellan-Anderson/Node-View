import { useEffect, useState } from 'react';
import Graph from './components/Graph';
import { useReadCypher } from 'use-neo4j';
import './App.css';

function App() {
  const [timestep, setTimestep] = useState(1);
  
  const getQuery = (v) => {
    const value = 'ts' + v;
    return `match (n:${value}), (a:${value})-[]->(b:${value}) with collect(distinct {id: n.id, group: n.group}) as nodes, collect(distinct {source: a.id, target: b.id}) as links return {nodes: nodes, links: links}`
  };

  let query = getQuery(timestep);
  console.log(query); 
  const {records, run} = useReadCypher(query);

  useEffect(() => {
    query = getQuery(timestep);
    run({query});
  }, [timestep]);

  let result = (<div>Data not loaded</div>);
  
  let data = {};
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    data = records[0].get("{nodes: nodes, links: links}");
    console.log("data has been assigned:", data);
    result = (<Graph data={data}/>);
  }
  
  const handleChange = (value) => {
    setTimestep(value);
    console.log("New value: " + value);
  }

  return (
    <>
    {result}
      <input
        type="range"
        min="1"
        max="3"
        onChange={(e) => handleChange(e.target.value)}
        value={timestep} />
      <p>Timestep: {timestep}</p>
    </>
  );
}

export default App;
import { useEffect, useState } from 'react';
import Graph from './components/Graph';
import { useReadCypher } from 'use-neo4j';
import './App.css';
import filterData from './helper/filterData';

function App() {
  const [timestep, setTimestep] = useState(1);

  //TODO fix so there is no work-around
  // Anywhere either of these varables are used it should be changed to the timestep variables
  const [pointer, setPointer] = useState(0);
  const valid_timestamps = [1,2,6];

  const key = "{source: {id: n.name, group: n.group}, target: {id: m.name, group: m.group}}";
  const limit = 50;
  
  const getQuery = (v) => {
    // Old query
    //const value = 'ts' + v;
    //return `match (n:${value}), (a:${value})-[]->(b:${value}) with collect(distinct {id: n.id, group: n.group}) as nodes, collect(distinct {source: a.id, target: b.id}) as links return {nodes: nodes, links: links}`
  
    return `match (n:Source {timestamp: ${v}})--(m:Target {timestamp: ${v}}) return n,m,{source: {id: n.name, group: n.group}, target: {id: m.name, group: m.group}} limit ${limit}`;
  };

  // Work-around fix
  // let query = getQuery(timestep);

  let query = getQuery(valid_timestamps[pointer]);
  console.log(query); 
  const {records, run} = useReadCypher(query);

  useEffect(() => {
    query = getQuery(valid_timestamps[pointer]);
    run({query});
  }, [pointer]);

  let result = (<div>Data not loaded</div>);
  
  let data = {};
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    // Old
    //data = records[0].get("{nodes: nodes, links: links}");

    var data_list = [];
    records.forEach(e => {
      data_list.push(e.get(key));
    });
    // Used for debugging
    /*
    console.log("Records post assignment", records);
    console.log("Data pre-filter", data);
    console.log("DAta list:", data_list);
    */
    data = filterData(data_list);
    console.log("data has been assigned:", data);
    result = (<Graph data={data}/>);
  }
  
  const handleChange = (value) => {
    setPointer(value);
    console.log("New value: " + value);
  }

  return (
    <>
    {result}
      <input
        type="range"
        min="0"
        max="2"
        onChange={(e) => handleChange(e.target.value)}
        value={pointer} />
      <p>Timestep: {valid_timestamps[pointer]}</p>
    </>
  );
}

export default App;
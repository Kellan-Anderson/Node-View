import { useEffect, useState } from 'react';
import Graph from './components/Graph';
import { useReadCypher } from 'use-neo4j';
import './App.css';
import filterData from './helper/filterData';

/**
 * App.js, logic entry point for our data. This function controls the ways things are rendered to the user
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @returns JSX containing the view of our app
 */

function App() {
  const [timestep, setTimestep] = useState(1);

  //TODO fix so there is no work-around
  // Anywhere either of these varables are used it should be changed to the timestep variables
  const [pointer, setPointer] = useState(0);
  const valid_timestamps = [1,2,3,4,5,6,7,8,9,10];

  // Constants used for atlking to the database
  const key = "{source: {id: n.source, group: n.group}, target: {id: m.target, group: m.group}}";
  const limit = 20;
  
  const getQuery = (v) => {
    // Old query
    //return `match (n:${value}), (a:${value})-[]->(b:${value}) with collect(distinct {id: n.id, group: n.group}) as nodes, collect(distinct {source: a.id, target: b.id}) as links return {nodes: nodes, links: links}`
  
    // Query to communicate with the database, changes based on value passed to function
    return `match (n:Source {timestamp: ${v}})-[]->(m:Target {timestamp: ${v}}) return n,m,{source: {id: n.source, group: n.group}, target: {id: m.target, group: m.group}} limit ${limit}`;
  };

  // Get the query
  let query = getQuery(valid_timestamps[pointer]);
  
  // Testing
  //console.log(query); 
  
  // Get the functions and variables we need from the use-neo4j package
  const {records, run} = useReadCypher(query);

  // Requery the database whenever the state changes
  useEffect(() => {
    query = getQuery(valid_timestamps[pointer]);
    run({query});
  }, [pointer]);

  // Default result of the database
  let result = (<div>Data not loaded</div>);
  
  // Init our data
  let data = {};

  // Check to see if the data has been assigned by the database yet
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    // Loop over the recods received from the database and add them to a list
    var data_list = [];
    records.forEach(e => {
      data_list.push(e.get(key));
    });

    // Filter the data to get a format D3 can use
    data = filterData(data_list);

    // Pass the data to our graph component
    result = (<Graph data={data}/>);
  }
  
  // Runs whenever the slider is moved
  const handleChange = (value) => {
    setPointer(value);
  }

  return (
    <>
    {result}
      <input
        type="range"
        min="0"
        max="9"
        onChange={(e) => handleChange(e.target.value)}
        value={pointer} />
      <p>Timestep: {valid_timestamps[pointer]}</p>
    </>
  );
}

export default App;
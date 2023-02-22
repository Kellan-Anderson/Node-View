import { useEffect, useState } from 'react';
import Graph from './components/Graph';
import Donut from './components/Donut';
import Pie from './components/Pie';
import Pie2 from './components/Pie2';
import { useReadCypher } from 'use-neo4j';

/**
 * App.js, logic entry point for our data. This function controls the ways things are rendered to the user
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @returns JSX containing the view of our app
 */

function App() {
  const [timestep, setTimestep] = useState(1);

  // Constants used for atlking to the database
  const key = "{nodes: nodes, links: links}";
  
  const getQuery = (v) => {
    const query = `match (n:Transaction {timestep: "${v}"}), ` +
                  `(a:Transaction {timestep: "${v}"})-[]->(b:Transaction {timestep: "${v}"}) ` +
                  "WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, " + 
                  "COLLECT(DISTINCT {source: a.id, target: b.id}) as links RETURN {nodes: nodes, links: links}";
    console.log(query);
    
    return query;
    /*
    MATCH (n:Transaction {timestep: "1"}), (a:Transaction {timestep: "1"})-[]->(b:Transaction {timestep: "1"})
    WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, COLLECT(DISTINCT {source: a.id, target: b.id}) as links
    RETURN {nodes: nodes, links: links}
    */
  };

  // Get the query
  let query = getQuery(timestep);
  
  // Get the functions and variables we need from the use-neo4j package
  const {records, run} = useReadCypher(query);

  // Requery the database whenever the state changes
  useEffect(() => {
    query = getQuery(timestep);
    run({query});
  }, [timestep]);

  // Default result of the database
  let result = (<div>Data not loaded</div>);
  
  // Init our data
  let data = {};

  // Check to see if the data has been assigned by the database yet
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    /* Old code
    // Loop over the recods received from the database and add them to a list
    var data_list = [];
    records.forEach(e => {
      data_list.push(e.get(key));
    });

    // Filter the data to get a format D3 can use
    data = filterData(data_list);
    */

    /* New code */
    data = records[0].get(key);

    // Pass the data to our graph component
    result = (
      <>
        <Graph data={data}/>
        <Pie data={data.nodes} />
        <Pie2 data={data.nodes} />
        <Donut data={data.nodes} />
      </>
    );
  }
  
  // Runs whenever the slider is moved
  const handleChange = (value) => {
    setTimestep(value);
  }

  return (
    <>
    {result}
    <input
      type="range"
      min="1"
      max="49"
      onChange={(e) => handleChange(e.target.value)}
      value={timestep} />
    <button onClick={(e) => {setTimestep(timestep + 1)}}>Increace TS</button>
    <button onClick={(e) => {setTimestep(timestep - 1)}}>Decrease TS</button>
    <p>Timestep: {timestep}</p>
    </>
  );
}

export default App;
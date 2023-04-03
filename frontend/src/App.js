import { useEffect, useState, useContext } from 'react';
import Graph from './components/Graph';
import Pie from './components/Pie';
import BarSelector from './containers/BarSelector';
import { useReadCypher } from 'use-neo4j';
import Search from './components/Search';
import ObserverContext from './context/ObserverContext';
import { Select, MenuItem, InputLabel } from '@mui/material';
import Bar from './components/barchart';
import BarWrapper from './containers/BarWrapper';

/**
 * App.js, logic entry point for our data. This function controls the ways things are rendered to the user
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @returns JSX containing the view of our app
 */

function App() {
  // Debugging
  //console.clear();

  const [timestep, setTimestep] = useState(1);
  const [clickedNode, setClickedNode] = useState(0);
  const [graph, setGraph] = useState('Pie');
  const handleGraph = (event) => {
	  setGraph(event.target.value);
  }

  const { registerSubscriber, alertSubscriber } = useContext(ObserverContext);

  registerSubscriber((alertObject) => {
    alertObject.timestep && setTimestep(alertObject.timestep);
    setClickedNode(alertObject.id);
  })

  // Constants used for talking to the database
  const key = "{nodes: nodes, links: links}";
  
  const getQuery = (v) => {
    const query = `match (n:Transaction {timestep: "${v}"}), ` +
                  `(a:Transaction {timestep: "${v}"})-[]->(b:Transaction {timestep: "${v}"}) ` +
                  "WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, " + 
                  "COLLECT(DISTINCT {source: a.id, target: b.id}) as links RETURN {nodes: nodes, links: links}";
    //console.log(query);
    
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
  
  const handleCircleClick = (id) => {
    setClickedNode(id);
    alertSubscriber({
      id: parseInt(id),
      timestep: undefined,
      source: "graph"
    })
  }

  // Check to see if the data has been assigned by the database yet
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    /* New code */
    data = records[0].get(key);

    // Pass the data to our graph component
    result = (
      <div className='grid grid-cols-3 w-full h-full'>
        <div className='col-span-2'>
          <Graph data={data} highlight={clickedNode} nodeClick={handleCircleClick}/>
        </div>
        <div className='flex flex-col mr-2 pl-2 border-l-2 border-dashed border-l-black'>
          <div className='grow py-2'>
            {graph === 'Bar' && <BarWrapper timestep={timestep} />}
            {graph === 'Pie' && <Pie data={data.nodes} />}
            {/* graph === "Force-directed" &&  */}
          </div>
          <Select labelId="graph_type_label"
    	  	  id="graph_type"
    	          value={graph}
    	  	  onChange={handleGraph}
          >
    	      <MenuItem value={"Bar"}>Bar Graph</MenuItem>
    	      <MenuItem value={"Pie"}>Pie Chart</MenuItem>
    	      {/*<MenuItem value={"Force-directed"}>Force-directed Graph</MenuItem>*/}
  	      </Select>
        </div>
      </div>
    );
  }
  
  // Runs whenever the slider is moved
  const handleChange = (value) => {
    setTimestep(parseInt(value));
  }

  const handleBarClick = (v) => {
    setTimestep(parseInt(v));
  }

  return (
    <>
      <div className='grid grid-rows-5 h-screen'>
        <div className='row-span-4'>
          {result}
        </div>

        

        <div className='flex flex-col items-center'>
          <div className='flex flex-row h-fit w-full mt-2 pt-2 border-t-2 border-black'>
            <button
              onClick={(e) => {timestep > 1 && setTimestep(parseInt(timestep) - 1)}}
              className='btn-primary'
            >
              Decrease
            </button>
            <input
              type="range"
              min="1"
              max="49"
              onChange={(e) => handleChange(e.target.value)}
              value={timestep} 
              className='flex-1'/>
            <button 
              onClick={(e) => {
                timestep < 49 && setTimestep(parseInt(timestep) + 1)
              }}
              className="btn-primary"
            >
              Increase
            </button>
          </div>
          <p>Timestep: {timestep}</p>
        </div>
        <Search />
      </div>
      <BarSelector highlighted={timestep} clickFunction={handleBarClick} />
    </>
  );
}

export default App;
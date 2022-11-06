import { useEffect, useState } from 'react';
import Graph from './components/Graph';
import Loader from './components/Loader/Loader'
import { useReadCypher } from 'use-neo4j';
import './App.css';

function App() {
  //const d = require("./data/model.json");

  const [timestep, setTimestep] = useState(1);
  const [ query, setQuery ] = useState('ts1');
  //const [data, setData] = useState(d.timestep1);

  const { loading, records, run, error } = useReadCypher(
    `match (n:${query}), (a:${query})-[]->(b:${query}) with collect(distinct {id: n.id, group: n.group}) as nodes, collect(distinct {source: a.id, target: b.id}) as links return {nodes: nodes, links: links}`,
  );

  let result = (<div>Loading...</div>);

  let data = {};

  useEffect(() => {
    run({ query });
  }, [query]);

  if(error) {
    console.log("Error:");
    console.log(error.message);
    result=(<><div>Error: {error.message}</div><div>query: {query}</div></>)
  } else if(!loading) {
    //let data = records[0];//'{nodes: nodes, links: links}');
    console.log("data from app component:");
    data = records[0].get('{nodes: nodes, links: links}');
    console.log( data);
    //console.log(data);
    result = (
      <div>
        <div>Data loaded successfully</div>
        
      </div>
    )
  }

  const handleChange = (value) => {
    setTimestep(value);
    //setData(d['timestep' + value]);
    setQuery('ts' + value);
    console.log("New value: " + value);

  }

//<Graph data={data} />

  return (
    <>
      {result}
      <Graph data={data} />
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





  // query:
  // match p = (a)-[]->(b) with collect({source: a.letter, target: b.letter}) as link_list return {Links: link_list}
  // match p = (a)-[]->(b) with collect(DISTINCT {id: a.letter, group: a.group}) as nodes, collect({source: a.letter, target: b.letter}) as link_list return {Nodes: nodes, Links: link_list}
  // match (n), (a)-[]->(b) with collect(distinct {id: n.letter, group: n.group}) as list, collect(distinct {source: a.letter, target: b.letter}) as l return {nodes: list, links: l}
  // match (n:transaction2), (a:transaction2)-[]->(b:transaction2) with collect(distinct {id: n.letter, group: n.group}) as list, collect(distinct {source: a.letter, target: b.letter}) as l return {nodes: list, links: l}

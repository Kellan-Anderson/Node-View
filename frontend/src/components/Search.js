import React, { useEffect, useState, useContext } from 'react';
import { useReadCypher } from "use-neo4j"
import ObserverContext from '../context/ObserverContext';

export default function Search() {
  const [nodeId, setNodeId] = useState(0);
  const [node, setNode] = useState(undefined);
  const [nodeLoading, setNodeLoading] = useState(true);
  const [queryError, setQueryError] = useState(false);
  const [dbRecords, setDbRecords] = useState(undefined);

  const { registerSubscriber, alertSubscriber } = useContext(ObserverContext);

  
  const key = "{id: n.id, timestep: n.timestep, group: n.group, edges: edges}";
  //{id: n.id, group: n.group, timestep: n.timestep, edges:[]}
  
  const {run, records, loading, error} = useReadCypher(
    `MATCH (n {id: "${nodeId}"}), (n)-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`
  );

  console.log("loading with records: ");
    
  registerSubscriber((alertObject) => {
    if(alertObject.source !== "search") {
      console.log(`WERE SETTING NODE`, alertObject.id)
      const id = alertObject.id;
      setNodeId(id);
    }
  });

  // Set the loading icon
  useEffect(() => {
    setNodeLoading(loading);
  }, [loading]);

  // Set the error status
  useEffect(() => {
    setQueryError(error);
  }, [error]);

  
  // Run the query
  // Breaking here?
  useEffect(() => {
    const query = `MATCH (n {id: "${nodeId}"}), (n)-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`;
    run({query});

  }, [nodeId]);
  
  // Set the records/node data
  useEffect(() => {
    if(records !== undefined) {      
      let newNode = records.length !== 0 ? records[0].get(key) : undefined;

      alertSubscriber({
        id: newNode ? newNode.id : undefined,
        timestep: newNode ? newNode.timestep : undefined,
        source: "search"
      });
      setNode(newNode);
    }
  }, [records]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    setNodeId(formJson.id);
  }

  const NodeMeta = ({nodeData}) => {
    return (
      <>
        {nodeData !== undefined ? 
          (<ul>
            <li>Node id:{nodeData.id}</li>
            <li>Timestep: {nodeData.timestep}</li>
            <li>Group: {nodeData.group}</li>
            <li>Edges: {nodeData.edges.map((edge) => <p key={edge}>{edge}</p>)}</li>
          </ul>
          ) : <></>
        }
      </>
    );
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input name="id" type="text" className='border border-black'/>
          <button type='submit'>Search</button>
        </form>
      </div>
      {node ? <NodeMeta nodeData={node} /> : <svg className='animate-spin h-5 w-5'></svg> }
    </>
  );
}

// match (n {id: "230460314"}), (n)-[]->(b) with n as n, collect(b.id) as edges return {id: n.id, timestep: n.timestep, group: n.group, edges: edges}
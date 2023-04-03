import React, { useEffect, useState, useContext } from 'react';
import { useReadCypher } from "use-neo4j"
import ObserverContext from '../context/ObserverContext';
import Dropdown from './dropdown';

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
    
  registerSubscriber((alertObject) => {
    if(alertObject.source !== "search") {
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
          (<ul className='grid grid-cols-4 items-center bg-slate-400 py-2 rounded-md'>
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Node id:
              </h2>
              {nodeData.id}
            </li>
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Timestep:
              </h2>
               {nodeData.timestep}
            </li>
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Group:
              </h2>
              {nodeData.group}
            </li>
            <li className='px-3 flex flex-row justify-center'>
               <Dropdown title={'Edges'} elements={nodeData.edges} />
            </li>
          </ul>
          ) : <></>
        }
      </>
    );
  }

  return (
    <>
      <div className='grid grid-rows-2'>
        <form onSubmit={handleSubmit} className='flex justify-center mb-2'>
          <input name="id" type="text" className='border-2 border-slate-600 rounded-md pl-1 h-fit'/>
          <button type='submit' className='btn-primary ml-1'>Search</button>
        </form>
        {node ? <NodeMeta nodeData={node} /> : <svg className='animate-spin h-5 w-5'></svg> }
      </div>
    </>
  );
}

// match (n {id: "230460314"}), (n)-[]->(b) with n as n, collect(b.id) as edges return {id: n.id, timestep: n.timestep, group: n.group, edges: edges}
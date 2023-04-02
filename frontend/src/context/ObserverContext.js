import React, { createContext, useRef } from "react";

const ObserverContext = createContext();
export default ObserverContext;

export function ObserverProvider({children}) {  
  
  const observerCallbacks = useRef([]);

  const registerSubscriber = (callback) => {
    observerCallbacks.current = [...observerCallbacks.current, callback];
  }

  const alertSubscriber = (alertObject) => {
    observerCallbacks.current.forEach((callback) => {
      callback(alertObject);
    });
  }

  const contextFunctions = {
    registerSubscriber,
    alertSubscriber,
  }

  return (
    <ObserverContext.Provider value={contextFunctions} >
      {children}
    </ObserverContext.Provider>
  );
}

/*
Context uses a useRef hook to store an array of callbacks that is consistent between re-renders.

Graph:
  Register:
    The graph register callback should traverse to a new timestep, clear any highlighted nodes and highlight a new node.
    Register can expect to take a node object with the nodes id and timestep.
  Alert:
    Alert should be called when a user clicks on a node on the graph. The alert function should be passed a nodes id

Search:
  Register:
    The search component should take a single number representing an ID and call a search function. After the search 
    function returns we should display the data and call the alert function. ISSUE: calling the alert function inside of
    the registered callback means that the callback will become recursive. FIX: Pass an optional value that declares
    where the value comes from (i.e. {source:"search"}) and check for that in the registered callback; 
  Alert:
    Pass the found nodes timestep and node id

The register function should take an object as an argument in the following type:
{
  id: number,
  timestep: number,
  source?: string
}


IDEA:
  Separate node searching into its own hook that returns a full node object. This way any component should be able to 
  look for a node with having to pass a found node around several components. Another option is to use the context to 
  hold the selected node and any components should be able to see the node using the context api
*/
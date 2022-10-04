import React from 'react';
import Graph from './components/Graph';
import './App.css';

function App() {
  var nodes = [
      { name: "node1" },
      { name: "node2" },
      { name: "node3" },
      { name: "node4" },
      { name: "node5" },
      { name: "node6" },
      { name: "node7" },
      { name: "node8" }
  ];

  var links = [
      { source: "node1", target: "node2" },
      { source: "node3", target: "node2" },
      { source: "node4", target: "node3" },
      { source: "node5", target: "node4" },
      { source: "node1", target: "node3" },
      { source: "node3", target: "node5" },
      { source: "node6", target: "node5" },
      { source: "node7", target: "node6" },
      { source: "node8", target: "node7" },
      { source: "node5", target: "node8" }
    ];

    const data = require("./test.json");
    console.log(data);

  return (
    <Graph data={data} />
  );
}

export default App;

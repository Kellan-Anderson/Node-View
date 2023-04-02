import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Neo4jProvider, createDriver } from 'use-neo4j';
import { ObserverProvider } from './context/ObserverContext';

const address = 'localhost';
const port = 7687;
const databaseName = 'neo4j';
const password = 'password';

const driver = createDriver('neo4j', address, port, databaseName, password);

const root = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <Neo4jProvider driver={driver}>
      <ObserverProvider>
        <App/>
      </ObserverProvider>
    </Neo4jProvider>
  </React.StrictMode>,
   root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

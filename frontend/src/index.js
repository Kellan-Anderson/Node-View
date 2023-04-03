import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Neo4jProvider, createDriver } from 'use-neo4j';
import { ObserverProvider } from './context/ObserverContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './Landing';

const address = 'localhost';
const port = 7687;
const databaseName = 'neo4j';
const password = 'password';

const driver = createDriver('neo4j', address, port, databaseName, password);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Neo4jProvider driver={driver}>
      <ObserverProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="/app" element={<App />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ObserverProvider>
    </Neo4jProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './routes/Router.js';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

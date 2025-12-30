import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initDemoData } from './services/storage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Initialize demo data immediately before rendering to prevent race conditions
initDemoData();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
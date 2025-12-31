
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('play-arcade-hq-app');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Play Arcade HQ: Could not find mount point #play-arcade-hq-app");
}

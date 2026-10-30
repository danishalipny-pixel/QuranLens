import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerServiceWorker } from './registerServiceWorker';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Progressive Web App Service Worker
registerServiceWorker((registration) => {
  window.dispatchEvent(new CustomEvent('quranlens-sw-update', { detail: registration }));
});

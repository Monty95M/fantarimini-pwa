import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // importa

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Registra il service worker per abilitare PWA
serviceWorkerRegistration.register();

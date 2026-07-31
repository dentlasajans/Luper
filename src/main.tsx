window.onerror = (message, source, lineno, colno, error) => {
  document.body.innerHTML = `
    <div style="background: #111; color: #ff5f56; padding: 20px; font-family: monospace; z-index: 99999; position: fixed; inset: 0; overflow: auto;">
      <h1>LUPER FATAL RENDERER ERROR</h1>
      <p><b>Message:</b> ${message}</p>
      <p><b>Source:</b> ${source}:${lineno}:${colno}</p>
      <pre style="margin-top:20px; white-space: pre-wrap;">${error?.stack}</pre>
    </div>
  `;
};

window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `
    <div style="background: #111; color: #ff5f56; padding: 20px; font-family: monospace; z-index: 99999; position: fixed; inset: 0; overflow: auto;">
      <h1>LUPER UNHANDLED PROMISE REJECTION</h1>
      <p><b>Reason:</b> ${event.reason}</p>
      <pre style="margin-top:20px; white-space: pre-wrap;">${event.reason?.stack}</pre>
    </div>
  `;
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

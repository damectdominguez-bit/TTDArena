import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Register service worker (handled automatically by vite-plugin-pwa)
// This file just bootstraps React

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Ensure basename matches the URL exactly */}
    <BrowserRouter basename="/vce-physics-sims/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
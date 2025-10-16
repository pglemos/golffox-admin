import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="min-h-screen p-6">Golffox Carrier</div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


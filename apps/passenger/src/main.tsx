import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { supabaseClient } from '../../../packages/shared/supabaseClient'

function App() {
  const [positions, setPositions] = useState<any[]>([])
  useEffect(() => {
    const channel = supabaseClient
      .channel('driver_positions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_positions' }, (payload) => {
        setPositions((prev) => [payload.new, ...prev].slice(0, 10))
      })
      .subscribe()
    return () => { supabaseClient.removeChannel(channel) }
  }, [])
  return (
    <div className="min-h-screen p-6">
      <div className="rounded-xl bg-white/60 dark:bg-white/5 p-4">
        <div>Passenger Tracker</div>
        <div className="opacity-70 text-sm mt-2">Últimas posições:</div>
        <ul className="text-xs opacity-70">
          {positions.map((p, i) => (
            <li key={i}>{p?.lat?.toFixed?.(5)}, {p?.lng?.toFixed?.(5)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


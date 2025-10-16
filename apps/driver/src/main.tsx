import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { supabaseClient } from '../../../packages/shared/supabaseClient'

function App() {
  const [coord, setCoord] = useState<{ lat: number, lng: number } | null>(null)
  useEffect(() => {
    const watch = navigator.geolocation?.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      setCoord({ lat, lng })
      supabaseClient.from('driver_positions').insert({ lat, lng })
    })
    return () => { if (watch) navigator.geolocation?.clearWatch(watch) }
  }, [])
  return (
    <div className="min-h-screen p-6">
      <div className="rounded-xl bg-white/60 dark:bg-white/5 p-4">
        <div>Driver App</div>
        <div className="opacity-70">Coord: {coord ? `${coord.lat.toFixed(5)}, ${coord.lng.toFixed(5)}` : 'aguardando...'}</div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


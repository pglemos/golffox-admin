import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { supabaseClient } from './lib/supabaseClient'

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
    <div className="min-h-screen bg-white/5 text-white dark:bg-[#0B0B0F] dark:text-gray-100">
      <header className="sticky top-0 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-white/12/40 dark:border-white/10 p-4">
        <h1 className="text-xl font-semibold max-w-6xl mx-auto">Golffox — App do Motorista</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="text-sm opacity-70">Sua localização</div>
          <div className="text-lg font-medium mt-1">{coord ? `${coord.lat.toFixed(5)}, ${coord.lng.toFixed(5)}` : 'Aguardando GPS...'}</div>
        </div>
        <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="font-medium mb-2">Próxima viagem</div>
          <div className="text-sm opacity-70">Quando disponível, será exibida aqui.</div>
        </div>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

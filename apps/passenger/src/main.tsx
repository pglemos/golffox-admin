import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { supabaseClient } from './lib/supabaseClient'

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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0B0B0F] dark:text-gray-100">
      <header className="sticky top-0 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-gray-200/40 dark:border-white/10 p-4">
        <h1 className="text-xl font-semibold max-w-6xl mx-auto">Golffox — App do Passageiro</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="font-medium">Rastreamento em tempo real</div>
          <div className="opacity-70 text-sm mt-2">Últimas posições recebidas:</div>
          <ul className="text-xs opacity-70 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {positions.length === 0 && <li className="opacity-60">Aguardando dados...</li>}
            {positions.map((p, i) => (
              <li key={i} className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10">
                {p?.lat?.toFixed?.(5)}, {p?.lng?.toFixed?.(5)}
              </li>
            ))}
          </ul>
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

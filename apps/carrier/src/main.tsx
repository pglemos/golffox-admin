import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-white/5 text-white dark:bg-[#0B0B0F] dark:text-gray-100">
      <header className="sticky top-0 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-white/12/40 dark:border-white/10 p-4">
        <h1 className="text-xl font-semibold max-w-6xl mx-auto">Golffox — Painel da Transportadora</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
            <div className="text-xs uppercase opacity-60">Frota</div>
            <div className="text-2xl font-semibold">18 veículos</div>
          </div>
          <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
            <div className="text-xs uppercase opacity-60">Disponibilidade</div>
            <div className="text-2xl font-semibold">83%</div>
          </div>
          <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
            <div className="text-xs uppercase opacity-60">Checklists</div>
            <div className="text-2xl font-semibold">OK</div>
          </div>
        </div>
        <section className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="font-medium mb-3">Próximas manutenções</div>
          <div className="text-sm opacity-70">Em breve: calendário e integração com checklists.</div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

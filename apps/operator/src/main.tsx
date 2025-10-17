import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
      <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0B0B0F] dark:text-gray-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-gray-200/40 dark:border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Golffox — Painel do Operador</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Veículos ativos" value="12" />
          <Stat label="Rotas em andamento" value="5" />
          <Stat label="Ocupação média" value="78%" />
          <Stat label="Atrasos" value="2" />
        </section>
        <section className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="font-medium mb-3">Próximas partidas</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left opacity-60 border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="py-2 pr-4">Rota</th>
                  <th className="py-2 pr-4">Veículo</th>
                  <th className="py-2 pr-4">Motorista</th>
                  <th className="py-2 pr-4">Partida</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Rota A - Centro', 'ABC-1234', 'João', '14:30', 'no horário'],
                  ['Rota B - Industrial', 'XYZ-5678', 'Carlos', '14:45', 'no horário'],
                  ['Rota A - Centro', 'ABC-1234', 'João', '15:00', 'atrasado'],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-black/5 dark:border-white/5">
                    <td className="py-2 pr-4">{r[0]}</td>
                    <td className="py-2 pr-4">{r[1]}</td>
                    <td className="py-2 pr-4">{r[2]}</td>
                    <td className="py-2 pr-4">{r[3]}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                        {r[4]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

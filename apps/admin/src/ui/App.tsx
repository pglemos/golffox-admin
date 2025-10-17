import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../packages/shared/supabaseClient'
import { aiSuggest } from '../../../packages/shared/ai/aiClient'

export default function App() {
  const [status, setStatus] = useState('Carregando...')
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await aiSuggest({ type: 'report' })
        if (mounted) setStatus(res.summary)
      } catch {
        if (mounted) setStatus('OK')
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const channel = supabaseClient
      .channel('trips-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
        console.log('Realtime trips change', payload)
      })
      .subscribe()
    return () => { supabaseClient.removeChannel(channel) }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0B0B0F] dark:text-gray-100">
      <header className="sticky top-0 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-gray-200/40 dark:border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Golffox — Painel Administrativo</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Usuários', 'Transportadoras', 'Motoristas', 'Passageiros'].map((k, i) => (
            <div key={i} className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
              <div className="text-xs uppercase tracking-wide opacity-60">{k}</div>
              <div className="text-2xl font-semibold mt-1">—</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-6 bg-white/60 dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
          <div className="font-medium">Relatórios inteligentes (IA)</div>
          <p className="opacity-80 mt-1">{status}</p>
        </div>
      </main>
    </div>
  )
}

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
        <h1 className="text-xl font-semibold">Golffox Admin</h1>
      </header>
      <main className="p-6">
        <div className="rounded-2xl p-6 bg-white/60 dark:bg-white/5 shadow">
          <p className="opacity-80">Status IA: {status}</p>
        </div>
      </main>
    </div>
  )
}


type SuggestionInput = {
  type: 'route' | 'efficiency' | 'report'
  params?: Record<string, unknown>
}

type SuggestionResult = {
  ok: boolean
  summary: string
  details?: unknown
}

export async function aiSuggest(input: SuggestionInput): Promise<SuggestionResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).process?.env?.VITE_GEMINI_API_KEY
  if (!apiKey) {
    switch (input.type) {
      case 'route':
        return { ok: true, summary: 'Rota otimizada simulada: menor tráfego e menor custo.' }
      case 'efficiency':
        return { ok: true, summary: 'Eficiência simulada: +12% combinando rotas A+B.' }
      case 'report':
        return { ok: true, summary: 'Relatório simulado: ocupação semanal +8%.' }
    }
  }
  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
    if (!res.ok) throw new Error('AI API error')
    return await res.json()
  } catch (e) {
    return { ok: false, summary: 'Falha ao consultar IA', details: String(e) }
  }
}


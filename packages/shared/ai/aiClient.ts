type SuggestionInput = {
  type: 'route' | 'efficiency' | 'report'
  params?: Record<string, unknown>
}

type SuggestionResult = {
  ok: boolean
  summary: string
  details?: unknown
}

// Simple Gemini wrapper with fallback
export async function aiSuggest(input: SuggestionInput): Promise<SuggestionResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    // Fallback simulated responses
    switch (input.type) {
      case 'route':
        return { ok: true, summary: 'Rota otimizada simulada: menor tráfego previsto e menor custo.' }
      case 'efficiency':
        return { ok: true, summary: 'Eficiência simulada: 12% de melhoria combinando rotas A+B e horários escalonados.' }
      case 'report':
        return { ok: true, summary: 'Relatório inteligente simulado: tendência positiva de ocupação ( +8% semana).' }
    }
  }

  // If a real key exists, call Gemini via @google/genai (browser-safe usage should be proxied via API)
  try {
    // Defer to API route for secure usage; client should only call our backend
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


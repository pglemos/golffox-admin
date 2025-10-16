import { GoogleGenerativeAI } from "@google/genai";

const geminiKey =
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const hasGeminiKey = Boolean(geminiKey);

let client: GoogleGenerativeAI | null = null;

function getClient() {
  if (!hasGeminiKey) return null;
  if (!client) {
    client = new GoogleGenerativeAI({ apiKey: geminiKey! });
  }
  return client;
}

export type RouteSuggestionInput = {
  origin: string;
  destination: string;
  constraints?: string[];
};

export type EfficiencyAnalysisInput = {
  tripsCompleted: number;
  averageDelayInMinutes: number;
  fuelConsumptionPerKm: number;
  incidents: number;
};

export type IntelligenceReportInput = {
  timeframe: "daily" | "weekly" | "monthly";
  highlights: string[];
};

const fallback = {
  routeSuggestion: {
    summary:
      "Utilize os corredores principais com janela otimizada de embarque e desembarque.",
    recommendations: [
      "Considere uma parada intermediária perto de pontos com alta densidade de passageiros.",
      "Sincronize a saída com a previsão de trânsito para reduzir atrasos.",
      "Garanta comunicação em tempo real com o operador para ajustes de rota." 
    ],
  },
  efficiencyAnalysis: {
    score: "B+",
    observations: [
      "Atrasos concentrados no período da manhã, ajuste de escala recomendado.",
      "Consumo de combustível dentro da meta, mas com espaço para otimização em retomadas.",
      "Baixa incidência de eventos críticos: mantenha a cadência de checklists digitais." 
    ],
  },
  intelligenceReport: {
    headline: "Operação estável com foco em pontualidade.",
    insights: [
      "Rotas industriais apresentaram melhor índice de ocupação.",
      "Painel administrativo sugere redistribuição de frota entre 06h e 08h.",
      "Checklists entregues com 94% de conformidade: priorizar tratativas pendentes." 
    ],
  },
};

function fallbackRouteSuggestion() {
  return fallback.routeSuggestion;
}

function fallbackEfficiencyAnalysis() {
  return fallback.efficiencyAnalysis;
}

function fallbackIntelligenceReport() {
  return fallback.intelligenceReport;
}

export async function getOptimizedRouteSuggestion(
  input: RouteSuggestionInput,
) {
  if (!hasGeminiKey) {
    return fallbackRouteSuggestion();
  }

  try {
    const gen = getClient()?.getGenerativeModel({ model: "gemini-1.5-flash" });
    if (!gen) return fallbackRouteSuggestion();

    const result = await gen.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Sugira melhorias de rota entre ${input.origin} e ${input.destination} considerando: ${
                input.constraints?.join(", ") || "sem restrições adicionais"
              }. Foque em transporte corporativo com ônibus.`,
            },
          ],
        },
      ],
    });

    const text = result.response.text().trim();
    return {
      summary: text.split("\n")[0],
      recommendations: text
        .split("\n")
        .slice(1)
        .filter(Boolean)
        .map((item) => item.replace(/^[-*]\s*/, "")),
    };
  } catch (error) {
    console.error("Gemini route suggestion fallback", error);
    return fallbackRouteSuggestion();
  }
}

export async function getEfficiencyAnalysis(
  input: EfficiencyAnalysisInput,
) {
  if (!hasGeminiKey) {
    return fallbackEfficiencyAnalysis();
  }

  try {
    const gen = getClient()?.getGenerativeModel({ model: "gemini-1.5-pro" });
    if (!gen) return fallbackEfficiencyAnalysis();

    const result = await gen.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise eficiência operacional com os seguintes dados: viagens concluídas ${input.tripsCompleted}, atraso médio ${input.averageDelayInMinutes} minutos, consumo médio ${input.fuelConsumptionPerKm} L/km, incidentes ${input.incidents}.` 
            },
          ],
        },
      ],
    });

    const text = result.response.text().trim();
    const lines = text.split("\n").filter(Boolean);
    return {
      score: lines[0] || "B+",
      observations: lines.slice(1).map((line) => line.replace(/^[-*]\s*/, "")),
    };
  } catch (error) {
    console.error("Gemini efficiency analysis fallback", error);
    return fallbackEfficiencyAnalysis();
  }
}

export async function getIntelligenceReport(
  input: IntelligenceReportInput,
) {
  if (!hasGeminiKey) {
    return fallbackIntelligenceReport();
  }

  try {
    const gen = getClient()?.getGenerativeModel({ model: "gemini-1.5-pro" });
    if (!gen) return fallbackIntelligenceReport();

    const highlights = input.highlights.join(", ");
    const result = await gen.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Gere um relatório ${input.timeframe} para o painel Golffox. Destaques: ${highlights}. Foque em insights acionáveis.` 
            },
          ],
        },
      ],
    });

    const text = result.response.text().trim();
    const lines = text.split("\n").filter(Boolean);
    return {
      headline: lines[0] || fallback.intelligenceReport.headline,
      insights: lines.slice(1).map((line) => line.replace(/^[-*]\s*/, "")),
    };
  } catch (error) {
    console.error("Gemini intelligence report fallback", error);
    return fallbackIntelligenceReport();
  }
}

export function isGeminiEnabled() {
  return hasGeminiKey;
}


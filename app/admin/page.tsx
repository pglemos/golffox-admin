'use client'

import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  LayoutDashboard,
  Map,
  Route,
  Bus,
  Users,
  Building2,
  ShieldCheck,
  LifeBuoy,
  Bell,
  BarChart3,
  History,
  CreditCard,
  AlertTriangle,
  Gauge,
  CheckCircle2,
  Settings,
  Sparkles,
  Compass,
  Clock3,
  Workflow,
  Globe,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const kpis = {
  inTransit: 65,
  activeVehicles: 4,
  routesToday: 4,
  criticalAlerts: 1,
  totalVehicles: 5,
}

type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

const navItems: NavItem[] = [
  { label: 'Painel', icon: LayoutDashboard, active: true },
  { label: 'Mapa vivo', icon: Map },
  { label: 'Rotas', icon: Route },
  { label: 'Frota', icon: Bus },
  { label: 'Motoristas', icon: Users },
  { label: 'Empresas', icon: Building2 },
  { label: 'Permissões', icon: ShieldCheck },
  { label: 'Suporte 24/7', icon: LifeBuoy },
  { label: 'Alertas', icon: Bell },
  { label: 'Relatórios', icon: BarChart3 },
  { label: 'Histórico', icon: History },
  { label: 'Centro de custo', icon: CreditCard },
]

const metricCards = [
  {
    label: 'Passageiros em trânsito',
    value: kpis.inTransit,
    meta: '+12% versus ontem',
    icon: Users,
    accent: 'from-indigo-500/25 via-indigo-500/15 to-slate-900/40',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Veículos ativos',
    value: kpis.activeVehicles,
    meta: `${kpis.activeVehicles}/${kpis.totalVehicles} operando agora`,
    icon: Bus,
    accent: 'from-sky-400/25 via-cyan-400/10 to-slate-900/40',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Rotas hoje',
    value: kpis.routesToday,
    meta: '+3 vs plano',
    icon: Route,
    accent: 'from-violet-500/25 via-purple-500/10 to-slate-900/40',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Alertas críticos',
    value: kpis.criticalAlerts,
    meta: 'Ação imediata necessária',
    icon: AlertTriangle,
    accent: 'from-rose-500/30 via-rose-500/10 to-slate-900/40',
    iconAccent: 'bg-rose-500/20 text-rose-100',
    metaClass: 'text-rose-200',
  },
]

const statusHighlights = [
  {
    label: 'Operação estável',
    description: `Ocupação média ${kpis.inTransit}%`,
    icon: CheckCircle2,
    classes: 'bg-emerald-500/10 text-emerald-100 border-emerald-400/50',
    dot: 'bg-emerald-400',
  },
  {
    label: 'Monitorar rotas',
    description: 'Manter desvio abaixo de 10%',
    icon: Gauge,
    classes: 'bg-amber-500/10 text-amber-100 border-amber-400/50',
    dot: 'bg-amber-400',
  },
  {
    label: 'Alertas pendentes',
    description: `${kpis.criticalAlerts} tarefas urgentes`,
    icon: AlertTriangle,
    classes: 'bg-rose-500/15 text-rose-100 border-rose-400/50',
    dot: 'bg-rose-400',
  },
]

const quickActions = [
  {
    label: 'Monitorar ocupação',
    description: 'Painel concierge com leitura por minuto da frota premium.',
    icon: Gauge,
    accent: 'from-indigo-500/35 via-indigo-400/15 to-transparent',
  },
  {
    label: 'Ver alertas',
    description: 'Central de protocolos e incidentes críticos com playbooks.',
    icon: Bell,
    accent: 'from-rose-500/35 via-rose-400/10 to-transparent',
  },
  {
    label: 'Configuração & IA',
    description: 'Preferências, integrações e automações assistidas.',
    icon: Settings,
    accent: 'from-sky-500/35 via-cyan-400/10 to-transparent',
  },
]

const conciergeBoard = [
  {
    title: 'Rota 04 — GF-204',
    caption: 'Veículo parado há 25 minutos',
    detail: 'Contato aberto com motorista. Concierge acionado.',
  },
  {
    title: 'Fila concierge',
    caption: '3 passageiros aguardando',
    detail: 'Envio de amenidades confirmado. Monitoramento ativo.',
  },
]

const aiInsights = [
  {
    title: 'Insights de IA',
    body: 'Ocupação semanal +8%. Pico previsto quinta-feira entre 15h e 17h. Reforce frota concierge.',
    cta: 'Ver relatório detalhado',
  },
  {
    title: 'Atualização de SLA',
    body: 'Tempo médio de resposta em 2m45s. Status dentro do contrato premium.',
    cta: 'Abrir indicadores',
  },
]

const globalUpdates = [
  {
    title: 'Expansão LatAm',
    description: 'Nova frota conectada em Santiago. Operação inicia amanhã às 05h.',
    icon: Globe,
  },
  {
    title: 'Workflow financeiro',
    description: 'Integração com ERP aprovada pelo compliance da companhia.',
    icon: Workflow,
  },
  {
    title: 'Checkpoint executivo',
    description: 'Reunião com board às 18h para revisão da malha concierge.',
    icon: Clock3,
  },
]

const chartLabels = ['06h', '08h', '10h', '12h', '14h', '16h', '18h']
const chartValues = [42, 55, 60, 70, 65, 75, 80]

export default function AdminPage() {
  const chartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: 'Ocupação',
          data: chartValues,
          borderColor: '#7c7bff',
          borderWidth: 3,
          tension: 0.45,
          pointRadius: 0,
          fill: true,
          backgroundColor: (context: any) => {
            const { chart } = context
            const { ctx, chartArea } = chart ?? {}
            if (!ctx || !chartArea) {
              return 'rgba(124, 123, 255, 0.18)'
            }
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(124, 123, 255, 0.35)')
            gradient.addColorStop(1, 'rgba(124, 123, 255, 0)')
            return gradient
          },
        },
      ],
    }),
    []
  )

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: 'rgba(148, 163, 184, 0.25)',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#f8fafc',
          padding: 12,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#94a3b8', font: { size: 12, family: 'Plus Jakarta Sans, sans-serif' } },
        },
        y: {
          border: { display: false },
          grid: { color: 'rgba(148,163,184,0.16)', drawTicks: false },
          min: 0,
          max: 100,
          ticks: { stepSize: 25, color: '#94a3b8', font: { size: 12, family: 'Plus Jakarta Sans, sans-serif' } },
        },
      },
    }),
    []
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-25%] h-[55vh] bg-[radial-gradient(circle,_rgba(108,99,255,0.32),_transparent_70%)] blur-[120px]" />
        <div className="absolute right-[-15%] top-[35%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(0,212,255,0.28),_transparent_68%)] blur-[120px]" />
        <div className="absolute bottom-[-35%] left-[-10%] h-[55vh] w-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(255,71,87,0.25),_transparent_70%)] blur-[130px]" />
      </div>

      <div className="relative z-10 flex min-h-screen gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-10 xl:px-14">
        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="golffox-glass-strong flex h-full flex-col border border-white/15 p-6">
            <div className="golffox-shimmer rounded-[30px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-base font-semibold text-white">
                  GF
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-golffox-muted">Golffox Admin</p>
                  <p className="text-sm font-semibold text-white">Premium 4.0</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-golffox-muted">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-white/80">
                  <span>Ocupação agora</span>
                  <span className="text-base font-semibold text-white">{kpis.inTransit}%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-white/80">
                  <span>Resposta concierge</span>
                  <span>2m45s</span>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex-1 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-white/12 text-white shadow-[0_18px_40px_rgba(108,99,255,0.18)]'
                      : 'text-golffox-muted hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-white/10">
                    <item.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-[30px] bg-gradient-to-br from-indigo-500/85 via-purple-500/80 to-sky-500/80 p-6 text-white shadow-[0_20px_60px_rgba(88,80,255,0.35)]">
              <p className="text-sm font-semibold">Observatório concierge</p>
              <p className="mt-2 text-xs text-white/80">Faça upgrade para previsões com IA generativa e playbooks automáticos.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto flex h-full max-w-6xl flex-col gap-8">
            <header className="flex flex-col gap-6 rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.28em] text-golffox-muted">
                  <Sparkles className="h-3.5 w-3.5" /> Visão premium
                </span>
                <h1 className="text-3xl font-semibold text-white">Painel</h1>
                <p className="text-sm text-golffox-muted">Visão geral em processamento — operações executivas em tempo real.</p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-golffox-muted shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Sincronizado
                </span>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_15px_40px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5">
                  <Compass className="h-4 w-4" /> Alternar tema
                </button>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${card.accent} p-6 shadow-[0_25px_60px_rgba(8,9,18,0.55)] backdrop-blur-2xl transition hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-golffox-muted">{card.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                    </div>
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconAccent}`}>
                      <card.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className={`mt-4 text-xs ${card.metaClass ?? 'text-golffox-muted'}`}>{card.meta}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="golffox-glass-strong relative overflow-hidden border border-white/10 p-6">
                <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(124,123,255,0.25),_transparent_70%)]" />
                <div className="relative flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Ocupação por hora</p>
                      <p className="text-xs text-golffox-muted">Atualização contínua — dia corrente</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-golffox-muted">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" /> Atualizado há 2 minutos
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-[26px] border border-white/10 bg-white/5 p-5 text-white shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-2xl"
                  >
                    <p className="text-sm font-semibold">{insight.title}</p>
                    <p className="mt-2 text-sm text-golffox-muted">{insight.body}</p>
                    <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80">
                      {insight.cta}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-wrap gap-3">
              {statusHighlights.map((chip) => (
                <div
                  key={chip.label}
                  className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-xl ${chip.classes}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${chip.dot}`} />
                  <span className="flex items-center gap-2 text-white">
                    <chip.icon aria-hidden="true" className="h-4 w-4" />
                    {chip.label}
                  </span>
                  <span className="text-xs text-white/70">{chip.description}</span>
                </div>
              ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              {quickActions.map((card) => (
                <div
                  key={card.label}
                  className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-2xl transition hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`} />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{card.label}</p>
                        <p className="mt-2 text-sm text-golffox-muted">{card.description}</p>
                      </div>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white/80">
                        <card.icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                    </div>
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
                      Abrir painel <ArrowTriangleIcon />
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Ocupação atual</p>
                    <p className="mt-1 text-xs text-golffox-muted">Playbooks concierge prontos para execução.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-golffox-muted">
                    <Sparkles className="h-3.5 w-3.5" /> Prioridade
                  </span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {conciergeBoard.map((card) => (
                    <div key={card.title} className="rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm text-golffox-muted">
                      <p className="text-base font-semibold text-white">{card.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/60">{card.caption}</p>
                      <p className="mt-3 text-sm text-golffox-muted">{card.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-2xl">
                <p className="text-sm font-semibold text-white">Atualizações globais</p>
                <div className="mt-4 space-y-4">
                  {globalUpdates.map((update) => (
                    <div key={update.title} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/80">
                        <update.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{update.title}</p>
                        <p className="mt-1 text-xs text-golffox-muted">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function ArrowTriangleIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4.75L15 10L5 15.25V4.75Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

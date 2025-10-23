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
  { label: 'Visão geral', icon: LayoutDashboard, active: true },
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
  { label: 'Custos', icon: CreditCard },
]

const metricCards = [
  {
    label: 'Passageiros em trânsito',
    value: kpis.inTransit,
    meta: '+12% versus ontem',
    icon: Users,
    accent: 'from-indigo-500/20 to-slate-900/20',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Veículos ativos',
    value: kpis.activeVehicles,
    meta: `${kpis.activeVehicles}/${kpis.totalVehicles} operando agora`,
    icon: Bus,
    accent: 'from-sky-400/25 to-slate-900/20',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Rotas hoje',
    value: kpis.routesToday,
    meta: '+3 vs plano',
    icon: Route,
    accent: 'from-violet-500/25 to-slate-900/25',
    iconAccent: 'bg-white/10 text-white',
  },
  {
    label: 'Alertas críticos',
    value: kpis.criticalAlerts,
    meta: 'Ação imediata necessária',
    icon: AlertTriangle,
    accent: 'from-rose-500/25 to-slate-900/25',
    iconAccent: 'bg-rose-500/15 text-rose-200',
    metaClass: 'text-rose-300',
  },
]

const statusHighlights = [
  {
    label: 'Operação estável',
    description: `Ocupação média ${kpis.inTransit}%`,
    icon: CheckCircle2,
    classes: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/40',
    dot: 'bg-emerald-400',
  },
  {
    label: 'Monitorar rotas',
    description: 'Manter desvio abaixo de 10%',
    icon: Gauge,
    classes: 'bg-amber-500/10 text-amber-200 border-amber-400/40',
    dot: 'bg-amber-400',
  },
  {
    label: 'Alertas pendentes',
    description: `${kpis.criticalAlerts} tarefas urgentes`,
    icon: AlertTriangle,
    classes: 'bg-rose-500/10 text-rose-200 border-rose-400/40',
    dot: 'bg-rose-400',
  },
]

const quickActions = [
  {
    label: 'Acompanhar veículos',
    description: 'Mapa panorâmico com telemetria por segundo',
    icon: Map,
  },
  {
    label: 'Ver análises',
    description: 'Dashboards por rota, frota e ocupação',
    icon: BarChart3,
  },
  {
    label: 'Configurações e identidade',
    description: 'Preferências, integrações e branding Golffox',
    icon: Settings,
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
          borderColor: '#6c63ff',
          borderWidth: 3,
          tension: 0.45,
          pointRadius: 0,
          fill: true,
          backgroundColor: (context: any) => {
            const { chart } = context
            const { ctx, chartArea } = chart ?? {}
            if (!ctx || !chartArea) {
              return 'rgba(108,99,255,0.12)'
            }
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(108,99,255,0.35)')
            gradient.addColorStop(1, 'rgba(108,99,255,0)')
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
    <div className="relative min-h-screen bg-transparent text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-15%] h-[45vh] bg-[radial-gradient(circle,_rgba(108,99,255,0.28),_transparent_70%)] blur-3xl" />
        <div className="absolute right-[-20%] top-[35%] h-[40vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(0,212,255,0.24),_transparent_68%)] blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-15%] h-[50vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(255,71,87,0.22),_transparent_70%)] blur-[120px]" />
      </div>
      <div className="relative z-10 flex min-h-screen gap-8 px-6 pb-12 pt-10 lg:px-12">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="golffox-glass-strong flex h-full flex-col border-white/10 p-6">
            <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-base font-semibold text-white">
                GF
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-golffox-muted">Golffox Admin</p>
                <p className="text-sm font-semibold text-white">Experience OS 2.0</p>
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition group-hover:bg-white/10">
                    <item.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-sky-500/80 p-6 text-white shadow-[0_20px_60px_rgba(88,80,255,0.35)]">
              <p className="text-sm font-semibold">Insights avançados</p>
              <p className="mt-2 text-xs text-white/80">Faça upgrade para liberar previsões assistidas por IA e monitoramento proativo.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto flex h-full max-w-6xl flex-col gap-8">
            <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-white">Visão estratégica</h1>
                <p className="text-sm text-golffox-muted">Monitoramento em tempo real da mobilidade executiva premium.</p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-golffox-muted shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Painel Golffox sincronizado
                </span>
                <button className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#050508] shadow-[0_15px_40px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5">
                  Alternar tema
                </button>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br ${card.accent} p-6 shadow-[0_25px_60px_rgba(8,9,18,0.55)] backdrop-blur-xl transition hover:-translate-y-1`}
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

            <section className="golffox-glass-strong border border-white/10 p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Ocupação por hora</p>
                  <p className="text-xs text-golffox-muted">Atualização contínua — dia corrente</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-golffox-muted">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Atualizado há 2 minutos
                </span>
              </div>
              <div className="h-64 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </section>

            <section className="flex flex-wrap gap-3">
              {statusHighlights.map((chip) => (
                <div
                  key={chip.label}
                  className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-lg ${chip.classes}`}
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

            <section className="grid gap-4 md:grid-cols-3">
              {quickActions.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-xl transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{card.label}</p>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white/80">
                      <card.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-golffox-muted">{card.description}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-[28px] border border-rose-400/30 bg-rose-500/15 p-6 text-rose-50 shadow-[0_25px_60px_rgba(120,20,45,0.35)] backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-rose-200">
                    <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">1 alerta crítico requer ação imediata</p>
                    <p className="mt-2 text-sm text-rose-100">
                      Veículo GF-204 parado há 25 minutos próximo à Rota 4. Contate o motorista e acione protocolo concierge.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_60px_rgba(8,9,18,0.45)] backdrop-blur-xl">
                <p className="text-sm font-semibold">Insights de IA</p>
                <p className="mt-2 text-sm text-golffox-muted">
                  Ocupação semanal +8%. Picos previstos na quinta-feira entre 15h e 17h. Sugestão: reforçar frota concierge.
                </p>
                <button className="mt-4 inline-flex items-center text-sm font-semibold text-white transition hover:text-white/80">
                  Ver relatório detalhado
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

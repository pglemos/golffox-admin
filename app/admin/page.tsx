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
  { label: 'Painel', icon: LayoutDashboard, active: true },
  { label: 'Mapa', icon: Map },
  { label: 'Rotas', icon: Route },
  { label: 'Veículos', icon: Bus },
  { label: 'Motoristas', icon: Users },
  { label: 'Empresas', icon: Building2 },
  { label: 'Permissões', icon: ShieldCheck },
  { label: 'Suporte', icon: LifeBuoy },
  { label: 'Alertas', icon: Bell },
  { label: 'Relatórios', icon: BarChart3 },
  { label: 'Histórico', icon: History },
  { label: 'Custos', icon: CreditCard },
]

const metricCards = [
  {
    label: 'Passageiros em trânsito',
    value: kpis.inTransit,
    meta: '+12% vs ontem',
    icon: Users,
    accent: 'border-indigo-100 shadow-indigo-500/10',
    iconAccent: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    label: 'Veículos ativos',
    value: kpis.activeVehicles,
    meta: `${kpis.activeVehicles}/${kpis.totalVehicles} operando agora`,
    icon: Bus,
    accent: 'border-sky-100 shadow-sky-500/10',
    iconAccent: 'bg-sky-500/10 text-sky-600',
  },
  {
    label: 'Rotas hoje',
    value: kpis.routesToday,
    meta: '+3 vs plano',
    icon: Route,
    accent: 'border-violet-100 shadow-violet-500/10',
    iconAccent: 'bg-violet-500/10 text-violet-600',
  },
  {
    label: 'Alertas críticos',
    value: kpis.criticalAlerts,
    meta: 'Ação imediata necessária',
    icon: AlertTriangle,
    accent: 'border-rose-100 shadow-rose-500/15',
    iconAccent: 'bg-rose-500/10 text-rose-600',
    metaClass: 'text-rose-500',
  },
]

const statusHighlights = [
  {
    label: 'Operação estável',
    description: `Ocupação média ${kpis.inTransit}%`,
    icon: CheckCircle2,
    classes: 'border-emerald-200 text-emerald-700 bg-emerald-50/80',
    dot: 'bg-emerald-400',
  },
  {
    label: 'Monitorar rotas',
    description: 'Manter desvio de rota abaixo de 10%',
    icon: Gauge,
    classes: 'border-amber-200 text-amber-700 bg-amber-50/80',
    dot: 'bg-amber-400',
  },
  {
    label: 'Alertas pendentes',
    description: `${kpis.criticalAlerts} tarefas urgentes`,
    icon: AlertTriangle,
    classes: 'border-rose-200 text-rose-700 bg-rose-50/80',
    dot: 'bg-rose-400',
  },
]

const quickActions = [
  {
    label: 'Acompanhar veículos',
    description: 'Mapa em tempo real com geolocalização por segundo',
    icon: Map,
  },
  {
    label: 'Ver análises',
    description: 'Dashboards por rota, frota e ocupação',
    icon: BarChart3,
  },
  {
    label: 'Configurações e identidade',
    description: 'Preferências de notificação, tema e integrações',
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
          label: 'Ocupa��o',
          data: chartValues,
          borderColor: '#4f46e5',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          fill: true,
          backgroundColor: (context: any) => {
            const { chart } = context
            const { ctx, chartArea } = chart ?? {}
            if (!ctx || !chartArea) {
              return 'rgba(79,70,229,0.08)'
            }
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(79,70,229,0.25)')
            gradient.addColorStop(1, 'rgba(79,70,229,0)')
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
          backgroundColor: '#0f172a',
          borderColor: '#1e293b',
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
          ticks: { color: '#94a3b8', font: { size: 12, family: 'Inter, sans-serif' } },
        },
        y: {
          border: { display: false },
          grid: { color: 'rgba(148,163,184,0.18)', drawTicks: false },
          min: 0,
          max: 100,
          ticks: { stepSize: 25, color: '#94a3b8', font: { size: 12, family: 'Inter, sans-serif' } },
        },
      },
    }),
    []
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-800">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-24 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative z-10 flex min-h-screen gap-8 px-6 py-10 lg:px-10">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-slate-50/80 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-sm font-semibold text-white">
                GF
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Golf Fox Admin</p>
                <p className="text-sm font-semibold text-slate-800">Premium 9.0</p>
              </div>
            </div>

            <nav className="mt-6 flex-1 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-500 hover:bg-slate-100/60'
                  }`}
                >
                  <item.icon
                    aria-hidden="true"
                    className={`h-4 w-4 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`}
                  />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-500 via-indigo-500/90 to-sky-500 p-5 text-white shadow-lg shadow-indigo-500/30">
              <p className="text-sm font-semibold">Insights avan�ados</p>
              <p className="mt-2 text-xs text-white/80">Fa�a upgrade para desbloquear an�lises preditivas das suas rotas.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto flex h-full max-w-6xl flex-col gap-8">
            <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Vis�o geral do painel</h1>
                <p className="text-sm text-slate-500">Visibilidade em tempo real de rotas, ve�culos e alertas.</p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-500 shadow-sm shadow-slate-900/5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Renderizando painel Golf Fox Admin...
                </span>
                <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-900/10">
                  Modo escuro
                </button>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className={`relative overflow-hidden rounded-3xl border bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 ${card.accent}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconAccent}`}>
                      <card.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className={`mt-3 text-xs ${card.metaClass ?? 'text-slate-500'}`}>{card.meta}</p>
                </div>
              ))}
            </section>

            <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ocupa��o por hora</p>
                  <p className="text-xs text-slate-500">Acompanhamento ao vivo do dia atual</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Atualizado h� 2 minutos
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
                  className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium shadow-sm shadow-slate-900/5 ${chip.classes}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${chip.dot}`} />
                  <span className="flex items-center gap-2">
                    <chip.icon aria-hidden="true" className="h-4 w-4" />
                    {chip.label}
                  </span>
                  <span className="text-xs text-slate-500">{chip.description}</span>
                </div>
              ))}
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {quickActions.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{card.label}</p>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <card.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{card.description}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-3xl border border-rose-100 bg-rose-50/90 p-6 text-rose-700 shadow-lg shadow-rose-500/10 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-rose-500">
                    <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">1 alerta cr�tico requer a��o imediata</p>
                    <p className="mt-2 text-sm text-rose-600">
                      Ve�culo GF-204 parado h� 25 minutos pr�ximo � Rota 4. Contate o motorista para retomar o trajeto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                <p className="text-sm font-semibold text-slate-900">Insights de IA</p>
                <p className="mt-2 text-sm text-slate-500">
                  Relat�rio simulado: a ocupa��o semanal melhorou 8%. Picos esperados na quinta-feira entre 15h e 17h.
                </p>
                <button className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Ver relat�rio detalhado
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

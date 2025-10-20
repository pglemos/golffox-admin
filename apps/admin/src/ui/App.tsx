import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useSpring, type Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutGrid,
  Map as MapIcon,
  Route,
  Bus,
  Users,
  Building2,
  ShieldCheck,
  LifeBuoy,
  Bell,
  FileBarChart,
  History,
  Wallet2,
  Settings,
  AlertTriangle,
  Menu,
  Sun,
  Moon,
  CheckCircle2,
  Clock3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { supabaseClient } from '../lib/supabaseClient'
import { aiSuggest } from '../lib/aiClient'
import { brand } from '../theme'
import { MOCK_ROUTES } from '../../../../constants'
import type { Route as RouteType } from '../../../../src/types/types'
import { RouteStatus } from '../../../../src/types/types'

const glassDark =
  'backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.35)]'
const glassLight =
  'backdrop-blur-xl bg-white/85 border border-slate-200/70 shadow-[0_22px_44px_rgba(15,23,42,0.12)]'

const themeTokens = {
  dark: {
    background: 'bg-gradient-to-br from-[#0E1116] via-[#111827] to-[#090C12] text-white',
    header: 'border-white/10 bg-black/45',
    glass: glassDark,
    navActive:
      'bg-gradient-to-r from-blue-600/60 to-blue-400/20 text-white shadow-[0_0_25px_rgba(37,99,235,0.35)]',
    navInactive: 'text-gray-300 hover:bg-white/10 hover:shadow-[0_0_16px_rgba(59,130,246,0.18)]',
    quickTitle: 'text-white',
    quickDescription: 'text-slate-400',
    chartAxis: '#cbd5f5',
    chartGrid: 'rgba(255,255,255,0.08)',
    tooltipBg: 'rgba(15,23,42,0.9)',
    tooltipText: '#e2e8f0',
    tooltipLabel: '#94a3b8',
    statusChip: {
      emerald: 'bg-gradient-to-r from-emerald-500/25 to-emerald-500/8 text-emerald-100 border-emerald-400/25',
      amber: 'bg-gradient-to-r from-amber-500/25 to-amber-500/10 text-amber-100 border-amber-400/25',
      rose: 'bg-gradient-to-r from-rose-500/25 to-rose-500/8 text-rose-100 border-rose-400/25',
    },
  },
  light: {
    background: 'bg-gradient-to-br from-[#F6F9FF] via-[#EEF2FB] to-[#DEE8FF] text-slate-900',
    header:
      'border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.08)] text-slate-900',
    glass: glassLight,
    navActive:
      'bg-gradient-to-r from-blue-600/20 to-blue-400/10 text-blue-700 shadow-[0_0_18px_rgba(37,99,235,0.25)] border border-blue-400/20',
    navInactive:
      'text-slate-600 hover:bg-white/90 hover:shadow-[0_0_18px_rgba(59,130,246,0.18)] border border-transparent',
    quickTitle: 'text-slate-900',
    quickDescription: 'text-slate-500',
    chartAxis: '#475569',
    chartGrid: 'rgba(71,85,105,0.18)',
    tooltipBg: 'rgba(255,255,255,0.98)',
    tooltipText: '#0f172a',
    tooltipLabel: '#1e293b',
    statusChip: {
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-[0_12px_24px_rgba(16,185,129,0.18)]',
      amber: 'bg-amber-100 text-amber-700 border-amber-200 shadow-[0_12px_24px_rgba(251,191,36,0.18)]',
      rose: 'bg-rose-100 text-rose-700 border-rose-200 shadow-[0_12px_24px_rgba(244,63,94,0.18)]',
    },
  },
} as const

type ThemeTokens = typeof themeTokens.dark | typeof themeTokens.light

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

type SidebarItemProps = {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
  tokens: ThemeTokens
}

const SidebarButton = ({ icon: Icon, label, active, onClick, tokens }: SidebarItemProps) => (
  <motion.button
    whileHover={{ scale: 1.07, x: 6 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? tokens.navActive : tokens.navInactive
    }`}
  >
    <motion.span
      className="grid h-8 w-8 place-items-center rounded-lg"
      animate={
        active
          ? {
              filter: [
                'drop-shadow(0 0 0px rgba(59,130,246,0))',
                'drop-shadow(0 0 12px rgba(59,130,246,0.55))',
                'drop-shadow(0 0 0px rgba(59,130,246,0))',
              ],
            }
          : {}
      }
      transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    >
      <Icon size={18} />
    </motion.span>
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </motion.button>
)

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(value, { stiffness: 110, damping: 18 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)))
    return () => unsub()
  }, [spring])

  return <span>{new Intl.NumberFormat('pt-BR').format(display)}</span>
}

type MetricCardProps = {
  icon: LucideIcon
  title: string
  value: string | number
  sub?: ReactNode
  tone?: string
  glassClass: string
  titleClass: string
}

const MetricCard = ({
  icon: Icon,
  title,
  value,
  sub,
  tone = brand.primary,
  glassClass,
  titleClass,
}: MetricCardProps) => {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setPulse(true)
    const timeout = window.setTimeout(() => setPulse(false), 600)
    return () => window.clearTimeout(timeout)
  }, [value])

  return (
    <motion.div
      whileHover={{ translateY: -6, boxShadow: '0 18px 40px rgba(37,99,235,0.22)' }}
      className={`rounded-2xl p-5 transition-all ${glassClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm font-medium tracking-wide ${titleClass}`}>{title}</div>
          <div className="mt-1 text-3xl font-semibold">
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
          </div>
          {sub ? (
            <motion.div animate={pulse ? { scale: [1, 1.05, 1] } : {}} className="mt-1 text-xs opacity-80">
              {sub}
            </motion.div>
          ) : null}
        </div>
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-xl bg-white/12 border border-white/10 shadow-inner"
        >
          <Icon size={22} color={tone} />
        </motion.div>
      </div>
    </motion.div>
  )
}

type QuickActionProps = {
  title: string
  description: string
  onClick: () => void
  tone?: string
  icon: LucideIcon
  glassClass: string
  titleClass: string
  descriptionClass: string
}

const QuickAction = ({
  title,
  description,
  onClick,
  tone = brand.primary,
  icon: Icon,
  glassClass,
  titleClass,
  descriptionClass,
}: QuickActionProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04, translateY: -4 }}
      className={`rounded-2xl p-5 w-full text-left transition-all ${glassClass} snap-center min-w-[230px]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-semibold text-lg tracking-wide ${titleClass}`}>{title}</div>
          <div className={`text-sm mt-1 leading-relaxed ${descriptionClass}`}>{description}</div>
        </div>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-10 w-10 grid place-items-center rounded-lg bg-white/10 border border-white/10"
        >
          <Icon size={18} />
        </motion.div>
      </div>
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mt-4 h-1 rounded-full origin-left"
        style={{ background: tone, opacity: 0.5 }}
      />
    </motion.button>
  )
}

type KPIState = {
  emTransito: number
  veiculosAtivos: number
  veiculosTotais: number
  rotasDia: number
  alertasCriticos: number
}

type StatusBadge = {
  icon: string
  label: string
  tone: string
  description: string
}

type StatusFilter = 'todas' | RouteStatus

const statusDescriptions: Record<RouteStatus, string> = {
  [RouteStatus.OnTime]: 'Sem desvios relevantes',
  [RouteStatus.Delayed]: 'Acompanhamento próximo recomendado',
  [RouteStatus.Problem]: 'Requer intervenção imediata',
}

const getStatusTone = (status: RouteStatus, isLight: boolean) => {
  if (isLight) {
    switch (status) {
      case RouteStatus.OnTime:
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300'
      case RouteStatus.Delayed:
        return 'bg-amber-100 text-amber-700 border border-amber-300'
      case RouteStatus.Problem:
        return 'bg-rose-100 text-rose-700 border border-rose-300'
    }
  }

  switch (status) {
    case RouteStatus.OnTime:
      return 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/40'
    case RouteStatus.Delayed:
      return 'bg-amber-500/20 text-amber-100 border border-amber-400/40'
    case RouteStatus.Problem:
      return 'bg-rose-500/20 text-rose-100 border border-rose-400/40'
    default:
      return 'bg-slate-500/20 text-slate-100 border border-slate-400/40'
  }
}

const formatPunctuality = (value: number) => {
  if (value === 0) return 'No horário'
  const minutes = Math.abs(value)
  return value > 0 ? `Atraso de ${minutes} min` : `Adiantada ${minutes} min`
}

const getOccupancy = (route: RouteType) => {
  if (!route.passengers.total) return 0
  return Math.round((route.passengers.onboard / route.passengers.total) * 100)
}

type DashboardPageProps = {
  kpis: KPIState
  goto: (path: string) => void
  aiSummary: string
  chartData: Array<{ hora: string; ocupacao: number }>
  glassClass: string
  statuses: StatusBadge[]
  tokens: ThemeTokens
}

const DashboardPage = ({ kpis, goto, aiSummary, chartData, glassClass, statuses, tokens }: DashboardPageProps) => (
  <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MetricCard
        icon={Users}
        title="Passengers in transit"
        value={kpis.emTransito}
        sub="+12% versus yesterday"
        tone={brand.success}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Bus}
        title="Active vehicles"
        value={kpis.veiculosAtivos}
        sub={`${kpis.veiculosAtivos}/${kpis.veiculosTotais} operating now`}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Route}
        title="Routes today"
        value={kpis.rotasDia}
        sub="+3 versus plan"
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={AlertTriangle}
        title="Critical alerts"
        value={kpis.alertasCriticos}
        sub={<span className="text-red-400">Immediate action required</span>}
        tone="#ef4444"
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
    </div>

    <motion.div className={`rounded-2xl p-6 transition-all ${glassClass}`} layout>
      <div className={`font-semibold mb-4 text-lg flex items-center gap-2 ${tokens.quickTitle}`}>
        <Route size={16} /> Occupancy by hour
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 12, left: 6, right: 12, bottom: 0 }}>
          <CartesianGrid stroke={tokens.chartGrid} strokeDasharray="4 8" />
          <XAxis dataKey="hora" stroke={tokens.chartAxis} tickLine={false} axisLine={false} />
          <YAxis stroke={tokens.chartAxis} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={45} />
          <Tooltip
            cursor={{ stroke: 'rgba(37,99,235,0.35)', strokeWidth: 1 }}
            contentStyle={{
              background: tokens.tooltipBg,
              border: '1px solid rgba(148,163,184,0.28)',
              borderRadius: '14px',
              color: tokens.tooltipText,
            }}
            labelStyle={{ color: tokens.tooltipLabel, fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="ocupacao"
            stroke={brand.primary}
            strokeWidth={3}
            dot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: brand.accent, strokeWidth: 2 }}
            isAnimationActive
            animationDuration={1400}
            animationBegin={200}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>

    <div className="flex flex-wrap gap-3">
      {statuses.map((status) => (
        <motion.div
          key={status.label}
          whileHover={{ scale: 1.04 }}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition ${status.tone}`}
        >
          <span className="mr-2">{status.icon}</span>
          {status.label}
          <span className="ml-2 text-xs opacity-80">{status.description}</span>
        </motion.div>
      ))}
    </div>

    <div className="space-y-2">
      <div className={`font-semibold mb-2 text-lg ${tokens.quickTitle}`}>Quick actions</div>
      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-2 md:pb-0 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
        <QuickAction
          title="Track vehicles"
          description="Live map with second-by-second geolocation"
          onClick={() => goto('/mapa')}
          icon={MapIcon}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="View analytics"
          description="Dashboards by route, fleet and occupancy"
          onClick={() => goto('/relatorios')}
          tone={brand.accent}
          icon={FileBarChart}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="Setup & branding"
          description="Notification, theming and integration preferences"
          onClick={() => goto('/config')}
          tone="#94a3b8"
          icon={Settings}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
      </div>
    </div>

    <motion.div
      animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.01, 1] }}
      transition={{ duration: 2.1, repeat: Infinity }}
      className={`rounded-2xl p-4 border ${glassClass} border-red-500/30 bg-red-500/10`}
    >
      <div className="flex items-center gap-3 text-red-300">
        <AlertTriangle className="animate-pulse" /> {kpis.alertasCriticos} critical alerts require immediate action.
      </div>
    </motion.div>

    <motion.div className={`rounded-2xl p-6 transition-all ${glassClass}`} layout>
      <div className={`font-semibold mb-2 text-lg ${tokens.quickTitle}`}>AI insights</div>
      <p className="text-sm leading-relaxed opacity-80">{aiSummary}</p>
    </motion.div>
  </motion.div>
)

type RoutesPageProps = {
  tokens: ThemeTokens
  glassClass: string
  isLight: boolean
}

const RoutesPage = ({ tokens, glassClass, isLight }: RoutesPageProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas')

  const routes = useMemo<RouteType[]>(() => MOCK_ROUTES, [])

  const metrics = useMemo(() => {
    const total = routes.length
    const onTime = routes.filter((route) => route.status === RouteStatus.OnTime).length
    const delayed = routes.filter((route) => route.status === RouteStatus.Delayed).length
    const problem = routes.filter((route) => route.status === RouteStatus.Problem).length
    const boarded = routes.reduce((sum, route) => sum + route.passengers.onboard, 0)
    const capacity = routes.reduce((sum, route) => sum + route.passengers.total, 0)
    const avgOccupancy = capacity > 0 ? Math.round((boarded / capacity) * 100) : 0
    const avgPunctuality =
      total > 0 ? routes.reduce((sum, route) => sum + route.punctuality, 0) / total : 0

    return {
      total,
      onTime,
      delayed,
      problem,
      avgOccupancy,
      avgPunctuality,
    }
  }, [routes])

  const filteredRoutes = useMemo(() => {
    if (statusFilter === 'todas') return routes
    return routes.filter((route) => route.status === statusFilter)
  }, [routes, statusFilter])

  const upcomingRoutes = useMemo(
    () =>
      [...routes]
        .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))
        .slice(0, 3),
    [routes]
  )

  const filterOptions: Array<{ key: StatusFilter; label: string }> = [
    { key: 'todas', label: 'Todas' },
    { key: RouteStatus.OnTime, label: RouteStatus.OnTime },
    { key: RouteStatus.Delayed, label: RouteStatus.Delayed },
    { key: RouteStatus.Problem, label: RouteStatus.Problem },
  ]

  const activeFilterClass = isLight
    ? 'bg-blue-500/15 text-blue-700 border-blue-400/40 shadow-[0_0_16px_rgba(37,99,235,0.18)]'
    : 'bg-blue-500/20 text-blue-100 border-blue-400/40 shadow-[0_0_18px_rgba(37,99,235,0.28)]'

  const inactiveFilterClass = isLight
    ? 'border-slate-200/60 text-slate-600 hover:border-blue-400/40 hover:text-blue-600 bg-white/70'
    : 'border-white/10 text-slate-300 hover:border-blue-400/30 hover:text-blue-100 bg-white/5'

  const tableHeaderClass = isLight ? 'border-slate-200/70 text-slate-500' : 'border-white/10 text-slate-300'
  const rowHoverClass = isLight ? 'hover:bg-white/75' : 'hover:bg-white/5'
  const dividerClass = isLight ? 'divide-y divide-slate-200/70' : 'divide-y divide-white/10'

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
      <div className="space-y-2 text-left">
        <div className={`text-2xl font-semibold ${tokens.quickTitle}`}>Gestão de rotas corporativas</div>
        <p className="text-sm md:text-base opacity-80">
          Acompanhe o desempenho das linhas, ajuste desvios em tempo real e garanta a experiência dos
          passageiros em cada turno.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Route}
          title="Rotas monitoradas"
          value={metrics.total}
          sub="Dados consolidados do turno atual"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={CheckCircle2}
          title="No horário"
          value={metrics.onTime}
          sub={`${Math.round((metrics.onTime / Math.max(metrics.total, 1)) * 100)}% das rotas sem atrasos`}
          tone="#22c55e"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={Users}
          title="Ocupação média"
          value={`${metrics.avgOccupancy}%`}
          sub="Passageiros embarcados vs. capacidade"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={Clock3}
          title="Rotas com alerta"
          value={metrics.delayed + metrics.problem}
          sub={`${metrics.delayed} atrasadas • ${metrics.problem} com incidente`}
          tone="#f97316"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
      </div>

      <div className={`rounded-2xl p-6 transition-all ${glassClass} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Visão geral das rotas</div>
            <p className="text-sm opacity-75">
              Filtre por status para priorizar atendimento e antecipar ações corretivas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <motion.button
                key={option.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusFilter(option.key)}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                  statusFilter === option.key ? activeFilterClass : inactiveFilterClass
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wide ${tableHeaderClass}`}>
              <tr>
                <th className="py-3 pr-4 font-semibold">Rota</th>
                <th className="py-3 pr-4 font-semibold">Motorista</th>
                <th className="py-3 pr-4 font-semibold">Veículo</th>
                <th className="py-3 pr-4 font-semibold">Passageiros</th>
                <th className="py-3 pr-4 font-semibold">Horário previsto</th>
                <th className="py-3 pr-4 font-semibold">Início real</th>
                <th className="py-3 pr-4 font-semibold">Pontualidade</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className={`${dividerClass}`}>
              {filteredRoutes.map((route) => (
                <tr key={route.id} className={`transition ${rowHoverClass}`}>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-sm md:text-base">{route.name}</div>
                    <div className="text-xs opacity-70">{statusDescriptions[route.status]}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{route.driver}</div>
                    <div className="text-xs opacity-70">Escala confirmada</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{route.vehicle}</div>
                    <div className="text-xs opacity-70">Capacidade {route.passengers.total} passageiros</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">
                      {route.passengers.onboard}/{route.passengers.total}
                    </div>
                    <div className="text-xs opacity-70">{getOccupancy(route)}% de ocupação</div>
                  </td>
                  <td className="py-3 pr-4 font-medium">{route.scheduledStart}</td>
                  <td className="py-3 pr-4 font-medium">{route.actualStart}</td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{formatPunctuality(route.punctuality)}</div>
                    <div className="text-xs opacity-70">
                      {route.punctuality > 5
                        ? 'Alerte o time operacional'
                        : 'Monitoramento automático ativo'}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusTone(route.status, isLight)}`}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 transition-all ${glassClass} space-y-3 xl:col-span-2`}>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Insights operacionais</div>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-400" />
              <span>
                {metrics.onTime} rotas estão dentro do SLA. Priorize auditoria nas linhas com ocupação acima de 80% para evitar
                superlotação.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 className="mt-1 h-4 w-4 text-amber-400" />
              <span>
                A média de pontualidade é de {metrics.avgPunctuality.toFixed(1)} min. Utilize os dados de GPS para ajustar
                janelas de embarque nos próximos turnos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-4 w-4 text-rose-400" />
              <span>
                Configure notificações automáticas para as {metrics.delayed + metrics.problem} rotas em estado crítico e alinhe
                o plano de contingência com o suporte.
              </span>
            </li>
          </ul>
        </div>
        <div className={`rounded-2xl p-6 transition-all ${glassClass} space-y-4`}>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Próximas partidas</div>
          <div className="space-y-3">
            {upcomingRoutes.map((route) => (
              <div
                key={route.id}
                className={`rounded-xl border px-4 py-3 transition ${
                  isLight
                    ? 'bg-white/80 border-slate-200/70 shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
                    : 'bg-white/5 border-white/10 shadow-[0_8px_24px_rgba(15,23,42,0.25)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{route.name}</div>
                    <div className="text-xs opacity-70">Motorista {route.driver}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTone(route.status, isLight)}`}>
                    {route.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">Partida {route.scheduledStart}</div>
                    <div className="text-xs opacity-70">Última atualização às {route.actualStart}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{getOccupancy(route)}% de ocupação</div>
                    <div className="text-xs opacity-70">{route.passengers.onboard} passageiros embarcados</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminPremiumResponsive() {
  const [route, setRoute] = useState('/')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [aiSummary, setAiSummary] = useState('Loading intelligent insights...')
  const sb = useMemo(() => supabaseClient, [])
  const [kpis, setKpis] = useState<KPIState>({
    emTransito: 65,
    veiculosAtivos: 4,
    veiculosTotais: 5,
    rotasDia: 4,
    alertasCriticos: 1,
  })

  const isLight = theme === 'light'
  const tokens: ThemeTokens = themeTokens[theme]
  const glassClass = tokens.glass

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('golffox-theme') : null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    document.body.classList.toggle('light-theme', isLight)
    window.localStorage.setItem('golffox-theme', theme)
  }, [theme, isLight])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await aiSuggest({ type: 'report' })
        if (active && res.summary) setAiSummary(res.summary)
      } catch (error) {
        console.warn('[admin] AI fallback', error)
        if (active)
          setAiSummary('Operations stable. Keep monitoring occupancy, critical routes and alerts in real time.')
      }
    })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!sb) return
    let ignore = false

    const safeCount = async (table: string) => {
      const { count, error } = await sb.from(table).select('id', { count: 'exact', head: true })
      if (error) {
        console.warn(`[admin] count failed for ${table}:`, error.message)
        return null
      }
      return count ?? null
    }

    const loadKpis = async () => {
      try {
        const [driverPositions, vehiclesTotal, routesDia] = await Promise.all([
          safeCount('driver_positions'),
          safeCount('vehicles'),
          safeCount('routes'),
        ])

        if (!ignore) {
          setKpis((prev) => ({
            emTransito: driverPositions ?? prev.emTransito,
            veiculosAtivos: vehiclesTotal ?? prev.veiculosAtivos,
            veiculosTotais: vehiclesTotal ?? prev.veiculosTotais,
            rotasDia: routesDia ?? prev.rotasDia,
            alertasCriticos: (driverPositions ?? prev.alertasCriticos) > 90 ? 2 : prev.alertasCriticos,
          }))
        }
      } catch (error) {
        console.warn('[admin] failed to load KPIs (fallback values in use)', error)
      }
    }

    loadKpis()

    const channel = sb
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_positions' }, loadKpis)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, loadKpis)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, loadKpis)
      .subscribe()

    return () => {
      ignore = true
      sb.removeChannel(channel)
    }
  }, [sb])

  const chartData = useMemo(
    () => [
      { hora: '06h', ocupacao: 42 },
      { hora: '08h', ocupacao: 58 },
      { hora: '10h', ocupacao: 63 },
      { hora: '12h', ocupacao: 71 },
      { hora: '14h', ocupacao: 65 },
      { hora: '16h', ocupacao: 78 },
      { hora: '18h', ocupacao: 82 },
    ],
    []
  )

  const statuses = useMemo<StatusBadge[]>(
    () => [
      {
        icon: '🟢',
        label: 'Stable operation',
        tone: tokens.statusChip.emerald,
        description: `Average occupancy ${kpis.emTransito}%`,
      },
      {
        icon: '🟠',
        label: 'Monitor routes',
        tone: tokens.statusChip.amber,
        description: 'Keep route deviation below 10%',
      },
      {
        icon: '🔴',
        label: 'Pending alerts',
        tone: tokens.statusChip.rose,
        description: `${kpis.alertasCriticos} urgent tasks`,
      },
    ],
    [kpis.alertasCriticos, kpis.emTransito, tokens]
  )

  const goto = (path: string) => {
    setRoute(path)
    if (isMobile) setSidebarOpen(false)
  }

  const navItems: Array<{ icon: LucideIcon; label: string; path: string }> = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: MapIcon, label: 'Map', path: '/map' },
    { icon: Route, label: 'Rotas', path: '/routes' },
    { icon: Bus, label: 'Vehicles', path: '/vehicles' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: ShieldCheck, label: 'Permissions', path: '/permissions' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: FileBarChart, label: 'Reports', path: '/reports' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Wallet2, label: 'Costs', path: '/costs' },
  ]

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${tokens.background}`}>
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/70 text-white px-4 py-1 text-xs tracking-wide shadow-lg">
        Golf Fox Admin dashboard rendering…
      </div>
      <motion.div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        <motion.button
          whileHover={{ rotate: 25, scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`grid h-11 w-11 place-items-center rounded-full border ${glassClass}`}
        >
          ⚙️
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${glassClass}`}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
          {isLight ? 'Dark mode' : 'Light mode'}
        </motion.button>
      </motion.div>

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-40 border-b ${tokens.header}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen((open) => !open)}>
              <Menu size={22} />
            </button>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`h-10 w-10 grid place-items-center rounded-xl border ${
                isLight
                  ? 'bg-white/80 border-slate-200/60 shadow-[0_12px_26px_rgba(15,23,42,0.12)]'
                  : 'bg-gradient-to-br from-white/10 to-white/0 border-white/10'
              }`}
            >
              🦊
            </motion.div>
            <div className="font-semibold text-lg sm:text-xl tracking-wide">Golf Fox Admin • Premium 9.0</div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto relative">
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(!isMobile || sidebarOpen) && (
            <motion.aside
              key="sidebar"
              initial={{ x: -110, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -120, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`${isMobile ? 'fixed inset-x-4 top-24 z-50 flex' : 'hidden md:flex md:w-72 md:pl-4 md:pr-6'}`}
            >
              <div className={`flex w-full flex-col gap-2 rounded-2xl p-3 ${glassClass}`}>
                {navItems.map((item) => (
                  <SidebarButton
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={route === item.path}
                    onClick={() => goto(item.path)}
                    tokens={tokens}
                  />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.main variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {route === '/' ? (
              <DashboardPage
                key="dashboard"
                kpis={kpis}
                goto={goto}
                aiSummary={aiSummary}
                chartData={chartData}
                glassClass={glassClass}
                statuses={statuses}
                tokens={tokens}
              />
            ) : route === '/routes' ? (
              <RoutesPage key="routes" tokens={tokens} glassClass={glassClass} isLight={isLight} />
            ) : (
              <motion.div
                key={route}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl p-6 text-center text-sm md:text-base ${glassClass}`}
              >
                <div className="text-lg font-semibold mb-2">Coming soon</div>
                The page {route} is in progress.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}

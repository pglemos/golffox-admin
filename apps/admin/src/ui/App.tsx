import { useEffect, useMemo, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Building2,
  FileBarChart,
  History,
  LayoutDashboard,
  LifeBuoy,
  Map,
  Moon,
  Route,
  Settings,
  ShieldCheck,
  Sun,
  Users,
  Wallet2,
  Bus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

type NavItem = {
  label: string
  icon: LucideIcon
}

type Metric = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  accent: {
    light: string
    dark: string
  }
  glow: {
    light: string
    dark: string
  }
}

type StatusChip = {
  label: string
  description: string
  tone: {
    light: string
    dark: string
  }
}

type QuickAction = {
  title: string
  description: string
  icon: LucideIcon
  tone: {
    light: string
    dark: string
  }
}

const navItems: NavItem[] = [
  { label: 'Painel', icon: LayoutDashboard },
  { label: 'Mapa', icon: Map },
  { label: 'Rotas', icon: Route },
  { label: 'Veículos', icon: Bus },
  { label: 'Motoristas', icon: Users },
  { label: 'Empresas', icon: Building2 },
  { label: 'Permissões', icon: ShieldCheck },
  { label: 'Suporte', icon: LifeBuoy },
  { label: 'Alertas', icon: Bell },
  { label: 'Relatórios', icon: FileBarChart },
  { label: 'Histórico', icon: History },
  { label: 'Custos', icon: Wallet2 },
]

const metrics: Metric[] = [
  {
    title: 'Passageiros em trânsito',
    value: '65',
    description: '+12% em relação a ontem',
    icon: Users,
    accent: {
      light: 'from-[#eef2ff] via-indigo-100/80 to-indigo-200/70',
      dark: 'from-indigo-500/25 via-indigo-500/10 to-transparent',
    },
    glow: {
      light: 'bg-indigo-300/35',
      dark: 'bg-indigo-500/25',
    },
  },
  {
    title: 'Veículos ativos',
    value: '4',
    description: '4/5 operando agora',
    icon: Bus,
    accent: {
      light: 'from-[#ecfeff] via-sky-100/75 to-sky-200/65',
      dark: 'from-sky-500/25 via-sky-500/10 to-transparent',
    },
    glow: {
      light: 'bg-sky-300/35',
      dark: 'bg-sky-500/25',
    },
  },
  {
    title: 'Rotas hoje',
    value: '4',
    description: '+3 em relação ao planejado',
    icon: Route,
    accent: {
      light: 'from-[#f3e8ff] via-violet-100/75 to-violet-200/65',
      dark: 'from-purple-500/25 via-purple-500/10 to-transparent',
    },
    glow: {
      light: 'bg-violet-300/35',
      dark: 'bg-violet-500/25',
    },
  },
  {
    title: 'Alertas críticos',
    value: '1',
    description: 'Ação imediata necessária',
    icon: AlertTriangle,
    accent: {
      light: 'from-[#fff1f2] via-rose-100/75 to-rose-200/65',
      dark: 'from-rose-500/25 via-rose-500/10 to-transparent',
    },
    glow: {
      light: 'bg-rose-300/35',
      dark: 'bg-rose-500/25',
    },
  },
]

const quickActions: QuickAction[] = [
  {
    title: 'Monitorar veículos',
    description: 'Mapa em tempo real com geolocalização por segundo',
    icon: Map,
    tone: {
      light:
        'from-[#f5f7ff] via-indigo-100/75 to-indigo-200/70 text-black hover:shadow-[0_18px_40px_rgba(99,102,241,0.18)]',
      dark: 'from-indigo-500/25 via-indigo-500/10 to-transparent text-indigo-100 hover:shadow-[0_25px_45px_rgba(79,70,229,0.35)]',
    },
  },
  {
    title: 'Ver análises',
    description: 'Dashboards por rota, frota e ocupação',
    icon: FileBarChart,
    tone: {
      light:
        'from-[#f0fbff] via-sky-100/75 to-sky-200/70 text-black hover:shadow-[0_18px_40px_rgba(14,165,233,0.18)]',
      dark: 'from-sky-500/25 via-sky-500/10 to-transparent text-sky-100 hover:shadow-[0_25px_45px_rgba(56,189,248,0.35)]',
    },
  },
  {
    title: 'Configuração e identidade',
    description: 'Preferências de notificações, temas e integrações',
    icon: Settings,
    tone: {
      light:
        'from-[#f7f9fc] via-slate-100/75 to-slate-200/70 text-black hover:shadow-[0_18px_40px_rgba(71,85,105,0.18)]',
      dark: 'from-white/10 via-white/5 to-transparent text-slate-100 hover:shadow-[0_25px_45px_rgba(148,163,184,0.25)]',
    },
  },
]

const occupancyData = [
  { hour: '06h', occupancy: 48 },
  { hour: '08h', occupancy: 55 },
  { hour: '10h', occupancy: 58 },
  { hour: '12h', occupancy: 63 },
  { hour: '14h', occupancy: 61 },
  { hour: '16h', occupancy: 65 },
  { hour: '18h', occupancy: 69 },
]

const cardBase =
  'group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/95 p-6 text-black shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:shadow-[0_24px_65px_rgba(2,6,23,0.55)]'

const pillBase =
  'inline-flex items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-400 ease-out backdrop-blur-sm'

const tooltipStyles = (theme: 'light' | 'dark') => ({
  backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.88)',
  border: theme === 'dark' ? '1px solid rgba(148,163,184,0.35)' : '1px solid rgba(148,163,184,0.28)',
  borderRadius: 14,
  color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
  padding: '12px 16px',
  backdropFilter: 'blur(12px)',
})

const MetricCard = ({ title, value, description, icon: Icon, accent, glow, theme }: Metric & { theme: 'light' | 'dark' }) => {
  const accentClass = theme === 'dark' ? accent.dark : accent.light
  const glowClass = theme === 'dark' ? glow.dark : glow.light

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={`${cardBase} bg-gradient-to-br`}
      style={{ boxShadow: theme === 'dark' ? '0px 22px 60px rgba(3,7,18,0.55)' : '0px 18px 48px rgba(15,23,42,0.12)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClass}`} />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-80 ${glowClass}`}
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black dark:text-slate-300">{title}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-black dark:text-white">{value}</span>
          </div>
          <p className="mt-3 text-sm text-black dark:text-slate-300">{description}</p>
        </div>
        <motion.div
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-black shadow-inner dark:bg-white/10 dark:text-white/90"
          whileHover={{ rotate: 6 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  )
}

const QuickActionCard = ({ title, description, icon: Icon, tone, theme }: QuickAction & { theme: 'light' | 'dark' }) => (
  <motion.button
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.995 }}
    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    className={`group relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 text-left text-sm font-semibold transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${tone[theme]} ${
      theme === 'light' ? 'text-black' : 'text-slate-100'
    }`}
    type="button"
    style={{
      backdropFilter: 'blur(18px)',
    }}
  >
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(129,140,248,0.25) 45%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(129,140,248,0.25) 0%, rgba(59,130,246,0.18) 45%, transparent 100%)',
      }}
    />
    <div className="relative z-10 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black dark:text-slate-200">
      <Icon className="h-4 w-4" />
      {title}
    </div>
    <p
      className={`relative z-10 text-xs leading-relaxed font-medium ${
        theme === 'dark' ? 'text-slate-200' : 'text-black'
      }`}
    >
      {description}
    </p>
    <span
      className={`relative z-10 mt-auto inline-flex items-center gap-1 text-xs font-semibold ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}
    >
      Abrir <ArrowUpRight className="h-3 w-3" />
    </span>
  </motion.button>
)

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem('golffox-theme')
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState(navItems[0].label)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    window.localStorage.setItem('golffox-theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  const averageOccupancy = useMemo(() => {
    const total = occupancyData.reduce((acc, item) => acc + item.occupancy, 0)
    return Math.round(total / occupancyData.length)
  }, [])

  const statusChips: StatusChip[] = useMemo(
    () => [
      {
        label: 'Operação estável',
        description: `Ocupação média de ${averageOccupancy}%`,
        tone: {
          light:
            'border-emerald-200/70 bg-emerald-100/80 text-black shadow-[0_18px_35px_rgba(16,185,129,0.18)] hover:shadow-[0_22px_45px_rgba(16,185,129,0.28)]',
          dark: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100 hover:border-emerald-300/60 hover:shadow-[0_22px_45px_rgba(16,185,129,0.32)]',
        },
      },
      {
        label: 'Monitorar rotas',
        description: 'Mantenha o desvio das rotas abaixo de 10%',
        tone: {
          light:
            'border-amber-200/70 bg-amber-100/80 text-black shadow-[0_18px_35px_rgba(245,158,11,0.18)] hover:shadow-[0_22px_45px_rgba(245,158,11,0.28)]',
          dark: 'border-amber-400/40 bg-amber-500/15 text-amber-100 hover:border-amber-300/60 hover:shadow-[0_22px_45px_rgba(245,158,11,0.32)]',
        },
      },
      {
        label: 'Alertas pendentes',
        description: '1 tarefa urgente',
        tone: {
          light:
            'border-rose-200/70 bg-rose-100/80 text-black shadow-[0_18px_35px_rgba(244,63,94,0.18)] hover:shadow-[0_22px_45px_rgba(244,63,94,0.28)]',
          dark: 'border-rose-400/40 bg-rose-500/15 text-rose-100 hover:border-rose-300/60 hover:shadow-[0_22px_45px_rgba(244,63,94,0.32)]',
        },
      },
    ],
    [averageOccupancy],
  )

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

const backgroundClass =
  theme === 'dark' ? 'bg-[#040712] text-slate-100' : 'bg-[#f4f6ff] text-slate-950'

  const orbTransition = { duration: 18, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${backgroundClass}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.32),_transparent_60%)] transition-all duration-700" />
        <div
          className={`absolute inset-0 opacity-40 transition-all duration-700 ${
            theme === 'dark'
              ? 'mix-blend-soft-light bg-[linear-gradient(120deg,_rgba(15,23,42,0.12)_0%,_rgba(59,130,246,0.18)_45%,_transparent_90%)]'
              : 'bg-[linear-gradient(120deg,_rgba(15,23,42,0.06)_0%,_rgba(59,130,246,0.08)_45%,_transparent_90%)]'
          }`}
        />
        <motion.div
          className={`absolute -top-32 left-[-10%] h-[28rem] w-[28rem] rounded-full blur-[160px] ${
            theme === 'dark' ? 'bg-indigo-500/35' : 'bg-indigo-300/40'
          }`}
          animate={{ x: theme === 'dark' ? 30 : 50, y: 40 }}
          initial={{ x: 0, y: 0 }}
          transition={orbTransition}
        />
        <motion.div
          className={`absolute -bottom-40 right-[-18%] h-[32rem] w-[32rem] rounded-full blur-[160px] ${
            theme === 'dark' ? 'bg-sky-500/30' : 'bg-sky-300/35'
          }`}
          animate={{ x: theme === 'dark' ? -40 : -20, y: -30 }}
          initial={{ x: 0, y: 0 }}
          transition={orbTransition}
        />
        <motion.div
          className={`absolute top-1/3 left-[15%] h-64 w-64 rounded-full blur-[140px] ${
            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-300/25'
          }`}
          animate={{ y: theme === 'dark' ? -25 : -15 }}
          initial={{ y: 0 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/45 via-white/15 to-transparent dark:from-black/50 dark:via-black/20" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-12">
          <aside
            className={`${cardBase} hidden w-64 flex-shrink-0 flex-col gap-5 border-slate-200/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/[0.05] lg:flex`}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/40">
                🦊
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black dark:text-indigo-300">Golf Fox Admin</p>
                <span className="text-sm font-semibold text-black dark:text-slate-100">Premium 9.0</span>
              </div>
            </div>

            <LayoutGroup>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = item.label === activeNav
                  return (
                    <motion.button
                      key={item.label}
                      type="button"
                      layout
                      onClick={() => setActiveNav(item.label)}
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                        isActive
                          ? 'text-white drop-shadow-[0_6px_16px_rgba(15,23,42,0.28)]'
                          : 'text-black hover:text-black dark:text-slate-300 dark:hover:text-white'
                      }`}
                      style={{ backdropFilter: 'blur(18px)' }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="navHighlight"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/90 to-sky-500/70 shadow-[0_12px_40px_rgba(59,130,246,0.35)]"
                          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                    </motion.button>
                  )
                })}
              </nav>
            </LayoutGroup>
          </aside>

          <main className="flex flex-1 flex-col gap-8">
            <header
              className={`${cardBase} flex items-center justify-between gap-4 border-slate-200/60 bg-white/85 px-6 py-6 dark:border-white/10 dark:bg-white/[0.06]`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black dark:text-indigo-300">Golf Fox Admin</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-2xl font-semibold">
                  Painel
                  <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-black backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                    Visão geral em processamento
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleTheme}
                type="button"
                className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-slate-200/70 bg-white/80 px-2 py-2 text-sm font-semibold text-black shadow-[0_16px_35px_rgba(15,23,42,0.12)] transition-all duration-500 hover:shadow-[0_20px_45px_rgba(99,102,241,0.18)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-[0_26px_60px_rgba(2,6,23,0.55)] dark:hover:shadow-[0_32px_70px_rgba(8,12,24,0.6)]"
                style={{ backdropFilter: 'blur(18px)' }}
              >
                <motion.span
                  layout
                  className={`absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-indigo-500/85 to-sky-500/65 transition-opacity duration-500 ${
                    theme === 'dark' ? 'opacity-90' : 'opacity-0'
                  }`}
                />
                <span className="relative flex items-center gap-3 px-2">
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black shadow-inner shadow-white/40 dark:bg-white/10 dark:text-white/90"
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </motion.span>
                  <span className="flex flex-col text-left">
                    <span>{theme === 'light' ? 'Modo escuro' : 'Modo claro'}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-black dark:text-slate-300">
                      {theme === 'light' ? 'Inspiração noir' : 'Experiência luminosa'}
                    </span>
                  </span>
                </span>
              </motion.button>
            </header>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} theme={theme} />
              ))}
            </div>

            <section
              className={`${cardBase} flex flex-col gap-6 border-slate-200/60 bg-white/90 dark:border-white/10 dark:bg-white/[0.04]`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Ocupação por hora</h2>
                  <p className="text-sm text-black dark:text-slate-300">
                    Monitore picos e vales de carregamento das rotas para otimizar a frota.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200/60 bg-white/80 px-3 py-1 text-xs font-semibold text-black backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                  Hoje · Sincronização ao vivo
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.2)" />
                    <XAxis dataKey="hour" stroke="rgba(100,116,139,0.6)" tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="rgba(100,116,139,0.6)"
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={tooltipStyles(theme)}
                      labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                      formatter={(value: number) => [`${value}% de ocupação`, '']}
                    />
                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              {statusChips.map((chip) => (
                <motion.span
                  key={chip.label}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`${pillBase} ${chip.tone[theme]} shadow-sm`}
                >
                  {chip.label}
                  <span className="text-xs font-normal text-black dark:text-slate-200/90">{chip.description}</span>
                </motion.span>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {quickActions.map((action) => (
                <QuickActionCard key={action.title} {...action} theme={theme} />
              ))}
            </div>

            <section className="grid gap-5 xl:grid-cols-2">
              <motion.div
                whileHover={{ y: -4 }}
                className={`${cardBase} flex items-center justify-between gap-4 border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-white/60 to-transparent text-black dark:border-rose-500/30 dark:bg-gradient-to-br dark:from-rose-500/15 dark:via-rose-500/5 dark:to-transparent dark:text-rose-100`}
              >
                <div className="relative flex items-start gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-rose-500 shadow-inner shadow-rose-200/50 dark:bg-white/10 dark:text-rose-100">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Alerta crítico: veículo parado há 2 minutos.</p>
                    <p className="text-xs text-black dark:text-rose-100/90">
                      Rota 4 · Ônibus GHI-7890 — assistência avançada já foi acionada e está a caminho.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  className="rounded-full border border-current px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white/20"
                >
                  Abrir alerta
                </motion.button>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className={`${cardBase} border-slate-200/60 bg-white/90 dark:border-white/10 dark:bg-white/[0.05]`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-black dark:text-slate-200">Insights da IA</p>
                  <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                    Atualizado agora
                  </span>
                </div>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-black dark:text-slate-200">
                  <p>
                    Ocupação média semanal avançou para{' '}
                  <span className="font-semibold text-black dark:text-indigo-200">+8%</span> e mantém tendência ascendente nos picos das 07h.
                  </p>
                  <div className="grid gap-2 text-xs font-medium">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      Redirecione o veículo reserva da Rota 3 para a Rota 1 entre 06h e 08h para absorver a demanda premium.
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-sky-400" />
                      Ative modo de climatização inteligente para reduzir consumo em 4% durante trajetos noturnos.
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <footer className="relative mt-10 border-t border-slate-200/60 pt-6 text-xs text-black dark:border-white/10 dark:text-slate-500">
              <div className="absolute -top-px left-0 h-px w-24 bg-gradient-to-r from-indigo-500/60 via-sky-400/60 to-transparent dark:from-indigo-400/80 dark:via-sky-400/60" />
              Última sincronização às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Telemetria proprietária Golf Fox conectada.
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

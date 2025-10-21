import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
  Route,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
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
  accentClass: string
}

type StatusChip = {
  label: string
  description: string
  tone: string
}

type QuickAction = {
  title: string
  description: string
  icon: LucideIcon
  tone: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Map', icon: Map },
  { label: 'Routes', icon: Route },
  { label: 'Vehicles', icon: Bus },
  { label: 'Drivers', icon: Users },
  { label: 'Companies', icon: Building2 },
  { label: 'Permissions', icon: ShieldCheck },
  { label: 'Support', icon: LifeBuoy },
  { label: 'Alerts', icon: Bell },
  { label: 'Reports', icon: FileBarChart },
  { label: 'History', icon: History },
  { label: 'Costs', icon: Wallet2 },
]

const metrics: Metric[] = [
  {
    title: 'Passengers in transit',
    value: '65',
    description: '+12% versus yesterday',
    icon: Users,
    accentClass: 'from-indigo-500/10 to-indigo-500/0 text-indigo-600 dark:text-indigo-200',
  },
  {
    title: 'Active vehicles',
    value: '4',
    description: '4/5 operating now',
    icon: Bus,
    accentClass: 'from-sky-500/10 to-sky-500/0 text-sky-600 dark:text-sky-200',
  },
  {
    title: 'Routes today',
    value: '4',
    description: '+3 versus plan',
    icon: Route,
    accentClass: 'from-purple-500/10 to-purple-500/0 text-purple-600 dark:text-purple-200',
  },
  {
    title: 'Critical alerts',
    value: '1',
    description: 'Immediate action required',
    icon: AlertTriangle,
    accentClass: 'from-rose-500/10 to-rose-500/0 text-rose-600 dark:text-rose-200',
  },
]

const quickActions: QuickAction[] = [
  {
    title: 'Track vehicles',
    description: 'Live map with second-by-second geolocation',
    icon: Map,
    tone: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-100 dark:hover:bg-indigo-500/20',
  },
  {
    title: 'View analytics',
    description: 'Dashboards by route, fleet and occupancy',
    icon: FileBarChart,
    tone: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-100 dark:hover:bg-blue-500/20',
  },
  {
    title: 'Setup & branding',
    description: 'Notification, theming and integration preferences',
    icon: Settings,
    tone: 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15',
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
  'rounded-2xl border border-slate-200/70 bg-white shadow-sm transition dark:border-white/10 dark:bg-white/5 backdrop-blur'

const pillBase =
  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition'

const tooltipStyles = {
  backgroundColor: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.35)',
  borderRadius: 14,
  color: '#e2e8f0',
  padding: '10px 14px',
}

const MetricCard = ({ title, value, description, icon: Icon, accentClass }: Metric) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`${cardBase} p-6 bg-gradient-to-br ${accentClass}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          {title}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-slate-900 dark:text-white">{value}</span>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{description}</p>
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/70 text-slate-600 shadow-inner dark:bg-white/10 dark:text-white">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
)

const QuickActionCard = ({ title, description, icon: Icon, tone }: QuickAction) => (
  <motion.button
    whileHover={{ scale: 1.02, translateY: -4 }}
    className={`flex w-full flex-col items-start gap-3 rounded-2xl border border-transparent p-5 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${tone}`}
    type="button"
  >
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4" />
      {title}
    </div>
    <p className="text-xs leading-relaxed opacity-80">{description}</p>
    <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium">
      Open <ArrowUpRight className="h-3 w-3" />
    </span>
  </motion.button>
)

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState(navItems[0].label)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('golffox-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    window.localStorage.setItem('golffox-theme', theme)
  }, [theme])

  const averageOccupancy = useMemo(() => {
    const total = occupancyData.reduce((acc, item) => acc + item.occupancy, 0)
    return Math.round(total / occupancyData.length)
  }, [])

  const statusChips: StatusChip[] = useMemo(
    () => [
      {
        label: 'Stable operation',
        description: `Average occupancy ${averageOccupancy}%`,
        tone: 'border-emerald-200 bg-emerald-100 text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.25)] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100',
      },
      {
        label: 'Monitor routes',
        description: 'Keep route deviation below 10%',
        tone: 'border-amber-200 bg-amber-100 text-amber-700 shadow-[0_8px_20px_rgba(245,158,11,0.25)] dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100',
      },
      {
        label: 'Pending alerts',
        description: '1 urgent task',
        tone: 'border-rose-200 bg-rose-100 text-rose-700 shadow-[0_8px_20px_rgba(244,63,94,0.25)] dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100',
      },
    ],
    [averageOccupancy],
  )

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside
          className={`${cardBase} hidden w-64 flex-shrink-0 flex-col gap-5 border-slate-200/80 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-white/5 lg:flex`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg">
              🦊
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500/80">Golf Fox Admin</p>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Premium 9.0</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === activeNav
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveNav(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.35)]'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex flex-1 flex-col gap-6">
          <header className={`${cardBase} flex items-center justify-between gap-4 border-slate-200/80 bg-white/85 px-6 py-5 shadow-md dark:border-white/5 dark:bg-white/5`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500/70">Golf Fox Admin</p>
              <div className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                Dashboard
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-300">
                  Rendering overview
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Dark mode
            </motion.button>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>

          <section className={`${cardBase} flex flex-col gap-6 border-slate-200/80 bg-white/90 p-6 shadow-md dark:border-white/10 dark:bg-white/5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Occupancy by hour</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300">Monitor route load peaks and troughs to optimise fleet usage.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-200">
                Today · Live sync
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
                    contentStyle={tooltipStyles}
                    labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                    formatter={(value: number) => [`${value}% occupancy`, '']}
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
              <span key={chip.label} className={`${pillBase} ${chip.tone}`}>
                {chip.label}
                <span className="text-xs font-normal opacity-80">{chip.description}</span>
              </span>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className={`${cardBase} flex items-center justify-between gap-3 border-rose-200/70 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">1 critical alert requires immediate action.</p>
                  <p className="text-xs opacity-80">Vehicle GHI-7890 stopped — assistance dispatched 2 minutes ago.</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-current px-3 py-1 text-xs font-semibold transition hover:bg-white/20"
              >
                Open alert
              </button>
            </div>
            <div className={`${cardBase} border-slate-200/80 bg-white/80 px-6 py-5 shadow-md dark:border-white/10 dark:bg-white/10`}>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-200">AI insights</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                Weekly occupancy trend up by <span className="font-semibold text-indigo-600 dark:text-indigo-200">+8%</span>. Consider migrating one standby vehicle from Route 3 to Route 1 between 06h and 08h to absorb peak demand.
              </p>
            </div>
          </section>

          <footer className="pb-6 text-xs text-slate-400 dark:text-slate-500">
            Last synced {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Data powered by Golf Fox telemetry network.
          </footer>
        </main>
      </div>
    </div>
  )
}

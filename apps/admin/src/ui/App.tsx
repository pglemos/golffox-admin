import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  ChevronRight,
  Menu,
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

const brand = {
  bg: '#0D0F14',
  card: 'rgba(255,255,255,0.08)',
  stroke: 'rgba(255,255,255,0.12)',
  primary: '#2563EB',
  accent: '#F97316',
  success: '#22C55E',
}

const glass = 'backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_5px_35px_rgba(0,0,0,0.4)]'

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } },
}

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <motion.button
    whileHover={{ scale: 1.07, x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-gradient-to-r from-blue-600/50 to-blue-400/20 text-white' : 'text-gray-300 hover:bg-white/5'
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
)

interface MetricCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  sub?: string | JSX.Element
  tone?: string
}

const MetricCard = ({ icon: Icon, title, value, sub, tone = brand.primary }: MetricCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(37,99,235,0.25)' }}
    className={`rounded-2xl p-5 ${glass} transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-300">{title}</div>
        <div className="mt-1 text-3xl font-semibold text-white animate-fadeIn">{value}</div>
        {sub ? <div className="mt-1 text-xs text-slate-400">{sub}</div> : null}
      </div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="p-3 rounded-xl bg-white/10 border border-white/10"
      >
        <Icon size={22} color={tone} />
      </motion.div>
    </div>
  </motion.div>
)

interface QuickActionProps {
  title: string
  desc: string
  onClick: () => void
  tone?: string
}

const QuickAction = ({ title, desc, onClick, tone = brand.primary }: QuickActionProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
    className={`rounded-2xl p-5 w-full text-left ${glass} transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white font-semibold text-lg">{title}</div>
        <div className="text-sm text-slate-400 mt-1">{desc}</div>
      </div>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.3, repeat: Infinity }}
        className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 border border-white/10"
      >
        <ChevronRight />
      </motion.div>
    </div>
    <div className="mt-3 h-1 rounded-full" style={{ background: tone, opacity: 0.4 }} />
  </motion.button>
)

interface KPIState {
  emTransito: number
  veiculosAtivos: number
  veiculosTotais: number
  rotasDia: number
  alertasCriticos: number
}

interface DashboardPageProps {
  kpis: KPIState
  goto: (path: string) => void
  aiSummary: string
  chartData: Array<{ hora: string; ocupacao: number }>
}

const DashboardPage = ({ kpis, goto, aiSummary, chartData }: DashboardPageProps) => (
  <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MetricCard
        icon={Users}
        title="Colaboradores em trânsito"
        value={kpis.emTransito}
        sub="+12% vs ontem"
        tone={brand.success}
      />
      <MetricCard
        icon={Bus}
        title="Veículos ativos"
        value={`${kpis.veiculosAtivos}/${kpis.veiculosTotais}`}
        sub="Operação normal"
      />
      <MetricCard icon={Route} title="Rotas do dia" value={kpis.rotasDia} sub="+3 vs planejado" />
      <MetricCard
        icon={AlertTriangle}
        title="Alertas críticos"
        value={kpis.alertasCriticos}
        sub={<span className="text-red-400">Requer atenção</span>}
        tone="#ef4444"
      />
    </div>

    <div className={`rounded-2xl p-6 ${glass}`}>
      <div className="text-white font-semibold mb-4 text-lg">Ocupação por horário</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
          <XAxis dataKey="hora" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '12px',
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#cbd5f5' }}
          />
          <Line
            type="monotone"
            dataKey="ocupacao"
            stroke={brand.primary}
            strokeWidth={3}
            dot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: brand.accent, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div>
      <div className="text-white font-semibold mb-4 text-lg">Ações rápidas</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction title="Rastrear veículos" desc="Acompanhe localização em tempo real" onClick={() => goto('/mapa')} />
        <QuickAction
          title="Ver análises"
          desc="Métricas e relatórios detalhados"
          onClick={() => goto('/relatorios')}
          tone={brand.accent}
        />
        <QuickAction
          title="Configurações"
          desc="Preferências e personalizações"
          onClick={() => goto('/config')}
          tone="#A3A3A3"
        />
      </div>
    </div>

    <motion.div
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`rounded-2xl p-4 border ${glass} border-red-500/30 bg-red-500/10`}
    >
      <div className="flex items-center gap-3 text-red-300">
        <AlertTriangle /> {kpis.alertasCriticos} alerta(s) precisam de atenção imediata!
      </div>
    </motion.div>

    <div className={`rounded-2xl p-6 ${glass}`}>
      <div className="text-white font-semibold mb-2 text-lg">Insights da IA</div>
      <p className="text-sm text-slate-300 leading-relaxed">{aiSummary}</p>
    </div>
  </motion.div>
)

export default function AdminPremiumResponsive() {
  const [route, setRoute] = useState('/')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sb = useMemo(() => supabaseClient, [])
  const [aiSummary, setAiSummary] = useState('Carregando insights inteligentes...')
  const [kpis, setKpis] = useState<KPIState>({
    emTransito: 65,
    veiculosAtivos: 4,
    veiculosTotais: 5,
    rotasDia: 4,
    alertasCriticos: 1,
  })

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    let active = true
    const loadAIAssistant = async () => {
      try {
        const res = await aiSuggest({ type: 'report' })
        if (active && res.summary) setAiSummary(res.summary)
      } catch (err) {
        console.warn('[admin] IA fallback', err)
        if (active) setAiSummary('Operação estável. Continue monitorando ocupação e alertas críticos.')
      }
    }
    loadAIAssistant()
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
        console.warn(`[admin] Falha ao consultar ${table}:`, error.message)
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
            alertasCriticos: Math.max(prev.alertasCriticos, (driverPositions ?? prev.emTransito) > 80 ? 2 : prev.alertasCriticos),
          }))
        }
      } catch (error) {
        console.warn('[admin] Falha ao carregar KPIs (usando fallback)', error)
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

  const goto = (path: string) => {
    setRoute(path)
    if (isMobile) setSidebarOpen(false)
  }

  const navItems: Array<{ icon: LucideIcon; label: string; path: string }> = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: MapIcon, label: 'Mapa', path: '/mapa' },
    { icon: Route, label: 'Rotas', path: '/rotas' },
    { icon: Bus, label: 'Veículos', path: '/veiculos' },
    { icon: Users, label: 'Motoristas', path: '/motoristas' },
    { icon: Building2, label: 'Empresas', path: '/empresas' },
    { icon: ShieldCheck, label: 'Permissões', path: '/permissoes' },
    { icon: LifeBuoy, label: 'Socorro', path: '/socorro' },
    { icon: Bell, label: 'Alertas', path: '/alertas' },
    { icon: FileBarChart, label: 'Relatórios', path: '/relatorios' },
    { icon: History, label: 'Histórico', path: '/historico' },
    { icon: Wallet2, label: 'Custos', path: '/custos' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1116] via-[#111827] to-[#0B0F14] text-white flex flex-col overflow-hidden">
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-lg shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen((open) => !open)}>
              <Menu size={22} />
            </button>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10"
            >
              🦊
            </motion.div>
            <div className="font-semibold text-lg sm:text-xl tracking-wide">Golf Fox Admin • Premium 9.0</div>
          </div>
          <button className={`px-4 py-2 rounded-lg border border-white/10 ${glass} hover:bg-white/10 transition flex items-center gap-2`}>
            <Settings size={16} /> Preferências
          </button>
        </div>
      </motion.header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <AnimatePresence>
          {(!isMobile || sidebarOpen) && (
            <motion.aside
              key="sidebar"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-64 p-4 hidden md:flex md:flex-col gap-3"
            >
              <div className={`flex flex-col gap-2 ${glass} rounded-2xl p-3`}>
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={route === item.path}
                    onClick={() => goto(item.path)}
                  />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.main variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {route === '/' ? (
              <DashboardPage key="dashboard" kpis={kpis} goto={goto} aiSummary={aiSummary} chartData={chartData} />
            ) : (
              <motion.div
                key={route}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl p-6 ${glass} text-center text-gray-300`}
              >
                Página {route}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}

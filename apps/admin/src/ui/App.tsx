import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useSpring } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Map as MapIcon,
  Route,
  Bus,
  Users,
  FileBarChart,
  Wallet2,
  Settings,
  AlertTriangle,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Fuel,
  Gauge,
  TrendingUp,
  PieChart,
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
import { EXTRA_ROUTE_LABELS, NAV_ITEMS } from './navigation'

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

const fadeVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.35, ease: 'easeIn' } },
}


type SidebarItemProps = {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
  tokens: typeof themeTokens.dark
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
  sub?: string | JSX.Element
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

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
})

type CostRoute = {
  id: string
  rota: string
  periodo: string
  quilometragem: number
  consumoMedio: number
  custoCombustivel: number
  custoMotorista: number
  custoManutencao: number
  custoOperacional: number
  receitaTotal: number
  margemLucro: number
  custoPorKm: number
  custoPorPassageiro: number
}

const COST_ROUTES: CostRoute[] = [
  {
    id: 'cc1',
    rota: 'Rota Minerva Foods - Turno Manhã',
    periodo: 'Janeiro 2024',
    quilometragem: 1356,
    consumoMedio: 3.6,
    custoCombustivel: 2218.45,
    custoMotorista: 4500,
    custoManutencao: 850,
    custoOperacional: 7568.45,
    receitaTotal: 11250,
    margemLucro: 32.7,
    custoPorKm: 5.58,
    custoPorPassageiro: 8.41,
  },
  {
    id: 'cc2',
    rota: 'Rota JBS - Turno Tarde',
    periodo: 'Janeiro 2024',
    quilometragem: 1584,
    consumoMedio: 3.4,
    custoCombustivel: 2744.12,
    custoMotorista: 4500,
    custoManutencao: 920,
    custoOperacional: 8164.12,
    receitaTotal: 13125,
    margemLucro: 37.8,
    custoPorKm: 5.15,
    custoPorPassageiro: 7.77,
  },
  {
    id: 'cc3',
    rota: 'Rota Marfrig - Turno Noite',
    periodo: 'Janeiro 2024',
    quilometragem: 892,
    consumoMedio: 3.8,
    custoCombustivel: 1382.45,
    custoMotorista: 4800,
    custoManutencao: 650,
    custoOperacional: 6832.45,
    receitaTotal: 7500,
    margemLucro: 8.9,
    custoPorKm: 7.66,
    custoPorPassageiro: 11.39,
  },
]

type CostsPageProps = {
  glassClass: string
  tokens: typeof themeTokens.dark
}

const CostsPage = ({ glassClass, tokens }: CostsPageProps) => {
  const totais = useMemo(() => {
    const totalKm = COST_ROUTES.reduce((acc, rota) => acc + rota.quilometragem, 0)
    const totalCombustivel = COST_ROUTES.reduce((acc, rota) => acc + rota.custoCombustivel, 0)
    const totalMotoristas = COST_ROUTES.reduce((acc, rota) => acc + rota.custoMotorista, 0)
    const totalManutencao = COST_ROUTES.reduce((acc, rota) => acc + rota.custoManutencao, 0)
    const totalOperacional = COST_ROUTES.reduce((acc, rota) => acc + rota.custoOperacional, 0)
    const totalReceita = COST_ROUTES.reduce((acc, rota) => acc + rota.receitaTotal, 0)
    const mediaMargem = COST_ROUTES.reduce((acc, rota) => acc + rota.margemLucro, 0) / COST_ROUTES.length
    const mediaConsumo = COST_ROUTES.reduce((acc, rota) => acc + rota.consumoMedio, 0) / COST_ROUTES.length
    const custoMedioKm = totalOperacional / totalKm
    return {
      totalKm,
      totalCombustivel,
      totalMotoristas,
      totalManutencao,
      totalOperacional,
      totalReceita,
      lucroTotal: totalReceita - totalOperacional,
      mediaMargem,
      mediaConsumo,
      custoMedioKm,
      percentualCombustivel: (totalCombustivel / totalOperacional) * 100,
      percentualMotoristas: (totalMotoristas / totalOperacional) * 100,
      percentualManutencao: (totalManutencao / totalOperacional) * 100,
    }
  }, [])

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-left">
      <div className="space-y-1">
        <h1 className={`text-2xl font-semibold ${tokens.quickTitle}`}>Controle de custos</h1>
        <p className={`text-sm ${tokens.quickDescription}`}>
          Acompanhe os custos operacionais das rotas, identifique oportunidades de economia e proteja a margem de lucro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Wallet2}
          title="Receita consolidada"
          value={currencyFormatter.format(totais.totalReceita)}
          sub={<span className="text-emerald-400">Lucro líquido {currencyFormatter.format(totais.lucroTotal)}</span>}
          tone="#10b981"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={Fuel}
          title="Custo de combustível"
          value={currencyFormatter.format(totais.totalCombustivel)}
          sub={`${numberFormatter.format(totais.percentualCombustivel)}% dos gastos operacionais`}
          tone="#2563eb"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={Gauge}
          title="Custo médio por km"
          value={currencyFormatter.format(totais.custoMedioKm)}
          sub={`${numberFormatter.format(totais.totalKm / 1000)} mil km percorridos`}
          tone="#f97316"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
        <MetricCard
          icon={TrendingUp}
          title="Margem média"
          value={`${numberFormatter.format(totais.mediaMargem)}%`}
          sub={`Consumo médio ${numberFormatter.format(totais.mediaConsumo)} km/l`}
          tone="#a855f7"
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
        />
      </div>

      <div className={`rounded-2xl p-6 ${glassClass}`}>
        <div className={`mb-4 flex items-center gap-2 text-lg font-semibold ${tokens.quickTitle}`}>
          <PieChart size={18} /> Distribuição dos custos operacionais
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide opacity-70">Combustível</div>
            <div className="text-base font-semibold">
              {numberFormatter.format(totais.percentualCombustivel)}%
            </div>
            <div className="text-xs opacity-70">{currencyFormatter.format(totais.totalCombustivel)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide opacity-70">Motoristas</div>
            <div className="text-base font-semibold">{numberFormatter.format(totais.percentualMotoristas)}%</div>
            <div className="text-xs opacity-70">{currencyFormatter.format(totais.totalMotoristas)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide opacity-70">Manutenção</div>
            <div className="text-base font-semibold">{numberFormatter.format(totais.percentualManutencao)}%</div>
            <div className="text-xs opacity-70">{currencyFormatter.format(totais.totalManutencao)}</div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-6 ${glassClass}`}>
        <div className={`mb-4 text-lg font-semibold ${tokens.quickTitle}`}>Detalhamento por rota</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="uppercase tracking-wide opacity-70">
              <tr>
                <th className="py-2 pr-4 font-medium">Rota</th>
                <th className="py-2 pr-4 font-medium">Período</th>
                <th className="py-2 pr-4 font-medium">Quilometragem</th>
                <th className="py-2 pr-4 font-medium">Custo combustível</th>
                <th className="py-2 pr-4 font-medium">Custo operacional</th>
                <th className="py-2 pr-4 font-medium">Receita</th>
                <th className="py-2 pr-4 font-medium">Margem</th>
                <th className="py-2 font-medium">Custo/km</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {COST_ROUTES.map((rota) => (
                <tr key={rota.id} className="align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{rota.rota}</div>
                    <div className="text-xs opacity-70">Consumo {numberFormatter.format(rota.consumoMedio)} km/l</div>
                  </td>
                  <td className="py-3 pr-4">{rota.periodo}</td>
                  <td className="py-3 pr-4">{integerFormatter.format(rota.quilometragem)} km</td>
                  <td className="py-3 pr-4">
                    <div>{currencyFormatter.format(rota.custoCombustivel)}</div>
                    <div className="text-xs opacity-70">{currencyFormatter.format(rota.custoCombustivel / rota.quilometragem)} por km</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{currencyFormatter.format(rota.custoOperacional)}</div>
                    <div className="text-xs opacity-70">Motorista {currencyFormatter.format(rota.custoMotorista)}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{currencyFormatter.format(rota.receitaTotal)}</div>
                    <div className="text-xs opacity-70">
                      Lucro {currencyFormatter.format(rota.receitaTotal - rota.custoOperacional)}
                    </div>
                  </td>
                  <td className="py-3 pr-4">{numberFormatter.format(rota.margemLucro)}%</td>
                  <td className="py-3">
                    <div>{currencyFormatter.format(rota.custoPorKm)}</div>
                    <div className="text-xs opacity-70">
                      {currencyFormatter.format(rota.custoPorPassageiro)} por passageiro
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`rounded-2xl p-6 ${glassClass}`}>
        <div className={`mb-3 text-lg font-semibold ${tokens.quickTitle}`}>Recomendações inteligentes</div>
        <ul className={`space-y-2 text-sm ${tokens.quickDescription}`}>
          <li>
            • Programar treinamentos de condução econômica para manter o consumo médio acima de {numberFormatter.format(
              totais.mediaConsumo,
            )} km/l.
          </li>
          <li>
            • Avaliar renegociação de contratos de manutenção preventiva para reduzir o impacto de {numberFormatter.format(
              totais.percentualManutencao,
            )}% sobre os custos.
          </li>
          <li>
            • Priorizar rotas com margem acima de {numberFormatter.format(totais.mediaMargem)}% e revisar preços nas demais.
          </li>
        </ul>
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

type DashboardPageProps = {
  kpis: KPIState
  goto: (path: string) => void
  aiSummary: string
  chartData: Array<{ hora: string; ocupacao: number }>
  glassClass: string
  statuses: StatusBadge[]
  tokens: typeof themeTokens.dark
}

const DashboardPage = ({ kpis, goto, aiSummary, chartData, glassClass, statuses, tokens }: DashboardPageProps) => (
  <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MetricCard
        icon={Users}
        title="Passageiros em trânsito"
        value={kpis.emTransito}
        sub="+12% em relação a ontem"
        tone={brand.success}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Bus}
        title="Veículos ativos"
        value={kpis.veiculosAtivos}
        sub={`${kpis.veiculosAtivos}/${kpis.veiculosTotais} em operação agora`}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Route}
        title="Rotas hoje"
        value={kpis.rotasDia}
        sub="+3 em relação ao planejado"
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={AlertTriangle}
        title="Alertas críticos"
        value={kpis.alertasCriticos}
        sub={<span className="text-red-400">Ação imediata necessária</span>}
        tone="#ef4444"
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
    </div>

    <motion.div className={`rounded-2xl p-6 transition-all ${glassClass}`} layout>
      <div className={`font-semibold mb-4 text-lg flex items-center gap-2 ${tokens.quickTitle}`}>
        <Route size={16} /> Ocupação por horário
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
      <div className={`font-semibold mb-2 text-lg ${tokens.quickTitle}`}>Ações rápidas</div>
      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-2 md:pb-0 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
        <QuickAction
          title="Acompanhar veículos"
          description="Mapa ao vivo com geolocalização em tempo real"
          onClick={() => goto('/map')}
          icon={MapIcon}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="Ver análises"
          description="Dashboards por rota, frota e ocupação"
          onClick={() => goto('/reports')}
          tone={brand.accent}
          icon={FileBarChart}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="Configurações e marca"
          description="Notificações, tema e integrações preferidas"
          onClick={() => goto('/settings')}
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
        <AlertTriangle className="animate-pulse" /> {kpis.alertasCriticos} alertas críticos exigem ação imediata.
      </div>
    </motion.div>

    <motion.div className={`rounded-2xl p-6 transition-all ${glassClass}`} layout>
      <div className={`font-semibold mb-2 text-lg ${tokens.quickTitle}`}>Insights da IA</div>
      <p className="text-sm leading-relaxed opacity-80">{aiSummary}</p>
    </motion.div>
  </motion.div>
)

export default function AdminPremiumResponsive() {
  const [route, setRoute] = useState('/')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [aiSummary, setAiSummary] = useState('Carregando insights inteligentes...')
  const sb = useMemo(() => supabaseClient, [])
  const [kpis, setKpis] = useState<KPIState>({
    emTransito: 65,
    veiculosAtivos: 4,
    veiculosTotais: 5,
    rotasDia: 4,
    alertasCriticos: 1,
  })

  const isLight = theme === 'light'
  const tokens = themeTokens[theme]
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
          setAiSummary('Operações estáveis. Continue monitorando a ocupação, rotas críticas e alertas em tempo real.')
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
        label: 'Operação estável',
        tone: tokens.statusChip.emerald,
        description: `Ocupação média de ${kpis.emTransito}%`,
      },
      {
        icon: '🟠',
        label: 'Monitorar rotas',
        tone: tokens.statusChip.amber,
        description: 'Mantenha o desvio de rota abaixo de 10%',
      },
      {
        icon: '🔴',
        label: 'Alertas pendentes',
        tone: tokens.statusChip.rose,
        description: `${kpis.alertasCriticos} tarefas urgentes`,
      },
    ],
    [kpis.alertasCriticos, kpis.emTransito, tokens]
  )

  const goto = (path: string) => {
    setRoute(path)
    if (isMobile) setSidebarOpen(false)
  }

  const navItems = NAV_ITEMS
  const fallbackLabel =
    navItems.find((item) => item.path === route)?.label ?? EXTRA_ROUTE_LABELS[route] ?? route

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${tokens.background}`}>
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/70 text-white px-4 py-1 text-xs tracking-wide shadow-lg">
        Carregando painel Golf Fox Admin…
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
          {isLight ? 'Modo escuro' : 'Modo claro'}
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
            ) : route === '/costs' ? (
              <CostsPage key="costs" glassClass={glassClass} tokens={tokens} />
            ) : (
              <motion.div
                key={route}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl p-6 text-center text-sm md:text-base ${glassClass}`}
              >
                <div className="text-lg font-semibold mb-2">Em breve</div>
                A página {fallbackLabel} está em desenvolvimento.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}

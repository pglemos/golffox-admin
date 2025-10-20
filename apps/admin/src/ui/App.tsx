import { useMemo, useState } from 'react'
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
  Headset,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  HelpCircle,
  Clock,
  FileText,
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
import Reports from '@/components/Reports'

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

const RESPONSAVEL_PADRAO = 'Equipe de Segurança'

const NAV_ITEMS = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'rotas', label: 'Rotas', icon: Bus },
  { id: 'empresas', label: 'Empresas', icon: Building2 },
  { id: 'permissions', label: 'Permissões', icon: ShieldCheck },
] as const

type ActiveView = (typeof NAV_ITEMS)[number]['id']

type PermissionArea = {
  id: string
  titulo: string
  descricao: string
}

const REPORTS_ROUTE = '/reports'
const REPORTS_ROUTE_ALIASES = new Set([REPORTS_ROUTE, '/relatorios'])

type SidebarItemProps = {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
  tokens: typeof themeTokens.dark
}

type ActivityLogEntry = {
  id: number
  perfil: string
  acao: string
  horario: string
  responsavel: string
}

const PERMISSION_AREAS: PermissionArea[] = [
  {
    id: 'painel_completo',
    titulo: 'Painel de Gestão Completo',
    descricao:
      'Acesso integral a configurações, integrações, monitoramento em tempo real e auditoria das políticas de segurança.',
  },
  {
    id: 'painel_visualizacao',
    titulo: 'Painel de Gestão (Visualização)',
    descricao: 'Indicadores operacionais em modo somente leitura para líderes que acompanham a operação.',
  },
  {
    id: 'operacoes',
    titulo: 'Centro de Operações',
    descricao: 'Ferramentas diárias de despacho de rotas, alocação de veículos e atendimento de ocorrências.',
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro e Contratos',
    descricao: 'Controle de custos, auditoria de viagens, faturamento e indicadores de metas contratuais.',
  },
  {
    id: 'alertas',
    titulo: 'Central de Alertas',
    descricao: 'Monitoramento de riscos, SLA de atendimento e escalonamento de incidentes críticos.',
  },
]

const INITIAL_PERMISSION_PROFILES: PermissionProfile[] = [
  {
    id: 'perfil-admin',
    nome: 'Administrador Master',
    descricao: 'Perfil padrão com acesso completo e bloqueio contra alterações para garantir a governança.',
    permissoes: PERMISSION_AREAS.map((area) => area.id),
    ultimaAtualizacao: '15/07/2024 09:40',
    responsavel: 'Carla Ribeiro',
    bloqueado: true,
    fixo: true,
  },
  {
    id: 'perfil-operacoes',
    nome: 'Equipe de Operações',
    descricao: 'Equipe que coordena o dia a dia da frota e atende chamados de campo.',
    permissoes: ['painel_visualizacao', 'operacoes', 'alertas'],
    ultimaAtualizacao: '12/07/2024 18:20',
    responsavel: 'Roberto Lima',
  },
  {
    id: 'perfil-financeiro',
    nome: 'Time Financeiro',
    descricao: 'Time responsável por contratos, custos e indicadores financeiros dos clientes Golffox.',
    permissoes: ['painel_visualizacao', 'financeiro'],
    ultimaAtualizacao: '10/07/2024 14:05',
    responsavel: 'Marina Alves',
  },
]

const INITIAL_ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: 1,
    perfil: 'Equipe de Operações',
    acao: 'Permissões revisadas com acesso adicional à Central de Alertas.',
    horario: 'Hoje • 08:32',
    responsavel: 'Ana Souza',
  },
  {
    id: 2,
    perfil: 'Time Financeiro',
    acao: 'Perfil atualizado com novos indicadores de custo.',
    horario: 'Ontem • 17:18',
    responsavel: 'Marina Alves',
  },
  {
    id: 3,
    perfil: 'Administrador Master',
    acao: 'Revisão automática de segurança concluída.',
    horario: '12/07/2024 • 21:44',
    responsavel: 'Sistema Golffox',
  },
]

const formatDateTime = () =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())

const PlaceholderView = ({ titulo }: { titulo: string }) => (
  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300/60 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
    <div>
      <p className="font-semibold">{titulo}</p>
      <p className="mt-2 text-xs">Esta área está em construção. Utilize o menu lateral para acessar "Permissões".</p>
    </div>
  </div>
)

type ModalState = {
  aberto: boolean
  modo: 'criar' | 'editar'
}

type FormState = {
  nome: string
  descricao: string
  responsavel: string
}

const PermissionsWorkspace = ({ isLight }: { isLight: boolean }) => {
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(INITIAL_PERMISSION_PROFILES)
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(INITIAL_ACTIVITY_LOG)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(INITIAL_PERMISSION_PROFILES[0]?.id ?? null)
  const [modalState, setModalState] = useState<ModalState>({ aberto: false, modo: 'criar' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<FormState>({ nome: '', descricao: '', responsavel: '' })
  const [tempPermissions, setTempPermissions] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const areasById = useMemo(() => {
    const mapa = new Map<string, PermissionArea>()
    PERMISSION_AREAS.forEach((area) => mapa.set(area.id, area))
    return mapa
  }, [])

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

    return permissionProfiles.filter((profile) => {
      const base = `${profile.nome} ${profile.descricao} ${profile.responsavel}`.toLowerCase()
      const permissionsText = profile.permissoes
        .map((permissionId) => areasById.get(permissionId)?.titulo ?? permissionId)
        .join(' ')
      if (base.includes(termo) || permissionsText.toLowerCase().includes(termo)) {
        return true
      }
      return false
    })
  }, [areasById, permissionProfiles, searchTerm])

  const selectedProfile = useMemo(
    () => permissionProfiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [permissionProfiles, selectedProfileId],
  )

  const closeModal = () => {
    setModalState((previous) => ({ ...previous, aberto: false }))
    setEditingId(null)
    setTempPermissions([])
    setFormState({ nome: '', descricao: '', responsavel: '' })
    setFormError(null)
  }

  const registerActivity = (perfil: string, acao: string, responsavel?: string) => {
    setActivityLog((prev) => [
      {
        id: Date.now(),
        perfil,
        acao,
        horario: formatDateTime(),
        responsavel: responsavel || RESPONSAVEL_PADRAO,
      },
      ...prev,
    ].slice(0, 25))
  }

type HistoryRegistro = {
  id: string
  titulo: string
  descricao: string
  horario: string
  categoria: 'rota' | 'alerta' | 'exportacao'
  destaque?: string
}

type HistoryResumo = {
  icon: LucideIcon
  titulo: string
  valor: number
  sub: string
  tone?: string
}

type HistoryPageProps = {
  glassClass: string
  tokens: typeof themeTokens.dark
}

type DashboardPageProps = {
  kpis: KPIState
  goto: (path: AdminRoute) => void
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
        sub="+12% versus ontem"
        tone={brand.success}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Bus}
        title="Veículos ativos"
        value={kpis.veiculosAtivos}
        sub={`${kpis.veiculosAtivos}/${kpis.veiculosTotais} operando agora`}
        glassClass={glassClass}
        titleClass={tokens.quickTitle}
      />
      <MetricCard
        icon={Route}
        title="Rotas hoje"
        value={kpis.rotasDia}
        sub="+3 versus o plano"
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
        <Route size={16} /> Ocupação por hora
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
          title="Track vehicles"
          description="Live map with second-by-second geolocation"
          onClick={() => goto('/map')}
          icon={MapIcon}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="View analytics"
          description="Dashboards by route, fleet and occupancy"
          onClick={() => goto('/reports')}
          tone={brand.accent}
          icon={FileBarChart}
          glassClass={glassClass}
          titleClass={tokens.quickTitle}
          descriptionClass={tokens.quickDescription}
        />
        <QuickAction
          title="Setup & branding"
          description="Notification, theming and integration preferences"
          onClick={() => goto('/permissions')}
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

type SupportPageProps = {
  tokens: typeof themeTokens.dark
  glassClass: string
}

const SupportPage = ({ tokens, glassClass }: SupportPageProps) => {
  const canais = [
    {
      titulo: 'Chat em tempo real',
      descricao: 'Converse com especialistas da Golf Fox em português de segunda a sexta das 8h às 20h.',
      icon: MessageCircle,
      acoes: [
        { label: 'Abrir chat web', href: 'https://app.golffox.com/suporte/chat' },
        { label: 'WhatsApp empresarial', href: 'https://wa.me/5511999999999' },
      ],
    },
    {
      titulo: 'Central telefônica',
      descricao: 'Atendimento prioritário para incidentes críticos e emergências operacionais.',
      icon: Phone,
      acoes: [
        { label: 'Ligar para 0800-777-4653', href: 'tel:08007774653' },
        { label: 'Agendar retorno', href: 'https://cal.com/golffox/suporte' },
      ],
    },
    {
      titulo: 'E-mail e portal',
      descricao: 'Abra chamados, envie anexos e acompanhe o histórico completo em tempo real.',
      icon: Mail,
      acoes: [
        { label: 'Enviar e-mail', href: 'mailto:suporte@golffox.com' },
        { label: 'Acessar portal do cliente', href: 'https://app.golffox.com/central' },
      ],
    },
  ] as const

  const faqs = [
    {
      pergunta: 'Como abrir um chamado de emergência?',
      resposta:
        'Priorize o canal telefônico. Informe o código do contrato e a rota afetada para criarmos o ticket automaticamente e acompanhar até a normalização.',
    },
    {
      pergunta: 'Qual o prazo de resposta do suporte?',
      resposta:
        'Chamados críticos recebem primeira resposta em até 10 minutos. Demandas padrão têm SLA de 2 horas úteis e resolução em até 1 dia útil.',
    },
    {
      pergunta: 'Posso acompanhar o status dos tickets?',
      resposta:
        'Sim. Todos os chamados ficam disponíveis no portal com histórico, SLA e responsáveis. Enviamos notificações a cada atualização.',
    },
  ] as const

  const materiais = [
    {
      titulo: 'Guia rápido de incidentes',
      descricao: 'Checklist em 4 passos para restaurar operações críticas com segurança.',
      icon: FileText,
      href: 'https://docs.golffox.com/guias/incident-response.pdf',
    },
    {
      titulo: 'Base de conhecimento',
      descricao: 'Artigos e vídeos sob demanda para administradores e motoristas.',
      icon: BookOpen,
      href: 'https://docs.golffox.com/base-de-conhecimento',
    },
    {
      titulo: 'Treinamento personalizado',
      descricao: 'Agende sessões com especialistas para implantações e integrações.',
      icon: Headset,
      href: 'https://cal.com/golffox/treinamento',
    },
  ] as const

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 text-left">
      <motion.div className={`rounded-2xl p-6 md:p-8 ${glassClass}`} layout>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            <div className={`uppercase text-xs tracking-[0.4em] ${tokens.quickDescription}`}>Suporte</div>
            <h1 className={`text-2xl md:text-3xl font-semibold ${tokens.quickTitle}`}>
              Central de atendimento em português do Brasil
            </h1>
            <p className={`text-sm md:text-base leading-relaxed ${tokens.quickDescription}`}>
              Nossa equipe está disponível para manter as operações rodoviárias em pleno funcionamento. Escolha o canal ideal,
              acompanhe indicadores de SLA em tempo real e consulte materiais de autoatendimento sem sair do painel.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            <div className={`rounded-xl border p-4 ${glassClass}`}>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-emerald-400" />
                <div>
                  <div className={`text-sm font-semibold ${tokens.quickTitle}`}>SLA ativo</div>
                  <p className={`text-xs ${tokens.quickDescription}`}>Tempo médio de resposta atual: 6 minutos</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl border p-4 ${glassClass}`}>
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-amber-400" />
                <div>
                  <div className={`text-sm font-semibold ${tokens.quickTitle}`}>Última atualização</div>
                  <p className={`text-xs ${tokens.quickDescription}`}>Todos os sistemas operacionais em funcionamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {canais.map((canal) => (
          <motion.div
            key={canal.titulo}
            whileHover={{ translateY: -4, scale: 1.01 }}
            className={`rounded-2xl p-6 border ${glassClass} flex flex-col gap-5`}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <canal.icon size={22} />
              </span>
              <div className="space-y-1">
                <div className={`text-lg font-semibold ${tokens.quickTitle}`}>{canal.titulo}</div>
                <p className={`text-sm leading-relaxed ${tokens.quickDescription}`}>{canal.descricao}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canal.acoes.map((acao) => (
                <a
                  key={acao.label}
                  href={acao.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20"
                >
                  {acao.label}
                  <ChevronRight size={14} />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Resumo operacional</div>
          <ul className={`text-sm space-y-3 ${tokens.quickDescription}`}>
            <li>
              <strong className="text-emerald-400">Status:</strong> Atendimento disponível, fila atual com 3 chamados aguardando retorno.
            </li>
            <li>
              <strong className="text-emerald-400">Plantão:</strong> Equipe de plantão com especialistas em telemetria e rotas inteligentes.
            </li>
            <li>
              <strong className="text-emerald-400">Comunicação:</strong> Alertas de indisponibilidade enviados via SMS e e-mail imediatamente.
            </li>
          </ul>
        </motion.div>

        <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Escalonamento</div>
          <p className={`text-sm leading-relaxed ${tokens.quickDescription}`}>
            Caso a solução exceda o SLA comprometido, escalonamos automaticamente para a gerência técnica e mantemos você informado a cada 15 minutos.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Atendimento nível 1 — analistas bilíngues
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Nível 2 — especialistas em integrações e APIs
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Nível 3 — engenharia e produto
            </div>
          </div>
        </motion.div>

        <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Indicadores de satisfação</div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className={tokens.quickDescription}>NPS (últimos 90 dias)</span>
              <span className="text-emerald-400 font-semibold">87</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={tokens.quickDescription}>Tempo médio de resolução</span>
              <span className="text-emerald-400 font-semibold">1h43</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={tokens.quickDescription}>Chamados reabertos</span>
              <span className="text-emerald-400 font-semibold">2%</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
        <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Perguntas frequentes</div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.pergunta} className="group rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/10">
              <summary className={`flex cursor-pointer items-center justify-between text-sm font-semibold ${tokens.quickTitle}`}>
                {faq.pergunta}
                <ChevronRight className="transition-transform group-open:rotate-90" size={16} />
              </summary>
              <p className={`mt-2 text-sm leading-relaxed ${tokens.quickDescription}`}>{faq.resposta}</p>
            </details>
          ))}
        </div>
      </motion.div>

      <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
        <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Materiais de apoio</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materiais.map((material) => (
            <a
              key={material.titulo}
              href={material.href}
              target="_blank"
              rel="noreferrer"
              className={`rounded-2xl border px-5 py-4 transition ${glassClass} hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <material.icon size={20} />
                </span>
                <div>
                  <div className={`text-sm font-semibold ${tokens.quickTitle}`}>{material.titulo}</div>
                  <p className={`text-xs mt-1 leading-relaxed ${tokens.quickDescription}`}>{material.descricao}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminPremiumResponsive() {
  const [route, setRoute] = useState<AdminRoute>('/')
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

  const handleSaveProfile = () => {
    const nome = formState.nome.trim()
    const descricao = formState.descricao.trim()
    const responsavel = formState.responsavel.trim() || RESPONSAVEL_PADRAO

    if (!nome) {
      setFormError('Informe um nome para o perfil.')
      return
    }

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
          setAiSummary(
            'Operação estável. Continue monitorando ocupação, rotas críticas e alertas em tempo real.'
          )
      }
    })()
    return () => {
      active = false
    }

    if (tempPermissions.length === 0) {
      setFormError('Selecione pelo menos uma área de acesso.')
      return
    }

    if (modalState.modo === 'criar') {
      const novoPerfil: PermissionProfile = {
        id: `perfil-${Date.now()}`,
        nome,
        descricao,
        responsavel,
        permissoes: [...tempPermissions],
        ultimaAtualizacao: formatDateTime(),
        bloqueado: false,
      }

      setPermissionProfiles((prev) => [...prev, novoPerfil])
      setSelectedProfileId(novoPerfil.id)
      registerActivity(novoPerfil.nome, 'Perfil criado com sucesso.', responsavel)
    } else if (modalState.modo === 'editar' && editingId) {
      setPermissionProfiles((prev) =>
        prev.map((profile) =>
          profile.id === editingId
            ? {
                ...profile,
                nome,
                descricao,
                responsavel,
                permissoes: [...tempPermissions],
                ultimaAtualizacao: formatDateTime(),
              }
            : profile,
        ),
      )

      const perfilEditado = permissionProfiles.find((profile) => profile.id === editingId)
      registerActivity(nome, 'Permissões atualizadas com sucesso.', responsavel)
      if (perfilEditado?.fixo) {
        setPermissionProfiles((prev) =>
          prev.map((profile) => (profile.id === editingId ? { ...profile, bloqueado: true } : profile)),
        )
      }
    }

    closeModal()
  }

  const permissaoSelecionada = (permissionId: string) => tempPermissions.includes(permissionId)

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900/60'} p-6 shadow-sm`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500/80">Centro de segurança</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Permissões e Perfis de Acesso</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Controle quem pode operar cada parte do ecossistema Golffox, revise logs de auditoria e mantenha todos os perfis em
              português do Brasil.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative sm:min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por perfil, descrição ou responsável"
                className={`w-full rounded-xl border px-4 py-2 pl-9 text-sm outline-none transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    : 'border-slate-700 bg-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-900'
                }`}
              />
            </label>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" /> Novo perfil
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className={`rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900/60'} p-6 shadow-sm`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Perfis configurados</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {filteredProfiles.length} perfil{filteredProfiles.length !== 1 && 's'} disponível{filteredProfiles.length !== 1 && 'is'}.
              </p>
            </div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Clique em um cartão para ver detalhes e ações rápidas.
            </p>
          </div>

  const statuses = useMemo<StatusBadge[]>(
    () => [
      {
        icon: '🟢',
        label: 'Operação estável',
        tone: tokens.statusChip.emerald,
        description: `Ocupação média ${kpis.emTransito}%`,
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
}

  const goto = (path: AdminRoute) => {
    if (route === path) {
      if (isMobile) setSidebarOpen(false)
      return
    }

  const goto = (path: string) => {
    const normalizedPath = REPORTS_ROUTE_ALIASES.has(path) ? REPORTS_ROUTE : path
    setRoute(normalizedPath)
    if (isMobile) setSidebarOpen(false)
  }

  const navItems: Array<{ icon: LucideIcon; label: string; path: string }> = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: MapIcon, label: 'Map', path: '/map' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: Bus, label: 'Vehicles', path: '/vehicles' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: ShieldCheck, label: 'Permissions', path: '/permissions' },
    { icon: LifeBuoy, label: 'Suporte', path: '/support' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: FileBarChart, label: 'Relatórios', path: REPORTS_ROUTE },
    { icon: History, label: 'History', path: '/history' },
    { icon: Wallet2, label: 'Costs', path: '/costs' },
  ]

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${tokens.background}`}>
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/70 text-white px-4 py-1 text-xs tracking-wide shadow-lg">
        Painel Golf Fox carregando…
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

    return (
      <motion.div
        key={route}
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`rounded-2xl p-6 text-center text-sm md:text-base ${glassClass}`}
      >
        <div className="text-lg font-semibold mb-2">Em breve</div>
        <p className="text-slate-500 dark:text-slate-400">
          Estamos preparando esta área com todo cuidado. Volte mais tarde para conferir as novidades.
        </p>
      </motion.div>
    )
  }

  return (
    <div className={isLight ? 'min-h-screen bg-slate-100 text-slate-900' : 'min-h-screen bg-slate-950 text-slate-100'}>
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className={`hidden w-64 flex-shrink-0 flex-col gap-4 rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'} p-6 shadow-sm lg:flex`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500/70">Golffox</p>
              <h1 className="text-lg font-semibold">Painel administrativo</h1>
            </div>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-100">
              v1.0
            </span>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const ativo = item.id === activeView
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    ativo
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex flex-1 flex-col gap-6">
          <header className={`flex items-center justify-between gap-4 rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'} px-5 py-4 shadow-sm`}>
            <div className="lg:hidden">
              <select
                value={activeView}
                onChange={(event) => setActiveView(event.target.value as ActiveView)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900'
                }`}
              >
                {NAV_ITEMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold">
              {NAV_ITEMS.find((item) => item.id === activeView)?.label}
            </div>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isLight ? 'Modo escuro' : 'Modo claro'}
            </button>
          </header>

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
                {adminNavItems.map((item) => (
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
            ) : route === '/support' ? (
              <SupportPage key="support" tokens={tokens} glassClass={glassClass} />
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
                A página {route} está em desenvolvimento.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}

export default App

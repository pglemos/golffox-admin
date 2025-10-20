import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useSpring } from 'framer-motion'
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
  Sun,
  Moon,
  AdjustmentsHorizontal,
  Check,
  Lock,
  Plus,
  Search,
  X,
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

type PermissionArea = {
  id: string
  titulo: string
  descricao: string
}

type PermissionProfile = {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
  ultimaAtualizacao: string
  responsavel: string
  bloqueado?: boolean
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
      'Acesso total aos módulos estratégicos: configurações, integrações, monitoramento em tempo real e políticas de segurança.',
  },
  {
    id: 'painel_visualizacao',
    titulo: 'Painel de Gestão (Visualização)',
    descricao:
      'Indicadores, mapas e relatórios em modo somente leitura para equipes que precisam acompanhar a operação.',
  },
  {
    id: 'operacoes',
    titulo: 'Centro de Operações',
    descricao:
      'Ferramentas do dia a dia operacional, como alocação de veículos, despacho de rotas e atendimento de ocorrências.',
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro e Contratos',
    descricao:
      'Gestão de custos, auditoria de viagens, faturamento e análise de metas contratuais com os clientes.',
  },
  {
    id: 'alertas',
    titulo: 'Central de Alertas',
    descricao: 'Monitoramento e resposta a alertas críticos, SLA de atendimento e indicadores de risco.',
  },
]

const INITIAL_PERMISSION_PROFILES: PermissionProfile[] = [
  {
    id: 'admin',
    nome: 'Administrador Master',
    descricao: 'Perfil padrão da Golffox com acesso completo e políticas de segurança reforçadas.',
    permissoes: PERMISSION_AREAS.map((area) => area.id),
    ultimaAtualizacao: '15/07/2024 09:40',
    responsavel: 'Carla Ribeiro',
    bloqueado: true,
  },
  {
    id: 'operacoes',
    nome: 'Equipe de Operações',
    descricao: 'Aloca veículos, acompanha rotas em tempo real e abre chamados de socorro.',
    permissoes: ['painel_visualizacao', 'operacoes', 'alertas'],
    ultimaAtualizacao: '12/07/2024 18:20',
    responsavel: 'Roberto Lima',
  },
  {
    id: 'financeiro',
    nome: 'Time Financeiro',
    descricao: 'Analisa custos de rota, controla contratos e acompanha indicadores de desempenho.',
    permissoes: ['painel_visualizacao', 'financeiro'],
    ultimaAtualizacao: '10/07/2024 14:05',
    responsavel: 'Marina Alves',
  },
]

const INITIAL_ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: 1,
    perfil: 'Equipe de Operações',
    acao: 'Permissões revisadas: acesso à Central de Alertas incluído.',
    horario: 'Hoje • 08:32',
    responsavel: 'Ana Souza',
  },
  {
    id: 2,
    perfil: 'Time Financeiro',
    acao: 'Exportou relatórios e ajustou limites de aprovação.',
    horario: 'Ontem • 19:15',
    responsavel: 'Marina Alves',
  },
  {
    id: 3,
    perfil: 'Administrador Master',
    acao: 'Política de auditoria reforçada com autenticação em duas etapas.',
    horario: '09/07 • 09:50',
    responsavel: 'Carla Ribeiro',
  },
]

const RESPONSAVEL_PADRAO = 'Equipe Golffox'

const formatDateTime = () =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

type PermissionsPageProps = {
  glassClass: string
  isLight: boolean
}

const PermissionsPage = ({ glassClass, isLight }: PermissionsPageProps) => {
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(
    INITIAL_PERMISSION_PROFILES,
  )
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(INITIAL_ACTIVITY_LOG)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draftProfile, setDraftProfile] = useState<PermissionProfile | null>(null)
  const [tempPermissions, setTempPermissions] = useState<string[]>([])
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const activityIdRef = useRef(INITIAL_ACTIVITY_LOG.length + 1)

  const areaById = useMemo(() => {
    const entries = new Map<string, PermissionArea>()
    PERMISSION_AREAS.forEach((area) => entries.set(area.id, area))
    return entries
  }, [])

  const filteredProfiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return permissionProfiles
    }

    return permissionProfiles.filter((profile) => {
      const haystack = `${profile.nome} ${profile.descricao} ${profile.responsavel}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [permissionProfiles, searchTerm])

  const areaUsage = useMemo(() => {
    return PERMISSION_AREAS.map((area) => ({
      ...area,
      perfisComAcesso: permissionProfiles.filter((profile) => profile.permissoes.includes(area.id)).length,
    }))
  }, [permissionProfiles])

  const addActivityEntry = (perfil: string, acao: string, responsavel: string) => {
    const entry: ActivityLogEntry = {
      id: activityIdRef.current,
      perfil,
      acao,
      horario: formatDateTime(),
      responsavel,
    }
    activityIdRef.current += 1
    setActivityLog((previous) => [entry, ...previous].slice(0, 12))
  }

  const resetModal = () => {
    setIsModalOpen(false)
    setDraftProfile(null)
    setTempPermissions([])
    setIsCreatingProfile(false)
    setFormError(null)
  }

  const openForEdition = (profile: PermissionProfile) => {
    setDraftProfile({ ...profile })
    setTempPermissions([...profile.permissoes])
    setIsCreatingProfile(false)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    const novoPerfil: PermissionProfile = {
      id: `perfil_${Date.now()}`,
      nome: 'Novo perfil',
      descricao: 'Descreva o objetivo deste perfil de acesso.',
      permissoes: [],
      ultimaAtualizacao: formatDateTime(),
      responsavel: RESPONSAVEL_PADRAO,
    }
    setDraftProfile(novoPerfil)
    setTempPermissions([])
    setIsCreatingProfile(true)
    setFormError(null)
    setIsModalOpen(true)
  }

  const togglePermission = (areaId: string) => {
    setTempPermissions((previous) =>
      previous.includes(areaId) ? previous.filter((id) => id !== areaId) : [...previous, areaId],
    )
  }

  const handleToggleLock = (profile: PermissionProfile) => {
    if (profile.id === 'admin') {
      return
    }

    const bloqueado = !profile.bloqueado
    const mensagem = bloqueado
      ? 'Perfil bloqueado para garantir conformidade.'
      : 'Perfil liberado para novas edições.'

    setPermissionProfiles((previous) =>
      previous.map((item) =>
        item.id === profile.id
          ? {
              ...item,
              bloqueado,
              ultimaAtualizacao: formatDateTime(),
              responsavel: RESPONSAVEL_PADRAO,
            }
          : item,
      ),
    )

    addActivityEntry(profile.nome, mensagem, RESPONSAVEL_PADRAO)
  }

  const handleSaveProfile = () => {
    if (!draftProfile) {
      return
    }

    if (!draftProfile.nome.trim()) {
      setFormError('Informe um nome para o perfil.')
      return
    }

    const descricao = draftProfile.descricao.trim()
    if (!descricao) {
      setFormError('Inclua uma descrição para contextualizar o perfil.')
      return
    }

    if (tempPermissions.length === 0) {
      setFormError('Selecione pelo menos uma área de acesso.')
      return
    }

    const responsavel = draftProfile.responsavel.trim() || RESPONSAVEL_PADRAO

    const perfilAtualizado: PermissionProfile = {
      ...draftProfile,
      nome: draftProfile.nome.trim(),
      descricao,
      permissoes: [...tempPermissions],
      ultimaAtualizacao: formatDateTime(),
      responsavel,
    }

    if (isCreatingProfile) {
      setPermissionProfiles((previous) => [...previous, perfilAtualizado])
      addActivityEntry(perfilAtualizado.nome, 'Perfil criado com sucesso.', responsavel)
    } else {
      setPermissionProfiles((previous) =>
        previous.map((profile) => (profile.id === perfilAtualizado.id ? perfilAtualizado : profile)),
      )
      addActivityEntry(
        perfilAtualizado.nome,
        `Permissões atualizadas (${perfilAtualizado.permissoes.length} área${
          perfilAtualizado.permissoes.length > 1 ? 's' : ''
        }).`,
        responsavel,
      )
    }

    resetModal()
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-6 sm:p-8 ${glassClass}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-widest ${isLight ? 'text-blue-500/80' : 'text-blue-300/80'}`}>
              Centro de Segurança
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Permissões e Perfis de Acesso</h1>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300/90'}`}>
              Configure perfis em português do Brasil, controle quem pode editar permissões e acompanhe um histórico de
              auditoria simplificado.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome, descrição ou responsável"
                className={`w-full rounded-2xl border px-4 py-2 pl-9 text-sm outline-none transition ${
                  isLight
                    ? 'border-slate-200/80 bg-white/90 text-slate-900 focus:border-blue-400'
                    : 'border-white/10 bg-white/5 text-slate-100 focus:border-blue-300'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
            >
              <Plus className="h-4 w-4" /> Novo perfil
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] xl:gap-8">
        <section className={`rounded-3xl p-6 sm:p-8 ${glassClass}`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Perfis configurados</h2>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300/90'}`}>
                {permissionProfiles.length} perfil{permissionProfiles.length !== 1 && 'es'} ativos.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredProfiles.map((profile) => (
              <article
                key={profile.id}
                className={`rounded-2xl border p-5 transition ${
                  isLight
                    ? 'border-slate-200 bg-white/95 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_55px_rgba(15,23,42,0.12)]'
                    : 'border-white/10 bg-white/5 text-slate-100 shadow-[0_25px_60px_rgba(8,20,48,0.55)] hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(8,20,48,0.65)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{profile.nome}</h3>
                      {profile.bloqueado && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                          <Lock className="h-3 w-3" /> Bloqueado
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300/90'}`}>{profile.descricao}</p>
                  </div>
                  <button
                    type="button"
                    disabled={profile.id === 'admin'}
                    onClick={() => handleToggleLock(profile)}
                    className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                      profile.id === 'admin'
                        ? 'cursor-not-allowed opacity-50'
                        : profile.bloqueado
                          ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                    }`}
                  >
                    {profile.bloqueado ? 'Desbloquear' : 'Bloquear'}
                  </button>
                </div>

                <dl className="mt-4 space-y-1 text-xs uppercase tracking-wide opacity-70">
                  <div className="flex items-center justify-between gap-2">
                    <dt>Responsável</dt>
                    <dd className="font-medium normal-case">{profile.responsavel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt>Última atualização</dt>
                    <dd className="font-mono text-[11px] text-blue-300">{profile.ultimaAtualizacao}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.permissoes.map((areaId) => {
                    const area = areaById.get(areaId)
                    if (!area) return null
                    return (
                      <span
                        key={areaId}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100"
                      >
                        <Check className="h-3 w-3" />
                        {area.titulo}
                      </span>
                    )
                  })}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openForEdition(profile)}
                    disabled={profile.bloqueado}
                    className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      profile.bloqueado
                        ? 'cursor-not-allowed opacity-50'
                        : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400'
                    }`}
                  >
                    Editar permissões
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const copia: PermissionProfile = {
                        ...profile,
                        id: `copia_${Date.now()}`,
                        nome: `${profile.nome} (cópia)`,
                        ultimaAtualizacao: formatDateTime(),
                        responsavel: RESPONSAVEL_PADRAO,
                        bloqueado: false,
                      }
                      setDraftProfile(copia)
                      setTempPermissions([...profile.permissoes])
                      setIsCreatingProfile(true)
                      setIsModalOpen(true)
                      setFormError(null)
                    }}
                    className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-100"
                  >
                    Duplicar
                  </button>
                </div>
              </article>
            ))}

            {filteredProfiles.length === 0 && (
              <div
                className={`col-span-full rounded-2xl border border-dashed p-10 text-center text-sm ${
                  isLight ? 'border-slate-300 text-slate-500' : 'border-white/15 text-slate-400'
                }`}
              >
                Nenhum perfil encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className={`rounded-3xl p-6 ${glassClass}`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Áreas disponíveis</h2>
              <AdjustmentsHorizontal className="h-5 w-5 opacity-60" />
            </div>
            <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>
              Visão geral das áreas críticas e quantos perfis têm acesso autorizado.
            </p>

            <div className="mt-5 space-y-3">
              {areaUsage.map((area) => (
                <div
                  key={area.id}
                  className={`rounded-2xl border px-4 py-3 text-sm transition ${
                    isLight ? 'border-slate-200/90 bg-white/90' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold leading-tight">{area.titulo}</p>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>{area.descricao}</p>
                    </div>
                    <div className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                      {area.perfisComAcesso} perfil{area.perfisComAcesso !== 1 && 'es'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl p-6 ${glassClass}`}>
            <h2 className="text-lg font-semibold">Atividades recentes</h2>
            <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>
              Registros automáticos a cada alteração de perfil.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {activityLog.map((entry) => (
                <li
                  key={entry.id}
                  className={`rounded-2xl border px-4 py-3 ${
                    isLight ? 'border-slate-200/70 bg-white/90' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{entry.perfil}</span>
                    <span className="text-xs uppercase tracking-wide opacity-70">{entry.horario}</span>
                  </div>
                  <p className="mt-1 text-sm opacity-80">{entry.acao}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide opacity-60">{entry.responsavel}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {isModalOpen && draftProfile && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 25 }}
              className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 ${glassClass}`}
            >
              <button
                type="button"
                onClick={resetModal}
                className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-xs uppercase tracking-wide opacity-70 transition hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>

              <h2 className="text-xl font-semibold">{isCreatingProfile ? 'Criar perfil' : 'Editar permissões'}</h2>
              <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>
                Ajuste o nome, a descrição e as áreas liberadas para este perfil.
              </p>

              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium">
                  Nome do perfil
                  <input
                    type="text"
                    value={draftProfile.nome}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, nome: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none transition ${
                      isLight
                        ? 'border-slate-200/80 bg-white/90 text-slate-900 focus:border-blue-400'
                        : 'border-white/15 bg-white/5 text-white focus:border-blue-300'
                    }`}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Descrição
                  <textarea
                    rows={3}
                    value={draftProfile.descricao}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, descricao: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none transition ${
                      isLight
                        ? 'border-slate-200/80 bg-white/90 text-slate-900 focus:border-blue-400'
                        : 'border-white/15 bg-white/5 text-white focus:border-blue-300'
                    }`}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Responsável pela última alteração
                  <input
                    type="text"
                    value={draftProfile.responsavel}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, responsavel: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none transition ${
                      isLight
                        ? 'border-slate-200/80 bg-white/90 text-slate-900 focus:border-blue-400'
                        : 'border-white/15 bg-white/5 text-white focus:border-blue-300'
                    }`}
                  />
                </label>
              </div>

              <div className={`mt-6 rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200/80 bg-white/80' : 'border-white/10 bg-white/5'}`}>
                <p className="text-sm font-medium">Permissões selecionadas</p>
                <p className={`mt-1 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>
                  {tempPermissions.length} área{tempPermissions.length !== 1 && 's'} escolhida{tempPermissions.length !== 1 && 's'}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tempPermissions.map((permissionId) => {
                    const area = areaById.get(permissionId)
                    if (!area) return null
                    return (
                      <span key={permissionId} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                        {area.titulo}
                      </span>
                    )
                  })}
                  {tempPermissions.length === 0 && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                      Nenhuma área selecionada
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERMISSION_AREAS.map((area) => {
                  const isActive = tempPermissions.includes(area.id)
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => togglePermission(area.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? 'border-blue-400 bg-blue-500/20 text-blue-100 shadow-lg shadow-blue-500/30'
                          : isLight
                            ? 'border-slate-200/80 bg-white/80 hover:border-blue-400'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{area.titulo}</span>
                        {isActive && <Check className="h-4 w-4" />}
                      </div>
                      <p className={`mt-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300/80'}`}>{area.descricao}</p>
                    </button>
                  )
                })}
              </div>

              {formError && (
                <div className="mt-6 rounded-2xl border border-rose-400/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {formError}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-2xl border border-white/20 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300/60 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-2xl bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
                >
                  Salvar alterações
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: Bus, label: 'Vehicles', path: '/vehicles' },
    { icon: Users, label: 'Drivers', path: '/drivers' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: ShieldCheck, label: 'Permissões', path: '/permissions' },
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
            ) : route === '/permissions' ? (
              <PermissionsPage key="permissions" glassClass={glassClass} isLight={isLight} />
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

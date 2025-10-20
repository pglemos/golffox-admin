import { useEffect, useMemo, useState } from 'react'
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
  Edit3,
  Lock,
  Plus,
  Shield,
  UserCheck,
  UserCog,
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

type PermissionArea = {
  id: string
  titulo: string
  descricao: string
  destaque?: boolean
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

type ActivityLog = {
  id: number
  perfil: string
  acao: string
  horario: string
  responsavel: string
}

const PERMISSION_AREAS: PermissionArea[] = [
  {
    id: 'dashboard_full',
    titulo: 'Painel de Gestão Completo',
    descricao: 'Todos os módulos administrativos com permissão de edição e configuração.',
    destaque: true,
  },
  {
    id: 'dashboard_view',
    titulo: 'Painel de Gestão (Visualização)',
    descricao: 'Indicadores e rotas em modo somente leitura para acompanhamento diário.',
  },
  {
    id: 'operational_tools',
    titulo: 'Ferramentas Operacionais',
    descricao: 'Gestão de rotas, veículos, motoristas e atendimento a ocorrências.',
  },
  {
    id: 'alerts_center',
    titulo: 'Central de Alertas',
    descricao: 'Monitoramento e resposta a alertas críticos e SLA de atendimento.',
  },
  {
    id: 'reports_finance',
    titulo: 'Relatórios e Custos',
    descricao: 'Emissão de relatórios financeiros, auditoria de viagens e contratos.',
  },
]

const INITIAL_PERMISSION_PROFILES: PermissionProfile[] = [
  {
    id: 'admin',
    nome: 'Administrador',
    descricao: 'Acesso completo ao ambiente Golffox, incluindo políticas de segurança e integrações.',
    permissoes: PERMISSION_AREAS.map((area) => area.id),
    ultimaAtualizacao: '15/07/2024 09:40',
    responsavel: 'Carla Ribeiro',
    bloqueado: true,
  },
  {
    id: 'operations',
    nome: 'Operações',
    descricao: 'Monitora rotas em tempo real, aloca veículos e acompanha a equipe de motoristas.',
    permissoes: ['dashboard_view', 'operational_tools', 'alerts_center'],
    ultimaAtualizacao: '12/07/2024 18:20',
    responsavel: 'Roberto Lima',
  },
  {
    id: 'finance',
    nome: 'Financeiro',
    descricao: 'Analisa custos, gera relatórios de faturamento e acompanha metas contratuais.',
    permissoes: ['dashboard_view', 'reports_finance'],
    ultimaAtualizacao: '10/07/2024 14:05',
    responsavel: 'Marina Alves',
  },
]

const INITIAL_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: 1,
    perfil: 'Operações',
    acao: 'Permissões revisadas para incluir acesso à Central de Alertas.',
    horario: 'Hoje • 08:32',
    responsavel: 'Ana Souza',
  },
  {
    id: 2,
    perfil: 'Financeiro',
    acao: 'Exportou relatório mensal de custos e ajustou limites de aprovação.',
    horario: 'Ontem • 19:15',
    responsavel: 'Marina Alves',
  },
  {
    id: 3,
    perfil: 'Administrador',
    acao: 'Atualizou política de auditoria e reforçou autenticação em duas etapas.',
    horario: '09/07 • 09:50',
    responsavel: 'Carla Ribeiro',
  },
]

const formatDateTime = () =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

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

const PermissionsPage = ({
  glassClass,
  isLight,
}: {
  glassClass: string
  isLight: boolean
}) => {
  const [profiles, setProfiles] = useState<PermissionProfile[]>(() => INITIAL_PERMISSION_PROFILES)
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => INITIAL_PERMISSION_PROFILES[0]?.id ?? '')
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(() => INITIAL_ACTIVITY_LOG)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<PermissionProfile | null>(null)
  const [tempPermissions, setTempPermissions] = useState<string[]>([])

  const areaMap = useMemo(() => {
    const map: Record<string, PermissionArea> = {}
    PERMISSION_AREAS.forEach((area) => {
      map[area.id] = area
    })
    return map
  }, [])

  useEffect(() => {
    if (profiles.length === 0) {
      setSelectedProfileId('')
      return
    }
    const exists = profiles.some((profile) => profile.id === selectedProfileId)
    if (!exists) {
      setSelectedProfileId(profiles[0].id)
    }
  }, [profiles, selectedProfileId])

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0] ?? null,
    [profiles, selectedProfileId],
  )

  const textMuted = isLight ? 'text-slate-600' : 'text-slate-300/80'
  const textStrong = isLight ? 'text-slate-900' : 'text-white'
  const chipClass = isLight
    ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
    : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
  const subCardClass = isLight
    ? 'bg-white/80 border-slate-200/70 text-slate-700'
    : 'bg-white/5 border-white/10 text-slate-200'

  const handleOpenEdit = (profile: PermissionProfile) => {
    setEditingProfile(profile)
    setTempPermissions(profile.permissoes)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProfile(null)
    setTempPermissions([])
  }

  const togglePermission = (areaId: string) => {
    setTempPermissions((prev) =>
      prev.includes(areaId) ? prev.filter((permission) => permission !== areaId) : [...prev, areaId],
    )
  }

  const addActivityEntry = (perfil: string, acao: string, horario: string) => {
    setActivityLog((prev) => [
      { id: Date.now(), perfil, acao, horario, responsavel: 'Você' },
      ...prev,
    ].slice(0, 6))
  }

  const handleSavePermissions = () => {
    if (!editingProfile) return

    const horario = formatDateTime()

    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === editingProfile.id
          ? {
              ...profile,
              permissoes: [...tempPermissions],
              ultimaAtualizacao: horario,
              responsavel: 'Você',
            }
          : profile,
      ),
    )

    setSelectedProfileId(editingProfile.id)
    addActivityEntry(editingProfile.nome, `Permissões atualizadas (${tempPermissions.length} áreas)`, horario)
    handleCloseModal()
  }

  const handleCreateProfile = () => {
    const horario = formatDateTime()
    const novoPerfil: PermissionProfile = {
      id: `perfil-${Date.now()}`,
      nome: `Perfil personalizado ${profiles.length + 1}`,
      descricao: 'Defina uma descrição personalizada para este perfil de acesso.',
      permissoes: ['dashboard_view'],
      ultimaAtualizacao: horario,
      responsavel: 'Você',
    }

    setProfiles((prev) => [novoPerfil, ...prev])
    setSelectedProfileId(novoPerfil.id)
    addActivityEntry(novoPerfil.nome, 'Perfil criado com permissões iniciais.', horario)
    setEditingProfile(novoPerfil)
    setTempPermissions(novoPerfil.permissoes)
    setIsModalOpen(true)
  }

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className={`rounded-2xl p-6 ${glassClass} ${textStrong}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
              <Shield size={16} />
              Governança de acesso
            </div>
            <h1 className="mt-2 text-2xl font-semibold">Permissões e perfis de uso</h1>
            <p className={`mt-2 text-sm ${textMuted}`}>
              Controle centralizado dos perfis habilitados no ambiente Golffox. Ajuste áreas liberadas e acompanhe o histórico de
              alterações em tempo real.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCreateProfile}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isLight
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_14px_30px_rgba(37,99,235,0.28)]'
                  : 'bg-blue-500/90 text-white hover:bg-blue-400 shadow-[0_14px_28px_rgba(59,130,246,0.35)]'
              }`}
            >
              <Plus size={16} />
              Novo perfil
            </button>
            {selectedProfile ? (
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedProfile)}
                disabled={selectedProfile.bloqueado}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  selectedProfile.bloqueado
                    ? 'cursor-not-allowed bg-slate-500/40 text-slate-200/60'
                    : isLight
                    ? 'border border-blue-500/30 bg-white/80 text-blue-700 hover:border-blue-500 hover:text-blue-800'
                    : 'border border-white/10 bg-white/5 text-white hover:border-blue-400/60'
                }`}
              >
                {selectedProfile.bloqueado ? <Lock size={16} /> : <Edit3 size={16} />}
                {selectedProfile.bloqueado ? 'Perfil protegido' : 'Editar permissões'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-2xl p-6 ${glassClass} ${textStrong}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Perfis configurados</h2>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  Escolha um perfil para visualizar as permissões ativas e os responsáveis pela última atualização.
                </p>
              </div>
              <div className={`flex items-center gap-2 text-xs font-semibold ${textMuted}`}>
                <UserCheck size={16} />
                {profiles.length} perfis ativos
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile) => {
                const isActive = profile.id === selectedProfile?.id
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedProfileId(profile.id)}
                    className={`relative rounded-2xl p-4 text-left transition-all ${glassClass} ${
                      isActive
                        ? 'ring-2 ring-blue-500 shadow-[0_0_22px_rgba(59,130,246,0.35)]'
                        : 'opacity-80 hover:opacity-100'
                    } ${textStrong}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{profile.nome}</h3>
                        <p className={`mt-1 text-xs ${textMuted}`}>{profile.descricao}</p>
                      </div>
                      {profile.bloqueado ? <Lock size={18} className="text-blue-300" /> : <UserCog size={18} className="text-blue-300" />}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.permissoes.slice(0, 3).map((permission) => (
                        <span key={permission} className={`rounded-full px-3 py-1 text-[11px] font-medium ${chipClass}`}>
                          {areaMap[permission]?.titulo ?? permission}
                        </span>
                      ))}
                      {profile.permissoes.length > 3 ? (
                        <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${chipClass}`}>
                          +{profile.permissoes.length - 3}
                        </span>
                      ) : null}
                    </div>
                    <div className={`mt-4 text-[11px] ${textMuted}`}>
                      Atualizado em {profile.ultimaAtualizacao} · {profile.responsavel}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${glassClass} ${textStrong}`}>
            {selectedProfile ? (
              <>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedProfile.nome}</h2>
                    <p className={`mt-2 text-sm ${textMuted}`}>{selectedProfile.descricao}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className={`rounded-xl border px-3 py-2 ${subCardClass}`}>
                      <div className="text-xs uppercase tracking-wide opacity-80">Última atualização</div>
                      <div className="mt-1 font-semibold">{selectedProfile.ultimaAtualizacao}</div>
                    </div>
                    <div className={`rounded-xl border px-3 py-2 ${subCardClass}`}>
                      <div className="text-xs uppercase tracking-wide opacity-80">Responsável</div>
                      <div className="mt-1 font-semibold">{selectedProfile.responsavel}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck size={18} />
                    Áreas liberadas
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProfile.permissoes.length > 0 ? (
                      selectedProfile.permissoes.map((permission) => (
                        <span key={permission} className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>
                          {areaMap[permission]?.titulo ?? permission}
                        </span>
                      ))
                    ) : (
                      <span className={`text-sm ${textMuted}`}>Nenhuma área selecionada para este perfil.</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className={`rounded-2xl border p-5 ${subCardClass}`}>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Settings size={16} />
                      Regras principais
                    </div>
                    <ul className={`mt-3 space-y-2 text-sm ${textMuted}`}>
                      <li>• Permissões aplicadas imediatamente após salvar alterações.</li>
                      <li>• Alterações são registradas para auditoria e conformidade.</li>
                      <li>• Notificações são enviadas para os responsáveis do perfil.</li>
                    </ul>
                  </div>
                  <div className={`rounded-2xl border p-5 ${subCardClass}`}>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle size={16} />
                      Recomendações de segurança
                    </div>
                    <ul className={`mt-3 space-y-2 text-sm ${textMuted}`}>
                      <li>• Utilize autenticação em duas etapas para perfis críticos.</li>
                      <li>• Revise permissões de perfis inativos a cada trimestre.</li>
                      <li>• Limite acessos de edição apenas a gestores autorizados.</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className={`text-sm ${textMuted}`}>Selecione um perfil para visualizar as permissões configuradas.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-2xl p-6 ${glassClass} ${textStrong}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Áreas do sistema</h3>
              <div className={`text-xs ${textMuted}`}>{PERMISSION_AREAS.length} áreas monitoradas</div>
            </div>
            <div className="mt-4 space-y-4">
              {PERMISSION_AREAS.map((area) => {
                const totalPerfis = profiles.filter((profile) => profile.permissoes.includes(area.id)).length
                return (
                  <div
                    key={area.id}
                    className={`rounded-2xl border p-4 transition ${
                      area.destaque
                        ? isLight
                          ? 'border-blue-400/40 bg-blue-100/40'
                          : 'border-blue-400/40 bg-blue-500/10'
                        : subCardClass
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{area.titulo}</div>
                        <p className={`mt-1 text-xs ${textMuted}`}>{area.descricao}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${chipClass}`}>
                        {totalPerfis} perfis
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${glassClass} ${textStrong}`}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ChevronRight size={16} />
              Atividades recentes
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {activityLog.map((entry) => (
                <li key={entry.id} className={`rounded-2xl border p-4 ${subCardClass}`}>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{entry.perfil}</span>
                    <span className={textMuted}>{entry.horario}</span>
                  </div>
                  <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>{entry.acao}</p>
                  <div className={`mt-3 text-xs ${textMuted}`}>Responsável: {entry.responsavel}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && editingProfile ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl p-6 ${glassClass} ${textStrong}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-blue-400">Editar permissões</div>
                  <h3 className="mt-1 text-xl font-semibold">{editingProfile.nome}</h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>
                    Selecione as áreas que este perfil poderá acessar. As alterações são aplicadas imediatamente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`rounded-full p-2 transition ${
                    isLight ? 'hover:bg-slate-200/70 text-slate-500' : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  ×
                </button>
              </div>

              {editingProfile.bloqueado ? (
                <div className="mt-4 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm text-blue-100">
                  Este perfil é protegido para garantir a segurança do ambiente e não pode ter permissões ajustadas.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {PERMISSION_AREAS.map((area) => (
                    <label
                      key={area.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${subCardClass}`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-blue-500"
                        checked={tempPermissions.includes(area.id)}
                        onChange={() => togglePermission(area.id)}
                      />
                      <span>
                        <span className="text-sm font-semibold">{area.titulo}</span>
                        <span className={`block text-xs ${textMuted}`}>{area.descricao}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    isLight ? 'bg-white/70 text-slate-700 hover:bg-slate-200/80' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={editingProfile.bloqueado}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    editingProfile.bloqueado
                      ? 'cursor-not-allowed bg-slate-500/40 text-slate-200/70'
                      : isLight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
                >
                  Salvar alterações
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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

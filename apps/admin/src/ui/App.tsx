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
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Plus,
  Download,
  Phone,
  MapPin,
  CalendarClock,
  FileWarning,
  ClipboardCheck,
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

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.35 } },
}

type ThemeToken = (typeof themeTokens)[keyof typeof themeTokens]

type SidebarItemProps = {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
  tokens: ThemeToken
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

type DriversPageProps = {
  glassClass: string
  tokens: ThemeToken
  isLight: boolean
}

type DriverInfo = {
  id: string
  nome: string
  status: 'Ativo' | 'Em treinamento' | 'De férias'
  telefone: string
  cidade: string
  rotaAtual: string
  notaMedia: number
  pendencias: string[]
  proximaRenovacao: string
  descricaoRenovacao: string
  diasParaRenovacao: number | null
  ultimaAtualizacao: string
}

const DriversPage = ({ glassClass, tokens, isLight }: DriversPageProps) => {
  const motoristas = useMemo<DriverInfo[]>(
    () => [
      {
        id: 'd-01',
        nome: 'Carlos Silva',
        status: 'Ativo',
        telefone: '(11) 91234-5678',
        cidade: 'São Paulo • SP',
        rotaAtual: 'Linha Azul 01',
        notaMedia: 9.4,
        pendencias: [],
        proximaRenovacao: '12/03/2025',
        descricaoRenovacao: 'Exame toxicológico',
        diasParaRenovacao: 38,
        ultimaAtualizacao: 'há 45 minutos',
      },
      {
        id: 'd-02',
        nome: 'Ana Santos',
        status: 'Ativo',
        telefone: '(31) 99821-3344',
        cidade: 'Belo Horizonte • MG',
        rotaAtual: 'Expresso Centro 12',
        notaMedia: 9.1,
        pendencias: ['Reciclagem MOPP'],
        proximaRenovacao: '28/02/2025',
        descricaoRenovacao: 'Reciclagem obrigatória',
        diasParaRenovacao: 24,
        ultimaAtualizacao: 'há 2 horas',
      },
      {
        id: 'd-03',
        nome: 'Roberto Lima',
        status: 'Ativo',
        telefone: '(41) 97712-8876',
        cidade: 'Curitiba • PR',
        rotaAtual: 'Corredor Verde 04',
        notaMedia: 8.7,
        pendencias: ['CNH categoria D'],
        proximaRenovacao: '19/02/2025',
        descricaoRenovacao: 'CNH categoria D',
        diasParaRenovacao: 15,
        ultimaAtualizacao: 'há 18 minutos',
      },
      {
        id: 'd-04',
        nome: 'Maria Oliveira',
        status: 'Em treinamento',
        telefone: '(21) 98655-2088',
        cidade: 'Rio de Janeiro • RJ',
        rotaAtual: 'Treinamento de rotas',
        notaMedia: 8.1,
        pendencias: ['Avaliação prática'],
        proximaRenovacao: '05/04/2025',
        descricaoRenovacao: 'Avaliação prática final',
        diasParaRenovacao: 62,
        ultimaAtualizacao: 'há 3 horas',
      },
      {
        id: 'd-05',
        nome: 'Juliana Rocha',
        status: 'De férias',
        telefone: '(62) 99110-4312',
        cidade: 'Goiânia • GO',
        rotaAtual: 'Retorno previsto 18/02',
        notaMedia: 9.0,
        pendencias: [],
        proximaRenovacao: '14/06/2025',
        descricaoRenovacao: 'Exame médico periódico',
        diasParaRenovacao: 132,
        ultimaAtualizacao: 'há 1 dia',
      },
      {
        id: 'd-06',
        nome: 'Daniel Ferreira',
        status: 'Ativo',
        telefone: '(51) 99700-8741',
        cidade: 'Porto Alegre • RS',
        rotaAtual: 'Linha Metropolitana 07',
        notaMedia: 9.6,
        pendencias: [],
        proximaRenovacao: '23/03/2025',
        descricaoRenovacao: 'Curso de direção defensiva',
        diasParaRenovacao: 49,
        ultimaAtualizacao: 'há 25 minutos',
      },
    ],
    []
  )

  const totalAtivos = useMemo(() => motoristas.filter((m) => m.status === 'Ativo').length, [motoristas])
  const totalTreinamento = useMemo(
    () => motoristas.filter((m) => m.status === 'Em treinamento').length,
    [motoristas]
  )
  const totalPendencias = useMemo(() => motoristas.filter((m) => m.pendencias.length > 0).length, [motoristas])
  const indiceSatisfacao = useMemo(
    () => motoristas.reduce((acc, motorista) => acc + motorista.notaMedia, 0) / motoristas.length,
    [motoristas]
  )

  const metricasMotoristas = useMemo(
    () => [
      {
        icon: Users,
        title: 'Motoristas ativos',
        value: totalAtivos,
        sub: <span className="text-emerald-300">+3 na última semana</span>,
        tone: '#10b981',
      },
      {
        icon: ClipboardCheck,
        title: 'Em treinamento',
        value: totalTreinamento,
        sub: <span className="text-amber-200">2 avaliações marcadas</span>,
        tone: '#f59e0b',
      },
      {
        icon: FileWarning,
        title: 'Documentos pendentes',
        value: totalPendencias,
        sub: <span className="text-rose-200">Priorizar regularização</span>,
        tone: '#f97316',
      },
      {
        icon: ShieldCheck,
        title: 'Índice de satisfação',
        value: `${indiceSatisfacao.toFixed(1).replace('.', ',')} / 10`,
        sub: 'Pesquisa mensal com passageiros',
        tone: '#38bdf8',
      },
    ],
    [indiceSatisfacao, totalAtivos, totalPendencias, totalTreinamento]
  )

  const [filtroStatus, setFiltroStatus] = useState<'todos' | DriverInfo['status']>('todos')

  const motoristasFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return motoristas
    return motoristas.filter((motorista) => motorista.status === filtroStatus)
  }, [motoristas, filtroStatus])

  const proximasRenovacoes = useMemo(
    () =>
      [...motoristas]
        .filter((motorista) => typeof motorista.diasParaRenovacao === 'number')
        .sort((a, b) => (a.diasParaRenovacao ?? Infinity) - (b.diasParaRenovacao ?? Infinity))
        .slice(0, 3),
    [motoristas]
  )

  const recomendacoes = useMemo(
    () => [
      {
        titulo: 'Regularize pendências documentais',
        descricao: `${totalPendencias} motorista(s) precisam de atualização de CNH ou cursos obrigatórios. Gere alertas automáticos para agilizar o processo.`,
      },
      {
        titulo: 'Acompanhe o desempenho em tempo real',
        descricao:
          'Priorize acompanhamento com base nas últimas rotas e notas de serviço para manter a satisfação acima de 9,0.',
      },
      {
        titulo: 'Planejamento de treinamento',
        descricao: `${totalTreinamento} motorista(s) em capacitação. Confirme disponibilidade de instrutores e liberação de veículos reserva.`,
      },
    ],
    [totalPendencias, totalTreinamento]
  )

  const statusOptions: Array<{ rotulo: string; valor: 'todos' | DriverInfo['status'] }> = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Ativos', valor: 'Ativo' },
    { rotulo: 'Em treinamento', valor: 'Em treinamento' },
    { rotulo: 'De férias', valor: 'De férias' },
  ]

  const statusStyles: Record<DriverInfo['status'], string> = {
    Ativo: isLight
      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20',
    'Em treinamento': isLight
      ? 'bg-amber-100 text-amber-700 border border-amber-200'
      : 'bg-amber-500/15 text-amber-100 border border-amber-500/20',
    'De férias': isLight
      ? 'bg-sky-100 text-sky-700 border border-sky-200'
      : 'bg-sky-500/15 text-sky-100 border border-sky-500/20',
  }

  const filtroBase = 'px-4 py-2 rounded-full text-sm font-medium transition'
  const filtroAtivo = isLight
    ? 'bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.35)]'
    : 'bg-blue-500/25 text-blue-100 border border-blue-500/30 shadow-[0_16px_32px_rgba(37,99,235,0.32)]'
  const filtroInativo = isLight
    ? 'bg-white/70 text-slate-600 border border-slate-200/70 hover:bg-white'
    : 'bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10'

  return (
    <motion.div
      key="drivers"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6 text-left"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${tokens.quickTitle}`}>Motoristas</h1>
          <p className="text-sm opacity-80 max-w-2xl">
            Acompanhe o desempenho dos condutores, regularize documentação e organize treinamentos com visibilidade em tempo real da operação.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isLight
                ? 'bg-blue-600 text-white shadow-[0_14px_28px_rgba(37,99,235,0.3)] hover:bg-blue-500'
                : 'bg-blue-500/25 text-blue-100 border border-blue-400/40 hover:bg-blue-500/40'
            }`}
          >
            <Plus size={16} />
            Cadastrar motorista
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isLight
                ? 'bg-white/70 text-slate-600 border border-slate-200/70 hover:bg-white'
                : 'bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Download size={16} />
            Exportar dados
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricasMotoristas.map((metrica) => (
          <MetricCard
            key={metrica.title}
            icon={metrica.icon}
            title={metrica.title}
            value={metrica.value}
            sub={metrica.sub}
            tone={metrica.tone}
            glassClass={glassClass}
            titleClass={tokens.quickTitle}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <motion.div className={`rounded-2xl p-6 ${glassClass}`} layout>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${tokens.quickTitle}`}>Painel de motoristas</h2>
              <p className="text-sm opacity-75">Filtre por status e identifique pendências críticas em segundos.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opcao) => (
                <button
                  key={opcao.valor}
                  onClick={() => setFiltroStatus(opcao.valor)}
                  className={`${filtroBase} ${filtroStatus === opcao.valor ? filtroAtivo : filtroInativo}`}
                >
                  {opcao.rotulo}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-xs uppercase tracking-wide opacity-60">
            Exibindo {motoristasFiltrados.length} de {motoristas.length} motoristas cadastrados
          </div>

          <div className="mt-6 space-y-3">
            <div className="hidden md:grid grid-cols-[1.6fr_1.1fr_0.8fr_1fr_1fr] text-xs uppercase tracking-wide opacity-60">
              <span>Profissional</span>
              <span>Rota atual</span>
              <span>Nota média</span>
              <span>Documentos</span>
              <span>Próxima renovação</span>
            </div>

            {motoristasFiltrados.map((motorista) => (
              <motion.div
                key={motorista.id}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`rounded-xl border ${
                  isLight ? 'border-slate-200/70 bg-white/85' : 'border-white/10 bg-white/5'
                } p-4 shadow-sm transition-all md:grid md:grid-cols-[1.6fr_1.1fr_0.8fr_1fr_1fr] md:items-center md:gap-4`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                  <div>
                    <div className="text-sm font-semibold">{motorista.nome}</div>
                    <div className="text-xs opacity-70">{motorista.ultimaAtualizacao}</div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[motorista.status]}`}
                  >
                    {motorista.status}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-1 text-sm md:mt-0">
                  <span className="font-medium">{motorista.rotaAtual}</span>
                  <span className="flex items-center gap-2 text-xs opacity-70">
                    <MapPin size={14} /> {motorista.cidade}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-1 text-sm md:mt-0">
                  <span className="font-semibold">{motorista.notaMedia.toFixed(1).replace('.', ',')}</span>
                  <span className="text-xs opacity-70">Pesquisa dos últimos 30 dias</span>
                </div>

                <div className="mt-3 text-sm md:mt-0">
                  {motorista.pendencias.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {motorista.pendencias.map((pendencia) => (
                        <span
                          key={pendencia}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            isLight
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-amber-500/15 text-amber-100 border border-amber-500/20'
                          }`}
                        >
                          <FileWarning size={14} /> {pendencia}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <ShieldCheck size={14} /> Documentação em dia
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-1 text-sm md:mt-0">
                  <span className="font-medium">{motorista.proximaRenovacao}</span>
                  <span className="flex items-center gap-2 text-xs opacity-70">
                    <CalendarClock size={14} /> {motorista.descricaoRenovacao}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-sky-200 md:col-span-5 md:mt-2">
                  <Phone size={14} /> {motorista.telefone}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div className={`rounded-2xl p-6 ${glassClass}`} layout>
            <div className="flex items-center gap-3">
              <CalendarClock size={18} />
              <h2 className={`text-base font-semibold ${tokens.quickTitle}`}>Próximos vencimentos</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {proximasRenovacoes.map((motorista) => (
                <div
                  key={`${motorista.id}-renovacao`}
                  className={`rounded-xl border px-4 py-3 ${
                    isLight ? 'border-slate-200/70 bg-white/85' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{motorista.nome}</div>
                      <div className="text-xs opacity-70">{motorista.descricaoRenovacao}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{motorista.proximaRenovacao}</div>
                      <div className="text-xs text-amber-300">em {motorista.diasParaRenovacao} dia(s)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className={`rounded-2xl p-6 ${glassClass}`} layout>
            <div className="flex items-center gap-3">
              <ClipboardCheck size={18} />
              <h2 className={`text-base font-semibold ${tokens.quickTitle}`}>Recomendações inteligentes</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {recomendacoes.map((recomendacao) => (
                <li key={recomendacao.titulo} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <div>
                    <div className="font-medium">{recomendacao.titulo}</div>
                    <p className="opacity-75">{recomendacao.descricao}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
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
  tokens: ThemeToken
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
            ) : route === '/drivers' ? (
              <DriversPage key="drivers" glassClass={glassClass} tokens={tokens} isLight={isLight} />
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

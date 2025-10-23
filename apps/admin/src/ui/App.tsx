import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
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

const headerBadges: Record<string, string> = {
  Painel: 'Visão geral em processamento',
  Mapa: 'Monitoramento em tempo real',
  Rotas: 'Roteirização otimizada',
  Veículos: 'Status da frota conectado',
  Motoristas: 'Equipe em operação',
  Empresas: 'Parcerias ativas',
  Permissões: 'Governança e acesso',
  Suporte: 'Central de atendimento',
  Alertas: 'Monitoramento crítico',
  Relatórios: 'Análises disponíveis',
  Histórico: 'Linha do tempo operacional',
  Custos: 'Controle financeiro',
}

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

type SimpleCard = {
  title: string
  description: string
}

const mapInsights = [
  { title: 'Veículos ativos', value: '4', description: 'Última atualização há 8 segundos' },
  { title: 'Cobertura de sinal', value: '98%', description: '16 zonas monitoradas com telemetria' },
  { title: 'Alertas no mapa', value: '1 crítico', description: 'Rota 4 com parada não planejada' },
]

const mapLayers: SimpleCard[] = [
  {
    title: 'Tráfego em tempo real',
    description: 'Integração com dados de trânsito urbano e sensores embarcados',
  },
  {
    title: 'Zonas de segurança',
    description: 'Geofences configuradas para embarque e desembarque seguro',
  },
  {
    title: 'Clima e visibilidade',
    description: 'Previsões atualizadas a cada 5 minutos para rotas críticas',
  },
  {
    title: 'Rotas alternativas',
    description: 'Sugestões automáticas em caso de incidentes ou desvios',
  },
]

const routesToday = [
  { name: 'Rota 1 · Linha Azul', departure: '06:00', occupancy: '82%', status: 'Operando' },
  { name: 'Rota 2 · Linha Verde', departure: '06:15', occupancy: '77%', status: 'Operando' },
  { name: 'Rota 3 · Linha Leste', departure: '06:40', occupancy: '63%', status: 'Monitorar' },
  { name: 'Rota 4 · Linha Expressa', departure: '07:00', occupancy: '91%', status: 'Alerta' },
]

const routeHighlights: SimpleCard[] = [
  {
    title: 'Precisão da rota',
    description: 'Desvio médio de 4% em relação ao planejado nesta manhã',
  },
  {
    title: 'Tempo médio de trajeto',
    description: '42 minutos — 3 minutos abaixo da média histórica',
  },
  {
    title: 'Satisfação dos passageiros',
    description: 'NPS 92 com base nas últimas 120 avaliações recebidas',
  },
]

const vehicleFleet = [
  { code: 'GFX-001', model: 'Marcopolo G8', lastUpdate: 'Há 2 min', status: 'Em rota' },
  { code: 'GFX-014', model: 'Volvo Híbrido 9800', lastUpdate: 'Há 5 min', status: 'Stand-by' },
  { code: 'GFX-022', model: 'Mercedes-Benz O500', lastUpdate: 'Há 1 min', status: 'Manutenção' },
  { code: 'GFX-031', model: 'NeoCity Elétrico', lastUpdate: 'Há 3 min', status: 'Em rota' },
]

const maintenanceHighlights: SimpleCard[] = [
  {
    title: 'Revisão preventiva',
    description: 'Próxima janela para o veículo GFX-022 em 14/05 às 09h',
  },
  {
    title: 'Consumo otimizado',
    description: 'Economia de 6% no consumo médio após calibragem inteligente',
  },
  {
    title: 'Checklist diário',
    description: '98% dos itens concluídos pelos motoristas no início do turno',
  },
]

const driverRoster = [
  { name: 'Ana Souza', route: 'Rota 1', shift: 'Manhã', status: 'Em operação' },
  { name: 'Marcos Lima', route: 'Rota 2', shift: 'Manhã', status: 'Em operação' },
  { name: 'Joana Martins', route: 'Rota 3', shift: 'Manhã', status: 'Revisar' },
  { name: 'Carlos Alberto', route: 'Reserva', shift: 'Flex', status: 'Stand-by' },
]

const driverHighlights: SimpleCard[] = [
  {
    title: 'Treinamentos concluídos',
    description: '100% da equipe certificada em direção defensiva e atendimento',
  },
  {
    title: 'Pontualidade média',
    description: '98,4% de chegadas dentro do SLA estabelecido para embarque',
  },
  {
    title: 'Reconhecimento',
    description: 'Destaque do dia: Ana Souza — 12 rotas consecutivas sem atrasos',
  },
]

const companyPartners = [
  { name: 'Tech Mobility', contact: 'operacoes@techmobility.com', status: 'Contrato ativo' },
  { name: 'City Logistics', contact: 'contato@citylog.com', status: 'Negociação' },
  { name: 'Edu Trans', contact: 'suporte@edutrans.com', status: 'Atendimento prioritário' },
]

const partnershipHighlights: SimpleCard[] = [
  {
    title: 'KPIs entregues',
    description: 'Relatórios de SLA enviados semanalmente para 5 parceiros',
  },
  {
    title: 'Integrações',
    description: 'APIs de presença estudantil sincronizadas com 3 redes privadas',
  },
  {
    title: 'Renovações',
    description: 'Dois contratos com renovação automática prevista para junho',
  },
]

const permissionMatrix = [
  { role: 'Administrador', scope: 'Acesso total', users: 3 },
  { role: 'Operador', scope: 'Gestão de rotas e alertas', users: 8 },
  { role: 'Analista', scope: 'Relatórios e custos', users: 5 },
  { role: 'Motorista', scope: 'Aplicativo embarcado', users: 24 },
]

const permissionHighlights: SimpleCard[] = [
  {
    title: 'Última revisão',
    description: 'Fluxos de aprovação atualizados em 02/05 pelo time de segurança',
  },
  {
    title: 'Autenticação',
    description: 'Single Sign-On habilitado com Azure AD e MFA obrigatório',
  },
  {
    title: 'Auditoria',
    description: 'Logs de acesso exportados diariamente para o data lake',
  },
]

const supportChannels = [
  { channel: 'Chat em tempo real', availability: '24/7', detail: 'Fila atual: 2 atendimentos' },
  { channel: 'Telefone prioritário', availability: '05h às 23h', detail: 'Tempo médio de resposta: 1m45s' },
  { channel: 'Portal de tickets', availability: 'Sempre disponível', detail: '8 solicitações abertas' },
]

const supportHighlights: SimpleCard[] = [
  {
    title: 'Base de conhecimento',
    description: 'Artigos atualizados com vídeos tutoriais sobre uso do painel',
  },
  {
    title: 'SLA de resolução',
    description: '92% dos tickets resolvidos dentro do prazo contratado',
  },
  {
    title: 'Feedbacks',
    description: 'Pontuação média de atendimento 4,8/5 nas últimas 50 interações',
  },
]

const alertFeed = [
  { level: 'Crítico', message: 'Veículo parado na Rota 4 há 3 minutos', time: '07:12', action: 'Acionar suporte avançado' },
  { level: 'Atenção', message: 'Trânsito denso próximo ao Campus Norte', time: '07:05', action: 'Sugestão de rota alternativa' },
  { level: 'Informativo', message: 'Atualização de firmware concluída no GFX-031', time: '06:55', action: 'Nenhuma ação necessária' },
]

const alertHighlights: SimpleCard[] = [
  {
    title: 'Regras ativas',
    description: '12 automações disparando alertas por telemetria avançada',
  },
  {
    title: 'Tempo de resposta',
    description: 'Resposta média a alertas críticos em 4 minutos',
  },
  {
    title: 'Ações sugeridas',
    description: 'Planos de contingência configurados para 6 cenários distintos',
  },
]

const reportCatalog = [
  { name: 'Ocupação diária', frequency: 'Diário', delivery: '08:00' },
  { name: 'Análise de rotas', frequency: 'Semanal', delivery: 'Segunda-feira' },
  { name: 'Performance dos motoristas', frequency: 'Mensal', delivery: 'Dia 02' },
  { name: 'Resumo financeiro', frequency: 'Mensal', delivery: 'Dia 05' },
]

const reportHighlights: SimpleCard[] = [
  {
    title: 'Exportações automáticas',
    description: 'Integração direta com Google Drive, SharePoint e Data Lake',
  },
  {
    title: 'Agendamentos',
    description: '10 relatórios enviados automaticamente para stakeholders',
  },
  {
    title: 'Personalização',
    description: 'Filtros dinâmicos por rota, período e unidade de negócio',
  },
]

const historyTimeline = [
  { time: '05:50', title: 'Início das operações', detail: 'Checklist concluído para as rotas da manhã' },
  { time: '06:30', title: 'Primeiro embarque', detail: 'Rota 1 registrou 28 passageiros' },
  { time: '06:45', title: 'Ajuste de rota', detail: 'Desvio de 4 minutos contornado na Rota 3' },
  { time: '07:10', title: 'Alerta crítico tratado', detail: 'Equipe acionada para suporte ao veículo GFX-022' },
]

const historyHighlights: SimpleCard[] = [
  {
    title: 'Eventos registrados',
    description: '147 eventos catalogados nas últimas 24 horas',
  },
  {
    title: 'Auditoria',
    description: 'Exportação de histórico disponível para compliance em PDF e CSV',
  },
  {
    title: 'Insights',
    description: 'IA sugere consolidar dados de atrasos recorrentes na Rota 2',
  },
]

const costSummary = [
  { label: 'Custo operacional diário', value: 'R$ 12.450', variation: '+4,2%' },
  { label: 'Receita projetada', value: 'R$ 18.600', variation: '+6,1%' },
  { label: 'Margem estimada', value: '33%', variation: '+1,8%' },
]

const expenseBreakdown = [
  { item: 'Combustível e energia', percentage: '38%', note: 'Contratos indexados ao reajuste trimestral' },
  { item: 'Folha operacional', percentage: '27%', note: 'Inclui benefícios e treinamentos recorrentes' },
  { item: 'Manutenção e peças', percentage: '19%', note: 'Programas preventivos e corretivos' },
  { item: 'Tecnologia e licenças', percentage: '11%', note: 'Softwares embarcados e conectividade' },
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
    theme === 'dark' ? 'bg-[#040712] text-slate-100' : 'bg-[#f4f6ff] text-black'

  const orbTransition = { duration: 18, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }

  const badgeText = headerBadges[activeNav] ?? 'Sincronização ativa'

  const renderSectionBody = (): ReactNode => {
    switch (activeNav) {
      case 'Painel':
        return (
          <>
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
                <motion.span key={chip.label} whileHover={{ y: -4, scale: 1.01 }} className={`${pillBase} ${chip.tone[theme]} shadow-sm`}>
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
                    Ocupação média semanal avançou para <span className="font-semibold text-black dark:text-indigo-200">+8%</span> e mantém tendência ascendente nos picos das 07h.
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
          </>
        )
      case 'Mapa':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <div className="grid gap-4 lg:grid-cols-3">
                {mapInsights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                  >
                    <p className="text-sm font-semibold text-black/70 dark:text-slate-300">{item.title}</p>
                    <p className="mt-2 text-3xl font-bold text-black dark:text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-black/60 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-72 rounded-3xl border border-dashed border-slate-200/70 bg-white/70 p-6 text-center text-sm text-black/70 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-300">
                Visualização do mapa interativo renderizada no produto final.
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Camadas habilitadas</h2>
              <p className="mt-2 text-sm text-black/70 dark:text-slate-300">
                Combine telemetria proprietária com dados públicos para enriquecer a análise de geolocalização.
              </p>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {mapLayers.map((layer) => (
                  <li
                    key={layer.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{layer.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{layer.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )
      case 'Rotas':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Operação do dia</h2>
              <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Acompanhe horários, ocupação e status de cada rota.</p>
              <div className="mt-4 space-y-3">
                {routesToday.map((route) => (
                  <div
                    key={route.name}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-black dark:text-white">{route.name}</p>
                      <p className="text-xs text-black/70 dark:text-slate-300">Partida às {route.departure}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                        Ocupação {route.occupancy}
                      </span>
                      <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                        {route.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Destaques estratégicos</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {routeHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Veículos':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Status da frota</h2>
              <div className="mt-4 space-y-3">
                {vehicleFleet.map((vehicle) => (
                  <div
                    key={vehicle.code}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{vehicle.code}</span>
                    <span>{vehicle.model}</span>
                    <span className="text-black/70 dark:text-slate-300">{vehicle.lastUpdate}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {vehicle.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Manutenção inteligente</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {maintenanceHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Motoristas':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Escala operacional</h2>
              <div className="mt-4 space-y-3">
                {driverRoster.map((driver) => (
                  <div
                    key={driver.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{driver.name}</span>
                    <span>{driver.route}</span>
                    <span>{driver.shift}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {driver.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Desenvolvimento contínuo</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {driverHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Empresas':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Parceiros ativos</h2>
              <div className="mt-4 space-y-3">
                {companyPartners.map((company) => (
                  <div
                    key={company.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-3"
                  >
                    <span className="font-semibold text-black dark:text-white">{company.name}</span>
                    <span>{company.contact}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {company.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Relacionamento estratégico</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {partnershipHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Permissões':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Matriz de acesso</h2>
              <div className="mt-4 space-y-3">
                {permissionMatrix.map((role) => (
                  <div
                    key={role.role}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-3"
                  >
                    <span className="font-semibold text-black dark:text-white">{role.role}</span>
                    <span>{role.scope}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {role.users} usuários
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Governança e compliance</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {permissionHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Suporte':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Canais de atendimento</h2>
              <div className="mt-4 space-y-3">
                {supportChannels.map((channel) => (
                  <div
                    key={channel.channel}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-3"
                  >
                    <span className="font-semibold text-black dark:text-white">{channel.channel}</span>
                    <span>{channel.availability}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {channel.detail}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Qualidade do suporte</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {supportHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Alertas':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Fila de alertas</h2>
              <div className="mt-4 space-y-3">
                {alertFeed.map((alert) => (
                  <div
                    key={alert.message}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{alert.level}</span>
                    <span>{alert.message}</span>
                    <span className="text-black/70 dark:text-slate-300">{alert.time}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {alert.action}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Automação e resposta</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {alertHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Relatórios':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Catálogo de relatórios</h2>
              <div className="mt-4 space-y-3">
                {reportCatalog.map((report) => (
                  <div
                    key={report.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-3"
                  >
                    <span className="font-semibold text-black dark:text-white">{report.name}</span>
                    <span>{report.frequency}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      Entrega: {report.delivery}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Automação de insights</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {reportHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Histórico':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Linha do tempo</h2>
              <div className="mt-4 space-y-3">
                {historyTimeline.map((event) => (
                  <div
                    key={event.time + event.title}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-[80px_1fr]"
                  >
                    <span className="font-semibold text-black dark:text-white">{event.time}</span>
                    <div>
                      <p className="font-semibold text-black dark:text-white">{event.title}</p>
                      <p className="text-sm text-black/70 dark:text-slate-300">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Resumo analítico</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {historyHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-black/70 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      case 'Custos':
        return (
          <div className="grid gap-6">
            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Resumo financeiro</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {costSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/70 dark:text-slate-300">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-black dark:text-white">{item.value}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">{item.variation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Distribuição de custos</h2>
              <div className="mt-4 space-y-3">
                {expenseBreakdown.map((expense) => (
                  <div
                    key={expense.item}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-[1.2fr_120px]"
                  >
                    <div>
                      <p className="font-semibold text-black dark:text-white">{expense.item}</p>
                      <p className="text-sm text-black/70 dark:text-slate-300">{expense.note}</p>
                    </div>
                    <span className="self-center rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {expense.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      default:
        return null
    }
  }

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
                  {activeNav}
                  <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-black backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                    {badgeText}
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

            {renderSectionBody()}


            <footer className="relative mt-10 border-t border-slate-200/60 pt-6 text-xs text-black dark:border-white/10 dark:text-slate-500">
              <div className="absolute -top-px left-0 h-px w-24 bg-gradient-to-r from-indigo-500/60 via-sky-400/60 to-transparent dark:from-indigo-400/80 dark:via-sky-400/60" />
              Seção {activeNav.toLowerCase()} atualizada às{' '}
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Telemetria proprietária Golf Fox conectada.
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

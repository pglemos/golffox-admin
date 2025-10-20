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

type SupportPageProps = {
  tokens: typeof themeTokens.dark
  glassClass: string
}

const SupportPage = ({ tokens, glassClass }: SupportPageProps) => {
  const canais = [
    {
      titulo: 'Chat em tempo real',
      descricao: 'Fale com um especialista da Golf Fox em português de segunda a sexta das 8h às 20h.',
      icon: MessageCircle,
      acoes: [
        { label: 'Abrir chat web', href: 'https://app.golffox.com/suporte/chat' },
        { label: 'WhatsApp empresarial', href: 'https://wa.me/5511999999999' },
      ],
    },
    {
      titulo: 'Central telefônica',
      descricao: 'Atendimento prioritário para incidentes críticos e emergências de operação.',
      icon: Phone,
      acoes: [
        { label: 'Ligar para 0800-777-4653', href: 'tel:08007774653' },
        { label: 'Agendar retorno', href: 'https://cal.com/golffox/suporte' },
      ],
    },
    {
      titulo: 'E-mail & portal',
      descricao: 'Abra e acompanhe chamados com histórico completo e anexos ilimitados.',
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
        'Priorize o canal telefônico. Ligue para 0800-777-4653, informe o código do seu contrato e o número da rota afetada. Nosso time cria o ticket automaticamente e acompanha até a normalização.',
    },
    {
      pergunta: 'Qual o prazo de resposta do suporte?',
      resposta:
        'Chamados críticos recebem primeira resposta em até 10 minutos e solução definitiva em até 2 horas. Demandas padrão têm SLA de resposta de 2 horas úteis e resolução em até 1 dia útil.',
    },
    {
      pergunta: 'Posso acompanhar o status dos tickets?',
      resposta:
        'Sim. Todos os chamados ficam disponíveis no portal do cliente com histórico de interações, SLA e responsáveis. Você também recebe notificações por e-mail a cada atualização.',
    },
  ] as const

  const guias = [
    {
      titulo: 'Guia rápido de incidentes',
      descricao: 'Checklist em 4 passos para restaurar operações críticas e informar as partes interessadas.',
      icon: FileText,
      href: 'https://docs.golffox.com/guias/incident-response.pdf',
    },
    {
      titulo: 'Base de conhecimento',
      descricao: 'Artigos, vídeos e treinamentos sob demanda para administradores e motoristas.',
      icon: BookOpen,
      href: 'https://docs.golffox.com/base-de-conhecimento',
    },
    {
      titulo: 'Treinamento personalizado',
      descricao: 'Agende sessões com especialistas para implantações, integrações e revisões operacionais.',
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
              Nossa equipe está disponível 24/7 para manter suas operações rodoviárias em pleno funcionamento. Escolha o canal
              ideal, acompanhe indicadores de SLA em tempo real e consulte materiais de autoatendimento sem sair do painel.
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
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/20">
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
              <strong className="text-emerald-400">Status:</strong> Atendimento disponível, fila atual com 3 chamados aguardando
              retorno.
            </li>
            <li>
              <strong className="text-emerald-400">Plantão:</strong> Equipe de plantão com especialistas em telemetria e rotas
              inteligentes.
            </li>
            <li>
              <strong className="text-emerald-400">Comunicação:</strong> Alertas de indisponibilidade são enviados via SMS e
              e-mail imediatamente.
            </li>
          </ul>
        </motion.div>

        <motion.div className={`rounded-2xl p-6 border ${glassClass} space-y-4`} layout>
          <div className={`text-lg font-semibold ${tokens.quickTitle}`}>Escalonamento</div>
          <p className={`text-sm leading-relaxed ${tokens.quickDescription}`}>
            Caso a solução exceda o SLA comprometido, escalonamos automaticamente para a gerência técnica e mantemos você
            informado a cada 15 minutos com atualizações sobre a evolução do incidente.
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
            <details
              key={faq.pergunta}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/10"
            >
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
          {guias.map((guia) => (
            <a
              key={guia.titulo}
              href={guia.href}
              target="_blank"
              rel="noreferrer"
              className={`rounded-2xl border px-5 py-4 transition ${glassClass} hover:translate-y-[-4px] hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <guia.icon size={20} />
                </span>
                <div>
                  <div className={`text-sm font-semibold ${tokens.quickTitle}`}>{guia.titulo}</div>
                  <p className={`text-xs mt-1 leading-relaxed ${tokens.quickDescription}`}>{guia.descricao}</p>
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

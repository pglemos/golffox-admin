import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  ClipboardCheck,
  FileWarning,
  ShieldCheck,
  Plus,
  Download,
  MapPin,
  CalendarClock,
  Phone,
} from 'lucide-react'

import { MetricCard } from '../components/MetricCard'
import { fadeVariants, type ThemeToken } from '../themeTokens'

export type DriversPageProps = {
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

export const DriversPage = ({ glassClass, tokens, isLight }: DriversPageProps) => {
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
    : 'bg-sky-500/150/25 text-blue-100 border border-blue-500/30 shadow-[0_16px_32px_rgba(37,99,235,0.32)]'
  const filtroInativo = isLight
    ? 'bg-white/70 text-slate-600 border border-slate-200/70 hover:bg-white/5'
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
                ? 'bg-blue-600 text-white shadow-[0_14px_28px_rgba(37,99,235,0.3)] hover:bg-sky-500/150'
                : 'bg-sky-500/150/25 text-blue-100 border border-blue-400/40 hover:bg-sky-500/150/40'
            }`}
          >
            <Plus size={16} />
            Cadastrar motorista
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isLight
                ? 'bg-white/70 text-slate-600 border border-slate-200/70 hover:bg-white/5'
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

export default DriversPage

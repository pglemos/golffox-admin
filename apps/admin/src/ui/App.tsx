import { useMemo, useRef, useState } from 'react'
import {
  AdjustmentsHorizontal,
  Check,
  Lock,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react'

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

const glassVariants = {
  claro:
    'bg-white/90 border border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl text-slate-900',
  escuro:
    'bg-slate-900/60 border border-slate-700/40 shadow-[0_20px_70px_rgba(2,6,23,0.65)] backdrop-blur-xl text-slate-100',
} as const

const backgroundVariants = {
  claro: 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900',
  escuro: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100',
} as const

export default function App() {
  const [tema, setTema] = useState<'claro' | 'escuro'>('escuro')
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
      previous.includes(areaId)
        ? previous.filter((id) => id !== areaId)
        : [...previous, areaId],
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
        previous.map((profile) =>
          profile.id === perfilAtualizado.id ? perfilAtualizado : profile,
        ),
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

  const isLight = tema === 'claro'
  const glassClass = glassVariants[tema]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${backgroundVariants[tema]}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
        <header className={`${glassClass} rounded-3xl p-6 lg:p-8`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-400/80">
                Centro de Segurança
              </p>
              <h1 className="mt-2 text-3xl font-bold lg:text-4xl">
                Permissões e Perfis de Acesso
              </h1>
              <p className="mt-3 max-w-2xl text-sm lg:text-base text-slate-400 lg:text-slate-500">
                Gerencie quem pode acessar cada área do ecossistema Golffox. Revise perfis, libere ou bloqueie edições e acompanhe
                um histórico completo de mudanças em português do Brasil.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl bg-slate-800/20 p-2 text-sm font-medium lg:self-auto">
              <button
                type="button"
                onClick={() => setTema('escuro')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                  !isLight
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Tema escuro
              </button>
              <button
                type="button"
                onClick={() => setTema('claro')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 transition ${
                  isLight
                    ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="h-4 w-4" />
                Tema claro
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 pb-10 lg:flex-row">
          <section className="flex-1 space-y-6">
            <div className={`${glassClass} rounded-3xl p-6 lg:p-8`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Perfis configurados</h2>
                  <p className="mt-1 text-sm text-slate-400 lg:text-slate-500">
                    {permissionProfiles.length} perfil{permissionProfiles.length !== 1 && 'es'} ativos com políticas em português.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar por nome, descrição ou responsável"
                      className={`w-full rounded-2xl border border-transparent bg-slate-900/10 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white/70 focus:text-slate-900 ${
                        isLight ? 'bg-white/80 text-slate-900' : 'text-slate-100'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
                  >
                    <Plus className="h-4 w-4" />
                    Novo perfil
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {filteredProfiles.map((profile) => (
                  <article
                    key={profile.id}
                    className={`rounded-2xl border border-transparent p-5 transition hover:-translate-y-1 hover:shadow-xl ${
                      isLight ? 'bg-white/90 shadow-[0_20px_45px_rgba(15,23,42,0.12)]' : 'bg-slate-950/50 shadow-[0_25px_60px_rgba(2,6,23,0.65)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{profile.nome}</h3>
                          {profile.bloqueado && (
                            <span className="flex items-center gap-1 rounded-full bg-slate-700/40 px-2 py-1 text-xs font-medium uppercase tracking-wide text-amber-300">
                              <Lock className="h-3 w-3" /> Bloqueado
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-400 lg:text-slate-500">{profile.descricao}</p>
                      </div>
                      <button
                        type="button"
                        disabled={profile.id === 'admin'}
                        onClick={() => handleToggleLock(profile)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                          profile.id === 'admin'
                            ? 'cursor-not-allowed bg-slate-700/30 text-slate-500'
                            : profile.bloqueado
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                        }`}
                      >
                        {profile.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    </div>

                    <dl className="mt-4 space-y-1 text-sm text-slate-400 lg:text-slate-500">
                      <div className="flex items-center justify-between">
                        <dt>Responsável</dt>
                        <dd className="font-medium text-slate-200 lg:text-slate-600">{profile.responsavel}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Última atualização</dt>
                        <dd className="font-mono text-xs text-blue-300 lg:text-blue-500">{profile.ultimaAtualizacao}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.permissoes.map((areaId) => {
                        const area = areaById.get(areaId)
                        if (!area) return null
                        return (
                          <span
                            key={areaId}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200"
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
                            ? 'cursor-not-allowed bg-slate-700/40 text-slate-500'
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
                        className="rounded-2xl border border-slate-600/60 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-400 hover:text-blue-200"
                      >
                        Duplicar
                      </button>
                    </div>
                  </article>
                ))}

                {filteredProfiles.length === 0 && (
                  <div
                    className={`col-span-full rounded-2xl border border-dashed border-slate-500/60 p-10 text-center text-sm ${
                      isLight ? 'bg-white/70 text-slate-500' : 'bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    Nenhum perfil encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            </div>

            <div className={`${glassClass} rounded-3xl p-6 lg:p-8`}>
              <h2 className="text-2xl font-semibold">Áreas disponíveis</h2>
              <p className="mt-1 text-sm text-slate-400 lg:text-slate-500">
                Visão geral das áreas críticas e quantos perfis têm acesso autorizado.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {areaUsage.map((area) => (
                  <div
                    key={area.id}
                    className={`rounded-2xl border border-transparent p-5 transition ${
                      isLight ? 'bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)]' : 'bg-slate-950/40 shadow-[0_20px_45px_rgba(2,6,23,0.55)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{area.titulo}</h3>
                        <p className="mt-2 text-sm text-slate-400 lg:text-slate-500">{area.descricao}</p>
                      </div>
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                        {area.perfisComAcesso} perfil{area.perfisComAcesso !== 1 && 'es'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="w-full space-y-6 lg:w-80">
            <div className={`${glassClass} rounded-3xl p-6 lg:p-8`}>
              <div className="flex items-center gap-3">
                <AdjustmentsHorizontal className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold">Resumo executivo</h2>
              </div>
              <ul className="mt-6 space-y-4 text-sm text-slate-400 lg:text-slate-500">
                <li className="flex items-center justify-between rounded-2xl bg-blue-500/10 px-4 py-3 text-blue-200">
                  <span className="font-medium">Perfis ativos</span>
                  <span className="text-lg font-semibold">{permissionProfiles.length}</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-200">
                  <span className="font-medium">Áreas críticas</span>
                  <span className="text-lg font-semibold">{PERMISSION_AREAS.length}</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl bg-amber-500/10 px-4 py-3 text-amber-200">
                  <span className="font-medium">Perfis bloqueados</span>
                  <span className="text-lg font-semibold">
                    {permissionProfiles.filter((profile) => profile.bloqueado).length}
                  </span>
                </li>
              </ul>
            </div>

            <div className={`${glassClass} rounded-3xl p-6 lg:p-8`}>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold">Registro de atividades</h2>
              </div>
              <p className="mt-2 text-sm text-slate-400 lg:text-slate-500">
                Todas as ações ficam registradas com horário e responsável para auditoria.
              </p>
              <ul className="mt-4 space-y-4 text-sm">
                {activityLog.map((entry) => (
                  <li
                    key={entry.id}
                    className={`rounded-2xl border border-transparent p-4 transition ${
                      isLight ? 'bg-white/70 text-slate-600' : 'bg-slate-950/40 text-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-100 lg:text-slate-700">{entry.perfil}</p>
                    <p className="mt-1 text-xs text-blue-300 lg:text-blue-500">{entry.horario}</p>
                    <p className="mt-2 text-sm">{entry.acao}</p>
                    <p className="mt-2 text-xs text-slate-400">Responsável: {entry.responsavel}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </main>
      </div>

      {isModalOpen && draftProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-10">
          <div
            className={`w-full max-w-3xl rounded-3xl border border-transparent p-6 shadow-2xl lg:p-8 ${
              isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {isCreatingProfile ? 'Criar novo perfil' : 'Editar permissões'}
                </h2>
                <p className="mt-2 text-sm text-slate-400 lg:text-slate-500">
                  Ajuste informações, responsável e áreas acessíveis. Todas as labels e instruções estão em português.
                </p>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="rounded-full border border-transparent bg-slate-800/50 p-2 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300 lg:text-slate-600">
                  Nome do perfil
                  <input
                    type="text"
                    value={draftProfile.nome}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, nome: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border border-slate-700/60 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-400 ${
                      isLight ? 'border-slate-200/80 text-slate-900' : 'text-white'
                    }`}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300 lg:text-slate-600">
                  Descrição
                  <textarea
                    rows={3}
                    value={draftProfile.descricao}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, descricao: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border border-slate-700/60 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-400 ${
                      isLight ? 'border-slate-200/80 text-slate-900' : 'text-white'
                    }`}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300 lg:text-slate-600">
                  Responsável pela última alteração
                  <input
                    type="text"
                    value={draftProfile.responsavel}
                    onChange={(event) =>
                      setDraftProfile((previous) =>
                        previous ? { ...previous, responsavel: event.target.value } : previous,
                      )
                    }
                    className={`mt-2 w-full rounded-2xl border border-slate-700/60 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-400 ${
                      isLight ? 'border-slate-200/80 text-slate-900' : 'text-white'
                    }`}
                  />
                </label>
              </div>

              <div className={`rounded-2xl border border-slate-700/60 p-4 ${isLight ? 'border-slate-200/80' : ''}`}>
                <p className="text-sm font-medium text-slate-300 lg:text-slate-600">Permissões selecionadas</p>
                <p className="mt-1 text-xs text-slate-400 lg:text-slate-500">
                  {tempPermissions.length} área{tempPermissions.length !== 1 && 's'} escolhida{tempPermissions.length !== 1 && 's'}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tempPermissions.map((permissionId) => {
                    const area = areaById.get(permissionId)
                    if (!area) return null
                    return (
                      <span key={permissionId} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                        {area.titulo}
                      </span>
                    )
                  })}
                  {tempPermissions.length === 0 && (
                    <span className="rounded-full bg-slate-700/40 px-3 py-1 text-xs text-slate-300">
                      Nenhuma área selecionada
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {PERMISSION_AREAS.map((area) => {
                const isActive = tempPermissions.includes(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => togglePermission(area.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-blue-400 bg-blue-500/20 text-blue-100 shadow-lg shadow-blue-500/30'
                        : 'border-slate-700/60 bg-transparent text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{area.titulo}</span>
                      {isActive && <Check className="h-4 w-4" />}
                    </div>
                    <p className="mt-2 text-xs text-slate-400 lg:text-slate-500">{area.descricao}</p>
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
                className="rounded-2xl border border-slate-600/50 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
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
          </div>
        </div>
      )}
    </div>
  )
}

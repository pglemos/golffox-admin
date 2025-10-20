import { useMemo, useState } from 'react'
import {
  Bus,
  Check,
  Copy,
  History,
  LayoutDashboard,
  Lock,
  Moon,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Unlock,
  Users,
  Building2,
} from 'lucide-react'

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

type PermissionProfile = {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
  ultimaAtualizacao: string
  responsavel: string
  bloqueado?: boolean
  fixo?: boolean
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

  const filteredProfiles = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase()
    if (!termo) {
      return permissionProfiles
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

  const openCreateModal = () => {
    setModalState({ aberto: true, modo: 'criar' })
    setEditingId(null)
    setFormState({ nome: '', descricao: '', responsavel: '' })
    setTempPermissions([])
    setFormError(null)
  }

  const openEditModal = (profile: PermissionProfile) => {
    setModalState({ aberto: true, modo: 'editar' })
    setEditingId(profile.id)
    setFormState({
      nome: profile.nome,
      descricao: profile.descricao,
      responsavel: profile.responsavel,
    })
    setTempPermissions([...profile.permissoes])
    setFormError(null)
  }

  const togglePermission = (permissionId: string) => {
    setTempPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((item) => item !== permissionId) : [...prev, permissionId],
    )
  }

  const handleDuplicate = (profile: PermissionProfile) => {
    const novoPerfil: PermissionProfile = {
      ...profile,
      id: `perfil-${Date.now()}`,
      nome: `${profile.nome} (cópia)`,
      bloqueado: false,
      fixo: false,
      ultimaAtualizacao: formatDateTime(),
      responsavel: RESPONSAVEL_PADRAO,
    }

    setPermissionProfiles((prev) => [...prev, novoPerfil])
    setSelectedProfileId(novoPerfil.id)
    registerActivity(novoPerfil.nome, 'Perfil duplicado para revisão.', novoPerfil.responsavel)
  }

  const handleToggleLock = (profile: PermissionProfile) => {
    if (profile.fixo) {
      return
    }

    setPermissionProfiles((prev) =>
      prev.map((item) =>
        item.id === profile.id
          ? {
              ...item,
              bloqueado: !item.bloqueado,
              ultimaAtualizacao: formatDateTime(),
              responsavel: RESPONSAVEL_PADRAO,
            }
          : item,
      ),
    )

    registerActivity(
      profile.nome,
      profile.bloqueado ? 'Perfil desbloqueado para novas edições.' : 'Perfil bloqueado para evitar alterações.',
    )
  }

  const handleSaveProfile = () => {
    const nome = formState.nome.trim()
    const descricao = formState.descricao.trim()
    const responsavel = formState.responsavel.trim() || RESPONSAVEL_PADRAO

    if (!nome) {
      setFormError('Informe um nome para o perfil.')
      return
    }

    if (!descricao) {
      setFormError('Adicione uma descrição para contextualizar o perfil.')
      return
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile) => {
              const selecionado = profile.id === selectedProfileId
              return (
                <article
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`flex h-full flex-col justify-between rounded-2xl border p-5 transition ${
                    selecionado
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : isLight
                      ? 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                      : 'border-slate-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-950/40'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setSelectedProfileId(profile.id)
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{profile.nome}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{profile.descricao}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          profile.bloqueado
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                        }`}
                      >
                        {profile.bloqueado ? 'Bloqueado' : 'Ativo'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profile.permissoes.map((permissionId) => {
                        const area = areasById.get(permissionId)
                        return (
                          <span
                            key={permissionId}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-100"
                          >
                            {area?.titulo ?? permissionId}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-xs text-slate-400 dark:text-slate-500">
                    <p>Última atualização: {profile.ultimaAtualizacao}</p>
                    <p>Responsável: {profile.responsavel}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (!profile.bloqueado || profile.fixo) {
                          openEditModal(profile)
                        }
                      }}
                      disabled={profile.bloqueado && !profile.fixo}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        profile.bloqueado && !profile.fixo
                          ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                      title={profile.bloqueado && !profile.fixo ? 'Desbloqueie para editar.' : 'Editar perfil'}
                    >
                      <PencilLine className="h-4 w-4" /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDuplicate(profile)
                      }}
                      className="flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-100 dark:hover:bg-indigo-500/30"
                    >
                      <Copy className="h-4 w-4" /> Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleToggleLock(profile)
                      }}
                      disabled={profile.fixo}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        profile.fixo
                          ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                          : profile.bloqueado
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-100'
                          : 'bg-amber-500 text-white hover:bg-amber-400'
                      }`}
                      title={profile.fixo ? 'Perfil protegido pela governança.' : profile.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    >
                      {profile.bloqueado ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {profile.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    </button>
                  </div>
                </article>
              )
            })}

            {filteredProfiles.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Nenhum perfil corresponde à busca aplicada.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className={`rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900/60'} p-6 shadow-sm`}>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Resumo do perfil</h2>
            </div>
            {selectedProfile ? (
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Perfil selecionado</p>
                  <p className="mt-1 text-base font-semibold">{selectedProfile.nome}</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-300">{selectedProfile.descricao}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Áreas liberadas</p>
                  {selectedProfile.permissoes.map((permissionId) => {
                    const area = areasById.get(permissionId)
                    return (
                      <div key={permissionId} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                        <Check className="mt-1 h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">{area?.titulo ?? permissionId}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{area?.descricao ?? 'Acesso configurado manualmente.'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="space-y-1 text-xs text-slate-400 dark:text-slate-500">
                  <p>Última atualização: {selectedProfile.ultimaAtualizacao}</p>
                  <p>Responsável: {selectedProfile.responsavel}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Selecione um perfil para ver os detalhes.</p>
            )}
          </section>

          <section className={`rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900/60'} p-6 shadow-sm`}>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
              <History className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Registro de atividades</h2>
            </div>
            <ul className="mt-4 space-y-4 text-sm">
              {activityLog.map((entry) => (
                <li key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{entry.perfil}</p>
                  <p className="text-slate-500 dark:text-slate-300">{entry.acao}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{entry.horario} • {entry.responsavel}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {modalState.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <div className={`w-full max-w-2xl rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950'} shadow-2xl`}>
            <header className={`flex items-center justify-between border-b px-6 py-4 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500/80">
                  {modalState.modo === 'criar' ? 'Novo perfil' : 'Editar perfil'}
                </p>
                <h2 className="text-lg font-semibold">
                  {modalState.modo === 'criar' ? 'Configurar perfil de acesso' : `Ajustar permissões de ${formState.nome}`}
                </h2>
              </div>
            </header>

            <div className="space-y-5 px-6 py-6 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Nome do perfil</span>
                  <input
                    type="text"
                    value={formState.nome}
                    onChange={(event) => setFormState((prev) => ({ ...prev, nome: event.target.value }))}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isLight
                        ? 'border-slate-200 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                        : 'border-slate-700 bg-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-900'
                    }`}
                    placeholder="Ex.: Supervisão regional"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Responsável</span>
                  <input
                    type="text"
                    value={formState.responsavel}
                    onChange={(event) => setFormState((prev) => ({ ...prev, responsavel: event.target.value }))}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isLight
                        ? 'border-slate-200 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                        : 'border-slate-700 bg-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-900'
                    }`}
                    placeholder="Nome do responsável"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Descrição</span>
                <textarea
                  value={formState.descricao}
                  onChange={(event) => setFormState((prev) => ({ ...prev, descricao: event.target.value }))}
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isLight
                      ? 'border-slate-200 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-700 bg-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-900'
                  }`}
                  placeholder="Explique rapidamente quando usar este perfil."
                />
              </label>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Áreas liberadas</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {PERMISSION_AREAS.map((area) => {
                    const ativa = permissaoSelecionada(area.id)
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => togglePermission(area.id)}
                        className={`flex h-full flex-col gap-2 rounded-xl border p-3 text-left transition ${
                          ativa
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100'
                            : isLight
                            ? 'border-slate-200 hover:border-blue-300'
                            : 'border-slate-700 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 grid h-5 w-5 place-items-center rounded-full border ${
                              ativa ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300'
                            }`}
                          >
                            {ativa && <Check className="h-3 w-3" />}
                          </span>
                          <div>
                            <p className="font-semibold">{area.titulo}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-300">{area.descricao}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {formError && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-500/20 dark:text-red-200">{formError}</p>}
            </div>

            <footer className={`flex justify-end gap-3 border-t px-6 py-4 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Salvar alterações
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [activeView, setActiveView] = useState<ActiveView>('permissions')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const isLight = theme === 'light'

  const renderRouteContent = () => {
    if (route === '/vehicles') {
      return <VehiclesPage key="vehicles" glassClass={glassClass} />
    }

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

          {activeView === 'permissions' ? (
            <PermissionsWorkspace isLight={isLight} />
          ) : activeView === 'overview' ? (
            <PlaceholderView titulo="Visão geral do ecossistema Golffox" />
          ) : activeView === 'rotas' ? (
            <PlaceholderView titulo="Monitoramento de rotas" />
          ) : (
            <PlaceholderView titulo="Gestão de empresas" />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

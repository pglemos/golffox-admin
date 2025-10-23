import type { SupabaseClient } from '@supabase/supabase-js'

export type EntityKey =
  | 'Rotas'
  | 'Veículos'
  | 'Motoristas'
  | 'Empresas'
  | 'Permissões'
  | 'Suporte'
  | 'Alertas'
  | 'Relatórios'
  | 'Histórico'
  | 'Custos'

export type Option = {
  value: string
  label: string
}

export type FieldConfig = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'time' | 'date' | 'number' | 'checkbox' | 'datetime'
  required?: boolean
  placeholder?: string
  helperText?: string
  options?: Option[]
  fetchOptions?: (client: SupabaseClient) => Promise<Option[]>
  persist?: boolean
}

export type ToDisplayArgs = {
  values: Record<string, any>
  record?: Record<string, any>
  optionLabels: Record<string, string>
}

export type EntityConfig = {
  entity: EntityKey
  title: string
  description: string
  createLabel: string
  supabaseTable?: string
  fields: FieldConfig[]
  transform: (values: Record<string, any>) => Record<string, any>
  toDisplay: (args: ToDisplayArgs) => Record<string, any>
}

const tempId = () => `local-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`

const safeNumber = (value: any, precision: 'float' | 'int' = 'float') => {
  if (value === '' || value === null || value === undefined) {
    return null
  }
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    return null
  }
  return precision === 'int' ? Math.trunc(parsed) : parsed
}

const fetchCompanies = async (client: SupabaseClient): Promise<Option[]> => {
  const { data, error } = await client.from('companies').select('id, name').order('name')
  if (error) {
    throw new Error(error.message)
  }
  return (data ?? []).map((company) => ({ value: company.id, label: company.name }))
}

const fetchDrivers = async (client: SupabaseClient): Promise<Option[]> => {
  const { data, error } = await client.from('drivers').select('id, name').order('name')
  if (error) {
    throw new Error(error.message)
  }
  return (data ?? []).map((driver) => ({ value: driver.id, label: driver.name }))
}

const fetchVehicles = async (client: SupabaseClient): Promise<Option[]> => {
  const { data, error } = await client.from('vehicles').select('id, plate, model').order('plate')
  if (error) {
    throw new Error(error.message)
  }
  return (data ?? []).map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.plate}${vehicle.model ? ` · ${vehicle.model}` : ''}`,
  }))
}

const fetchRoutes = async (client: SupabaseClient): Promise<Option[]> => {
  const { data, error } = await client.from('routes').select('id, name').order('name')
  if (error) {
    throw new Error(error.message)
  }
  return (data ?? []).map((route) => ({ value: route.id, label: route.name }))
}

const fetchUsers = async (client: SupabaseClient): Promise<Option[]> => {
  const { data, error } = await client.from('users').select('id, name, email').order('name')
  if (error) {
    throw new Error(error.message)
  }
  return (data ?? []).map((user) => ({
    value: user.id,
    label: user.name ? `${user.name} (${user.email})` : user.email,
  }))
}

export const entityConfigs: Record<EntityKey, EntityConfig> = {
  Rotas: {
    entity: 'Rotas',
    title: 'Cadastrar rota',
    description: 'Defina os principais detalhes da nova rota operacional.',
    createLabel: 'Nova rota',
    supabaseTable: 'routes',
    fields: [
      { name: 'name', label: 'Nome da rota', type: 'text', required: true },
      {
        name: 'company_id',
        label: 'Empresa',
        type: 'select',
        required: true,
        fetchOptions: fetchCompanies,
        helperText: 'Selecione a empresa responsável pela rota',
      },
      {
        name: 'driver_id',
        label: 'Motorista',
        type: 'select',
        fetchOptions: fetchDrivers,
      },
      {
        name: 'vehicle_id',
        label: 'Veículo',
        type: 'select',
        fetchOptions: fetchVehicles,
      },
      { name: 'scheduled_start', label: 'Horário previsto de saída', type: 'time', required: true },
      { name: 'start_location', label: 'Origem', type: 'text', placeholder: 'Ex: Ponto A' },
      { name: 'destination', label: 'Destino', type: 'text', placeholder: 'Ex: Ponto B' },
      {
        name: 'status',
        label: 'Status inicial',
        type: 'select',
        required: true,
        options: [
          { value: 'Operando', label: 'Operando' },
          { value: 'Monitorar', label: 'Monitorar' },
          { value: 'Alerta', label: 'Alerta' },
          { value: 'No Horário', label: 'No Horário' },
          { value: 'Atrasado', label: 'Atrasado' },
          { value: 'Com Problema', label: 'Com Problema' },
        ],
      },
      {
        name: 'occupancy',
        label: 'Ocupação estimada',
        type: 'text',
        placeholder: 'Ex: 80% ou 30 passageiros',
        persist: false,
      },
    ],
    transform: (values) => ({
      name: String(values.name ?? '').trim(),
      company_id: values.company_id || null,
      driver_id: values.driver_id || null,
      vehicle_id: values.vehicle_id || null,
      scheduled_start: values.scheduled_start,
      start_location: values.start_location ? String(values.start_location).trim() : null,
      destination: values.destination ? String(values.destination).trim() : null,
      status: values.status ?? 'No Horário',
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      name: values.name,
      departure: values.scheduled_start,
      occupancy: values.occupancy || '—',
      status: values.status ?? 'No Horário',
    }),
  },
  'Veículos': {
    entity: 'Veículos',
    title: 'Cadastrar veículo',
    description: 'Informe os dados básicos do veículo para acompanhamento da frota.',
    createLabel: 'Novo veículo',
    supabaseTable: 'vehicles',
    fields: [
      { name: 'plate', label: 'Placa', type: 'text', required: true, placeholder: 'ABC1D23' },
      { name: 'model', label: 'Modelo', type: 'text', required: true },
      {
        name: 'driver_id',
        label: 'Motorista vinculado',
        type: 'select',
        fetchOptions: fetchDrivers,
      },
      {
        name: 'status',
        label: 'Status operacional',
        type: 'select',
        required: true,
        options: [
          { value: 'Em rota', label: 'Em rota' },
          { value: 'Stand-by', label: 'Stand-by' },
          { value: 'Manutenção', label: 'Manutenção' },
          { value: 'Em Movimento', label: 'Em movimento' },
          { value: 'Parado', label: 'Parado' },
          { value: 'Com Problema', label: 'Com problema' },
          { value: 'Garagem', label: 'Na garagem' },
        ],
      },
      {
        name: 'position_lat',
        label: 'Latitude atual',
        type: 'number',
        required: true,
        helperText: 'Utilize ponto (.) como separador decimal',
      },
      {
        name: 'position_lng',
        label: 'Longitude atual',
        type: 'number',
        required: true,
        helperText: 'Utilize ponto (.) como separador decimal',
      },
      { name: 'route_id', label: 'Rota associada', type: 'select', fetchOptions: fetchRoutes },
      { name: 'last_maintenance', label: 'Última manutenção', type: 'date', required: true },
      { name: 'next_maintenance', label: 'Próxima manutenção', type: 'date', required: true },
      { name: 'is_registered', label: 'Veículo homologado', type: 'checkbox' },
      {
        name: 'last_update_display',
        label: 'Última atualização (texto)',
        type: 'text',
        placeholder: 'Ex: Há 2 min',
        persist: false,
      },
    ],
    transform: (values) => ({
      plate: String(values.plate ?? '').toUpperCase().trim(),
      model: String(values.model ?? '').trim(),
      driver_id: values.driver_id || null,
      status: values.status ?? 'Em Movimento',
      position_lat: safeNumber(values.position_lat) ?? 0,
      position_lng: safeNumber(values.position_lng) ?? 0,
      route_id: values.route_id || null,
      last_maintenance: values.last_maintenance,
      next_maintenance: values.next_maintenance,
      is_registered: Boolean(values.is_registered),
    }),
    toDisplay: ({ values, record, optionLabels }) => ({
      id: record?.id ?? tempId(),
      code: (values.plate || '').toString().toUpperCase(),
      model: values.model,
      lastUpdate: values.last_update_display || 'Atualizado agora',
      status: values.status ?? 'Em Movimento',
      driver: optionLabels.driver_id || 'Sem motorista',
    }),
  },
  'Motoristas': {
    entity: 'Motoristas',
    title: 'Cadastrar motorista',
    description: 'Inclua dados completos para credenciamento do motorista.',
    createLabel: 'Novo motorista',
    supabaseTable: 'drivers',
    fields: [
      { name: 'name', label: 'Nome completo', type: 'text', required: true },
      { name: 'cpf', label: 'CPF', type: 'text', required: true },
      { name: 'rg', label: 'RG', type: 'text', required: true },
      { name: 'birth_date', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'phone', label: 'Telefone', type: 'text', required: true },
      { name: 'email', label: 'E-mail', type: 'text', required: true },
      { name: 'address', label: 'Endereço', type: 'text', required: true },
      { name: 'cep', label: 'CEP', type: 'text', required: true },
      { name: 'cnh', label: 'CNH', type: 'text', required: true },
      { name: 'cnh_validity', label: 'Validade da CNH', type: 'date', required: true },
      {
        name: 'cnh_category',
        label: 'Categoria da CNH',
        type: 'select',
        required: true,
        options: [
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' },
        ],
      },
      { name: 'has_ear', label: 'Possui curso EAR', type: 'checkbox' },
      {
        name: 'transport_course_validity',
        label: 'Validade do curso de transporte',
        type: 'date',
        helperText: 'Opcional, caso aplicável',
      },
      {
        name: 'last_toxicological_exam',
        label: 'Último exame toxicológico',
        type: 'date',
        required: true,
      },
      {
        name: 'photo_url',
        label: 'URL da foto do motorista',
        type: 'text',
        required: true,
        placeholder: 'https://...',
      },
      {
        name: 'contract_type',
        label: 'Tipo de contrato',
        type: 'select',
        required: true,
        options: [
          { value: 'CLT', label: 'CLT' },
          { value: 'terceirizado', label: 'Terceirizado' },
          { value: 'autônomo', label: 'Autônomo' },
        ],
      },
      { name: 'credentialing_date', label: 'Data de credenciamento', type: 'date', required: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Em operação', label: 'Em operação' },
          { value: 'Revisar', label: 'Revisar' },
          { value: 'Stand-by', label: 'Stand-by' },
          { value: 'Ativo', label: 'Ativo' },
          { value: 'Em análise', label: 'Em análise' },
          { value: 'Inativo', label: 'Inativo' },
        ],
      },
      {
        name: 'linked_company',
        label: 'Empresa vinculada',
        type: 'select',
        fetchOptions: async (client) => {
          const companies = await fetchCompanies(client)
          return companies.map((company) => ({ value: company.label, label: company.label }))
        },
        required: true,
      },
      {
        name: 'assigned_routes',
        label: 'Rotas atribuídas',
        type: 'text',
        helperText: 'Separe múltiplas rotas por vírgula',
      },
      {
        name: 'availability',
        label: 'Disponibilidade',
        type: 'text',
        required: true,
        placeholder: 'Ex: Segunda a sexta - 05h às 14h',
      },
      {
        name: 'last_update',
        label: 'Última atualização de cadastro',
        type: 'date',
        required: true,
      },
      {
        name: 'route_badge',
        label: 'Rota destacada',
        type: 'text',
        persist: false,
        placeholder: 'Ex: Linha Azul',
      },
      {
        name: 'shift_label',
        label: 'Turno principal',
        type: 'text',
        persist: false,
        placeholder: 'Ex: Madrugada',
      },
    ],
    transform: (values) => ({
      name: values.name,
      cpf: values.cpf,
      rg: values.rg,
      birth_date: values.birth_date,
      phone: values.phone,
      email: values.email,
      address: values.address,
      cep: values.cep,
      cnh: values.cnh,
      cnh_validity: values.cnh_validity,
      cnh_category: values.cnh_category,
      has_ear: Boolean(values.has_ear),
      transport_course_validity: values.transport_course_validity || null,
      last_toxicological_exam: values.last_toxicological_exam,
      photo_url: values.photo_url,
      contract_type: values.contract_type,
      credentialing_date: values.credentialing_date,
      status: values.status,
      linked_company: values.linked_company,
      assigned_routes:
        typeof values.assigned_routes === 'string' && values.assigned_routes.trim().length > 0
          ? values.assigned_routes.split(',').map((route: string) => route.trim()).filter(Boolean)
          : [],
      availability: values.availability,
      last_update: values.last_update,
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      name: values.name,
      route: values.route_badge || values.linked_company || '—',
      shift: values.shift_label || '—',
      status: values.status || 'Ativo',
    }),
  },
  'Empresas': {
    entity: 'Empresas',
    title: 'Cadastrar empresa parceira',
    description: 'Registre uma nova empresa para vincular passageiros e rotas.',
    createLabel: 'Nova empresa',
    supabaseTable: 'companies',
    fields: [
      { name: 'name', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
      { name: 'contact', label: 'Contato principal', type: 'text', required: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'Ativo', label: 'Ativo' },
          { value: 'Inativo', label: 'Inativo' },
        ],
        required: true,
      },
      { name: 'address_text', label: 'Endereço', type: 'text', required: true },
      {
        name: 'address_lat',
        label: 'Latitude',
        type: 'number',
        required: true,
        helperText: 'Utilize ponto (.) como separador decimal',
      },
      {
        name: 'address_lng',
        label: 'Longitude',
        type: 'number',
        required: true,
        helperText: 'Utilize ponto (.) como separador decimal',
      },
      {
        name: 'contracted_passengers',
        label: 'Passageiros contratados',
        type: 'number',
        required: true,
      },
    ],
    transform: (values) => ({
      name: values.name,
      cnpj: values.cnpj,
      contact: values.contact,
      status: values.status ?? 'Ativo',
      address_text: values.address_text,
      address_lat: safeNumber(values.address_lat) ?? 0,
      address_lng: safeNumber(values.address_lng) ?? 0,
      contracted_passengers: safeNumber(values.contracted_passengers, 'int') ?? 0,
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      name: values.name,
      contact: values.contact,
      status: values.status ?? 'Ativo',
    }),
  },
  'Permissões': {
    entity: 'Permissões',
    title: 'Criar perfil de permissão',
    description: 'Agrupe acessos para controlar o que cada time pode visualizar.',
    createLabel: 'Novo perfil',
    supabaseTable: 'permission_profiles',
    fields: [
      { name: 'name', label: 'Nome do perfil', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      {
        name: 'access',
        label: 'Funcionalidades liberadas',
        type: 'textarea',
        required: true,
        helperText: 'Separe múltiplas permissões por vírgula ou quebra de linha',
      },
      {
        name: 'is_admin_feature',
        label: 'Disponível apenas para administradores',
        type: 'checkbox',
      },
      {
        name: 'users_display',
        label: 'Qtd. de usuários (apenas exibição)',
        type: 'number',
        persist: false,
        helperText: 'Campo opcional apenas para o resumo visual',
      },
    ],
    transform: (values) => ({
      name: values.name,
      description: values.description,
      access:
        typeof values.access === 'string'
          ? values.access
              .split(/[,\n]/)
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [],
      is_admin_feature: Boolean(values.is_admin_feature),
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      role: values.name,
      scope: values.description,
      users:
        values.users_display !== undefined && values.users_display !== ''
          ? Number(values.users_display)
          : 0,
    }),
  },
  Suporte: {
    entity: 'Suporte',
    title: 'Registrar chamado de suporte',
    description: 'Centralize solicitações para acompanhamento do suporte operacional.',
    createLabel: 'Novo chamado',
    supabaseTable: 'support_tickets',
    fields: [
      { name: 'subject', label: 'Assunto', type: 'text', required: true },
      { name: 'message', label: 'Descrição do chamado', type: 'textarea', required: true },
      {
        name: 'priority',
        label: 'Prioridade',
        type: 'select',
        required: true,
        options: [
          { value: 'Baixa', label: 'Baixa' },
          { value: 'Média', label: 'Média' },
          { value: 'Alta', label: 'Alta' },
        ],
      },
      {
        name: 'channel',
        label: 'Canal de atendimento',
        type: 'select',
        required: true,
        options: [
          { value: 'E-mail', label: 'E-mail' },
          { value: 'Telefone', label: 'Telefone' },
          { value: 'Chat', label: 'Chat' },
        ],
      },
      { name: 'contact', label: 'Contato do solicitante', type: 'text', placeholder: 'email@empresa.com' },
    ],
    transform: (values) => ({
      subject: values.subject,
      message: values.message,
      priority: values.priority,
      channel: values.channel,
      contact: values.contact || null,
      status: 'Aberto',
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      channel: values.channel,
      availability: `Prioridade ${values.priority}`,
      detail: values.subject,
    }),
  },
  Alertas: {
    entity: 'Alertas',
    title: 'Criar alerta operacional',
    description: 'Comunique eventos críticos para equipes de monitoramento.',
    createLabel: 'Novo alerta',
    supabaseTable: 'alerts',
    fields: [
      {
        name: 'type',
        label: 'Severidade',
        type: 'select',
        required: true,
        options: [
          { value: 'Crítico', label: 'Crítico' },
          { value: 'Atenção', label: 'Atenção' },
          { value: 'Informativo', label: 'Informativo' },
        ],
      },
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'message', label: 'Mensagem', type: 'textarea', required: true },
      { name: 'timestamp', label: 'Data e hora', type: 'datetime', required: true },
      { name: 'route_id', label: 'Rota relacionada', type: 'select', fetchOptions: fetchRoutes },
      { name: 'vehicle_id', label: 'Veículo relacionado', type: 'select', fetchOptions: fetchVehicles },
      { name: 'user_id', label: 'Responsável', type: 'select', fetchOptions: fetchUsers },
      {
        name: 'action_label',
        label: 'Ação sugerida (exibição)',
        type: 'text',
        persist: false,
        placeholder: 'Ex: Abrir chamado',
      },
    ],
    transform: (values) => ({
      type: values.type,
      title: values.title,
      message: values.message,
      timestamp: values.timestamp
        ? new Date(values.timestamp).toISOString()
        : new Date().toISOString(),
      route_id: values.route_id || null,
      vehicle_id: values.vehicle_id || null,
      user_id: values.user_id || null,
      is_read: false,
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      level: values.type,
      message: values.message,
      time: values.timestamp ? new Date(values.timestamp).toLocaleString('pt-BR') : 'Agora',
      action: values.action_label || 'Ver detalhes',
    }),
  },
  'Relatórios': {
    entity: 'Relatórios',
    title: 'Agendar relatório',
    description: 'Registre relatórios recorrentes ou sob demanda.',
    createLabel: 'Novo relatório',
    supabaseTable: 'report_schedules',
    fields: [
      { name: 'name', label: 'Nome do relatório', type: 'text', required: true },
      {
        name: 'frequency',
        label: 'Frequência',
        type: 'select',
        required: true,
        options: [
          { value: 'Diário', label: 'Diário' },
          { value: 'Semanal', label: 'Semanal' },
          { value: 'Mensal', label: 'Mensal' },
        ],
      },
      { name: 'delivery', label: 'Entrega programada', type: 'text', required: true, placeholder: 'Ex: Segunda-feira · 08h' },
    ],
    transform: (values) => ({
      name: values.name,
      frequency: values.frequency,
      delivery: values.delivery,
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      name: values.name,
      frequency: values.frequency,
      delivery: values.delivery,
    }),
  },
  'Histórico': {
    entity: 'Histórico',
    title: 'Registrar evento de rota',
    description: 'Adicione acontecimentos relevantes ao histórico operacional.',
    createLabel: 'Novo evento',
    supabaseTable: 'route_history',
    fields: [
      { name: 'route_id', label: 'Rota', type: 'select', fetchOptions: fetchRoutes, required: true },
      { name: 'route_name', label: 'Nome da rota', type: 'text', required: true },
      { name: 'driver_id', label: 'Motorista', type: 'select', fetchOptions: fetchDrivers, required: true },
      {
        name: 'driver_name',
        label: 'Nome do motorista',
        type: 'text',
        required: true,
        helperText: 'Utilize o nome exibido para o histórico',
      },
      { name: 'vehicle_id', label: 'Veículo', type: 'select', fetchOptions: fetchVehicles, required: true },
      { name: 'vehicle_plate', label: 'Placa do veículo', type: 'text', required: true },
      { name: 'execution_date', label: 'Data de execução', type: 'date', required: true },
      { name: 'start_time', label: 'Horário de início', type: 'time', required: true },
      { name: 'end_time', label: 'Horário de término', type: 'time' },
      { name: 'total_time', label: 'Tempo total (min)', type: 'number' },
      { name: 'total_distance', label: 'Distância (km)', type: 'number' },
      { name: 'passengers_boarded', label: 'Passageiros embarcados', type: 'number', required: true },
      { name: 'passengers_not_boarded', label: 'Passageiros não embarcados', type: 'number', required: true },
      { name: 'total_passengers', label: 'Total de passageiros', type: 'number', required: true },
      { name: 'fuel_consumption', label: 'Combustível (L)', type: 'number' },
      { name: 'operational_cost', label: 'Custo operacional (R$)', type: 'number' },
      { name: 'punctuality', label: 'Pontualidade (min)', type: 'number', required: true },
      { name: 'route_optimization', label: 'Otimização (%)', type: 'number' },
      {
        name: 'detail',
        label: 'Resumo do evento (exibição)',
        type: 'text',
        persist: false,
        placeholder: 'Ex: Checklist concluído e rota iniciada',
      },
    ],
    transform: (values) => ({
      route_id: values.route_id,
      route_name: values.route_name,
      driver_id: values.driver_id,
      driver_name: values.driver_name,
      vehicle_id: values.vehicle_id,
      vehicle_plate: values.vehicle_plate,
      execution_date: values.execution_date,
      start_time: values.start_time,
      end_time: values.end_time || null,
      total_time: safeNumber(values.total_time, 'int'),
      total_distance: safeNumber(values.total_distance),
      passengers_boarded: safeNumber(values.passengers_boarded, 'int') ?? 0,
      passengers_not_boarded: safeNumber(values.passengers_not_boarded, 'int') ?? 0,
      total_passengers: safeNumber(values.total_passengers, 'int') ?? 0,
      fuel_consumption: safeNumber(values.fuel_consumption),
      operational_cost: safeNumber(values.operational_cost),
      punctuality: safeNumber(values.punctuality, 'int') ?? 0,
      route_optimization: safeNumber(values.route_optimization),
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      time: values.start_time || '—',
      title: values.route_name,
      detail: values.detail || values.driver_name,
    }),
  },
  Custos: {
    entity: 'Custos',
    title: 'Registrar análise de custo',
    description: 'Monitore os principais indicadores financeiros por rota.',
    createLabel: 'Novo custo',
    supabaseTable: 'cost_control',
    fields: [
      { name: 'route_id', label: 'Rota', type: 'select', fetchOptions: fetchRoutes, required: true },
      { name: 'route_name', label: 'Nome da rota', type: 'text', required: true },
      { name: 'period', label: 'Período analisado', type: 'text', required: true, placeholder: 'Ex: Maio/2024' },
      { name: 'total_kilometers', label: 'Total de quilômetros', type: 'number', required: true },
      {
        name: 'average_fuel_consumption',
        label: 'Consumo médio (km/l)',
        type: 'number',
        required: true,
      },
      { name: 'fuel_cost', label: 'Custo do combustível (R$)', type: 'number', required: true },
      { name: 'total_fuel_cost', label: 'Gasto total com combustível (R$)', type: 'number', required: true },
      { name: 'driver_cost', label: 'Custo de motoristas (R$)', type: 'number', required: true },
      {
        name: 'vehicle_maintenance_cost',
        label: 'Custo de manutenção (R$)',
        type: 'number',
        required: true,
      },
      { name: 'operational_cost', label: 'Custo operacional total (R$)', type: 'number', required: true },
      {
        name: 'revenue_per_passenger',
        label: 'Receita por passageiro (R$)',
        type: 'number',
        required: true,
      },
      { name: 'total_revenue', label: 'Receita total (R$)', type: 'number', required: true },
      { name: 'profit_margin', label: 'Margem de lucro (%)', type: 'number', required: true },
      { name: 'cost_per_km', label: 'Custo por km (R$)', type: 'number', required: true },
      { name: 'cost_per_passenger', label: 'Custo por passageiro (R$)', type: 'number', required: true },
      {
        name: 'variation_note',
        label: 'Resumo da variação (exibição)',
        type: 'text',
        persist: false,
        placeholder: 'Ex: +4,2% vs último mês',
      },
    ],
    transform: (values) => ({
      route_id: values.route_id,
      route_name: values.route_name,
      period: values.period,
      total_kilometers: safeNumber(values.total_kilometers) ?? 0,
      average_fuel_consumption: safeNumber(values.average_fuel_consumption) ?? 0,
      fuel_cost: safeNumber(values.fuel_cost) ?? 0,
      total_fuel_cost: safeNumber(values.total_fuel_cost) ?? 0,
      driver_cost: safeNumber(values.driver_cost) ?? 0,
      vehicle_maintenance_cost: safeNumber(values.vehicle_maintenance_cost) ?? 0,
      operational_cost: safeNumber(values.operational_cost) ?? 0,
      revenue_per_passenger: safeNumber(values.revenue_per_passenger) ?? 0,
      total_revenue: safeNumber(values.total_revenue) ?? 0,
      profit_margin: safeNumber(values.profit_margin) ?? 0,
      cost_per_km: safeNumber(values.cost_per_km) ?? 0,
      cost_per_passenger: safeNumber(values.cost_per_passenger) ?? 0,
    }),
    toDisplay: ({ values, record }) => ({
      id: record?.id ?? tempId(),
      label: values.route_name,
      value: values.total_revenue
        ? `R$ ${Number(values.total_revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        : '—',
      variation: values.variation_note || `Margem ${values.profit_margin ?? 0}%`,
    }),
  },
}

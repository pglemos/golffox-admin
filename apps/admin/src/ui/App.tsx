import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
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
  PencilLine,
  Plus,
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
import CreateEntityModal from './CreateEntityModal'
import { entityConfigs, type EntityKey } from './entityConfigs'

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

type EntityDetail = {
  values: Record<string, any>
  optionLabels: Record<string, string>
  record?: Record<string, any>
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

const buildDisplayFromDetail = <K extends EntityKey>(entity: K, detail: EntityDetail) =>
  entityConfigs[entity].toDisplay({
    values: detail.values,
    record: detail.record,
    optionLabels: detail.optionLabels,
  })

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

const initialRouteDetails: Record<string, EntityDetail> = {
  'route-1': {
    record: { id: 'route-1' },
    values: {
      name: 'Rota 1 · Linha Azul',
      company_id: 'company-tech',
      driver_id: 'driver-ana',
      vehicle_id: 'vehicle-gfx-001',
      scheduled_start: '06:00',
      start_location: 'Campus Central',
      destination: 'Terminal Norte',
      status: 'Operando',
      occupancy: '82%',
    },
    optionLabels: {
      company_id: 'Tech Mobility',
      driver_id: 'Ana Souza',
      vehicle_id: 'GFX-001 · Marcopolo G8',
    },
  },
  'route-2': {
    record: { id: 'route-2' },
    values: {
      name: 'Rota 2 · Linha Verde',
      company_id: 'company-city',
      driver_id: 'driver-marcos',
      vehicle_id: 'vehicle-gfx-014',
      scheduled_start: '06:15',
      start_location: 'Pátio Sul',
      destination: 'Distrito Industrial',
      status: 'Operando',
      occupancy: '77%',
    },
    optionLabels: {
      company_id: 'City Logistics',
      driver_id: 'Marcos Lima',
      vehicle_id: 'GFX-014 · Volvo Híbrido 9800',
    },
  },
  'route-3': {
    record: { id: 'route-3' },
    values: {
      name: 'Rota 3 · Linha Leste',
      company_id: 'company-edu',
      driver_id: 'driver-joana',
      vehicle_id: 'vehicle-gfx-031',
      scheduled_start: '06:40',
      start_location: 'Campus Norte',
      destination: 'Estação Aurora',
      status: 'Monitorar',
      occupancy: '63%',
    },
    optionLabels: {
      company_id: 'Edu Trans',
      driver_id: 'Joana Martins',
      vehicle_id: 'GFX-031 · NeoCity Elétrico',
    },
  },
  'route-4': {
    record: { id: 'route-4' },
    values: {
      name: 'Rota 4 · Linha Expressa',
      company_id: 'company-tech',
      driver_id: 'driver-carlos',
      vehicle_id: 'vehicle-gfx-022',
      scheduled_start: '07:00',
      start_location: 'Hub Oeste',
      destination: 'Terminal Central',
      status: 'Alerta',
      occupancy: '91%',
    },
    optionLabels: {
      company_id: 'Tech Mobility',
      driver_id: 'Carlos Alberto',
      vehicle_id: 'GFX-022 · Mercedes-Benz O500',
    },
  },
}

const routeOrder = ['route-1', 'route-2', 'route-3', 'route-4']
const routesToday = routeOrder.map((id) => buildDisplayFromDetail('Rotas', initialRouteDetails[id]))

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

const initialVehicleDetails: Record<string, EntityDetail> = {
  'vehicle-gfx-001': {
    record: { id: 'vehicle-gfx-001' },
    values: {
      plate: 'GFX-001',
      model: 'Marcopolo G8',
      driver_id: 'driver-ana',
      status: 'Em rota',
      position_lat: -23.5503,
      position_lng: -46.6331,
      route_id: 'route-1',
      last_maintenance: '2024-04-15',
      next_maintenance: '2024-06-15',
      is_registered: true,
      last_update_display: 'Há 2 min',
    },
    optionLabels: {
      driver_id: 'Ana Souza',
      route_id: 'Rota 1 · Linha Azul',
    },
  },
  'vehicle-gfx-014': {
    record: { id: 'vehicle-gfx-014' },
    values: {
      plate: 'GFX-014',
      model: 'Volvo Híbrido 9800',
      driver_id: 'driver-marcos',
      status: 'Stand-by',
      position_lat: -23.6121,
      position_lng: -46.7004,
      route_id: 'route-2',
      last_maintenance: '2024-04-10',
      next_maintenance: '2024-06-05',
      is_registered: true,
      last_update_display: 'Há 5 min',
    },
    optionLabels: {
      driver_id: 'Marcos Lima',
      route_id: 'Rota 2 · Linha Verde',
    },
  },
  'vehicle-gfx-022': {
    record: { id: 'vehicle-gfx-022' },
    values: {
      plate: 'GFX-022',
      model: 'Mercedes-Benz O500',
      driver_id: 'support-team',
      status: 'Manutenção',
      position_lat: -23.5402,
      position_lng: -46.6109,
      route_id: 'route-4',
      last_maintenance: '2024-05-01',
      next_maintenance: '2024-07-01',
      is_registered: true,
      last_update_display: 'Há 1 min',
    },
    optionLabels: {
      driver_id: 'Equipe de apoio',
      route_id: 'Rota 4 · Linha Expressa',
    },
  },
  'vehicle-gfx-031': {
    record: { id: 'vehicle-gfx-031' },
    values: {
      plate: 'GFX-031',
      model: 'NeoCity Elétrico',
      driver_id: 'driver-joana',
      status: 'Em rota',
      position_lat: -23.5987,
      position_lng: -46.6502,
      route_id: 'route-3',
      last_maintenance: '2024-04-22',
      next_maintenance: '2024-06-20',
      is_registered: true,
      last_update_display: 'Há 3 min',
    },
    optionLabels: {
      driver_id: 'Joana Martins',
      route_id: 'Rota 3 · Linha Leste',
    },
  },
}

const vehicleOrder = ['vehicle-gfx-001', 'vehicle-gfx-014', 'vehicle-gfx-022', 'vehicle-gfx-031']
const vehicleFleet = vehicleOrder.map((id) => buildDisplayFromDetail('Veículos', initialVehicleDetails[id]))

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

const initialDriverDetails: Record<string, EntityDetail> = {
  'driver-ana': {
    record: { id: 'driver-ana' },
    values: {
      name: 'Ana Souza',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      birth_date: '1986-02-17',
      phone: '(11) 98888-0001',
      email: 'ana.souza@golffox.com',
      address: 'Rua das Flores, 120 - Centro',
      cep: '01000-000',
      cnh: '12345678901',
      cnh_validity: '2026-02-17',
      cnh_category: 'D',
      has_ear: true,
      transport_course_validity: '2025-12-31',
      last_toxicological_exam: '2024-02-01',
      photo_url: 'https://images.golffox.com/drivers/ana.jpg',
      contract_type: 'CLT',
      credentialing_date: '2020-05-10',
      status: 'Em operação',
      linked_company: 'Tech Mobility',
      assigned_routes: 'Rota 1 · Linha Azul',
      availability: 'Segunda a sexta · 05h às 13h',
      last_update: '2024-05-02',
      route_badge: 'Linha Azul',
      shift_label: 'Manhã',
    },
    optionLabels: {},
  },
  'driver-marcos': {
    record: { id: 'driver-marcos' },
    values: {
      name: 'Marcos Lima',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      birth_date: '1984-09-03',
      phone: '(11) 97777-0002',
      email: 'marcos.lima@golffox.com',
      address: 'Av. Horizonte, 45 - Vila Nova',
      cep: '04500-000',
      cnh: '98765432100',
      cnh_validity: '2025-09-03',
      cnh_category: 'D',
      has_ear: true,
      transport_course_validity: '2025-06-30',
      last_toxicological_exam: '2024-01-15',
      photo_url: 'https://images.golffox.com/drivers/marcos.jpg',
      contract_type: 'CLT',
      credentialing_date: '2019-08-20',
      status: 'Em operação',
      linked_company: 'City Logistics',
      assigned_routes: 'Rota 2 · Linha Verde',
      availability: 'Segunda a sábado · 06h às 15h',
      last_update: '2024-04-28',
      route_badge: 'Linha Verde',
      shift_label: 'Manhã',
    },
    optionLabels: {},
  },
  'driver-joana': {
    record: { id: 'driver-joana' },
    values: {
      name: 'Joana Martins',
      cpf: '456.789.123-00',
      rg: '45.678.912-3',
      birth_date: '1990-11-22',
      phone: '(11) 96666-0003',
      email: 'joana.martins@golffox.com',
      address: 'Rua do Sol, 88 - Jardim Leste',
      cep: '03300-000',
      cnh: '45678912300',
      cnh_validity: '2027-11-22',
      cnh_category: 'D',
      has_ear: false,
      transport_course_validity: '2026-05-15',
      last_toxicological_exam: '2024-03-05',
      photo_url: 'https://images.golffox.com/drivers/joana.jpg',
      contract_type: 'terceirizado',
      credentialing_date: '2021-03-12',
      status: 'Revisar',
      linked_company: 'Edu Trans',
      assigned_routes: 'Rota 3 · Linha Leste',
      availability: 'Escala flexível · 06h às 14h',
      last_update: '2024-05-04',
      route_badge: 'Linha Leste',
      shift_label: 'Manhã',
    },
    optionLabels: {},
  },
  'driver-carlos': {
    record: { id: 'driver-carlos' },
    values: {
      name: 'Carlos Alberto',
      cpf: '741.852.963-00',
      rg: '74.185.296-3',
      birth_date: '1979-07-09',
      phone: '(11) 95555-0004',
      email: 'carlos.alberto@golffox.com',
      address: 'Rua Nova Esperança, 215 - Parque Oeste',
      cep: '02900-000',
      cnh: '74185296300',
      cnh_validity: '2025-07-09',
      cnh_category: 'E',
      has_ear: true,
      transport_course_validity: '2025-10-10',
      last_toxicological_exam: '2024-02-18',
      photo_url: 'https://images.golffox.com/drivers/carlos.jpg',
      contract_type: 'CLT',
      credentialing_date: '2018-01-25',
      status: 'Stand-by',
      linked_company: 'Tech Mobility',
      assigned_routes: 'Reserva Estratégica',
      availability: 'Plantões alternados · 14h às 22h',
      last_update: '2024-04-30',
      route_badge: 'Reserva',
      shift_label: 'Flex',
    },
    optionLabels: {},
  },
}

const driverOrder = ['driver-ana', 'driver-marcos', 'driver-joana', 'driver-carlos']
const driverRoster = driverOrder.map((id) => buildDisplayFromDetail('Motoristas', initialDriverDetails[id]))

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

const initialCompanyDetails: Record<string, EntityDetail> = {
  'company-tech': {
    record: { id: 'company-tech' },
    values: {
      name: 'Tech Mobility',
      cnpj: '12.345.678/0001-90',
      contact: 'operacoes@techmobility.com',
      status: 'Ativo',
      address_text: 'Av. Inovação, 1000 - Centro, São Paulo - SP',
      address_lat: -23.55052,
      address_lng: -46.633308,
      contracted_passengers: 480,
    },
    optionLabels: {},
  },
  'company-city': {
    record: { id: 'company-city' },
    values: {
      name: 'City Logistics',
      cnpj: '98.765.432/0001-10',
      contact: 'contato@citylog.com',
      status: 'Negociação',
      address_text: 'Rua das Rotas, 210 - Campinas - SP',
      address_lat: -22.909938,
      address_lng: -47.062633,
      contracted_passengers: 260,
    },
    optionLabels: {},
  },
  'company-edu': {
    record: { id: 'company-edu' },
    values: {
      name: 'Edu Trans',
      cnpj: '54.321.987/0001-45',
      contact: 'suporte@edutrans.com',
      status: 'Atendimento prioritário',
      address_text: 'Alameda das Universidades, 45 - Sorocaba - SP',
      address_lat: -23.5015,
      address_lng: -47.4526,
      contracted_passengers: 320,
    },
    optionLabels: {},
  },
}

const companyOrder = ['company-tech', 'company-city', 'company-edu']
const companyPartners = companyOrder.map((id) => buildDisplayFromDetail('Empresas', initialCompanyDetails[id]))

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

const initialPermissionDetails: Record<string, EntityDetail> = {
  'perm-admin': {
    record: { id: 'perm-admin' },
    values: {
      name: 'Administrador',
      description: 'Acesso total',
      access: 'Rotas, Veículos, Motoristas, Custos, Relatórios',
      is_admin_feature: true,
      users_display: 3,
    },
    optionLabels: {},
  },
  'perm-operador': {
    record: { id: 'perm-operador' },
    values: {
      name: 'Operador',
      description: 'Gestão de rotas e alertas',
      access: 'Rotas, Alertas, Suporte',
      is_admin_feature: false,
      users_display: 8,
    },
    optionLabels: {},
  },
  'perm-analista': {
    record: { id: 'perm-analista' },
    values: {
      name: 'Analista',
      description: 'Relatórios e custos',
      access: 'Relatórios, Custos, Histórico',
      is_admin_feature: false,
      users_display: 5,
    },
    optionLabels: {},
  },
  'perm-motorista': {
    record: { id: 'perm-motorista' },
    values: {
      name: 'Motorista',
      description: 'Aplicativo embarcado',
      access: 'Rotas atribuídas, Checklist diário',
      is_admin_feature: false,
      users_display: 24,
    },
    optionLabels: {},
  },
}

const permissionOrder = ['perm-admin', 'perm-operador', 'perm-analista', 'perm-motorista']
const permissionMatrix = permissionOrder.map((id) => buildDisplayFromDetail('Permissões', initialPermissionDetails[id]))

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

const initialSupportDetails: Record<string, EntityDetail> = {
  'support-chat': {
    record: { id: 'support-chat' },
    values: {
      subject: 'Fila de atendimento com 2 chamados',
      message: 'Monitorar SLA do chat em tempo real durante pico matinal.',
      priority: 'Média',
      channel: 'Chat',
      contact: 'chat@golffox.com',
    },
    optionLabels: {},
  },
  'support-phone': {
    record: { id: 'support-phone' },
    values: {
      subject: 'Tempo médio 1m45s',
      message: 'Equipe pronta para escalonar incidentes críticos.',
      priority: 'Alta',
      channel: 'Telefone',
      contact: '+55 11 4000-1234',
    },
    optionLabels: {},
  },
  'support-portal': {
    record: { id: 'support-portal' },
    values: {
      subject: '8 solicitações abertas',
      message: 'Atualizar artigos da base de conhecimento mais acessados.',
      priority: 'Baixa',
      channel: 'E-mail',
      contact: 'portal@golffox.com',
    },
    optionLabels: {},
  },
}

const supportOrder = ['support-chat', 'support-phone', 'support-portal']
const supportChannels = supportOrder.map((id) => buildDisplayFromDetail('Suporte', initialSupportDetails[id]))

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

const initialAlertDetails: Record<string, EntityDetail> = {
  'alert-critical': {
    record: { id: 'alert-critical' },
    values: {
      type: 'Crítico',
      title: 'Veículo parado na Rota 4',
      message: 'Veículo parado na Rota 4 há 3 minutos',
      timestamp: '2024-05-10T07:12',
      route_id: 'route-4',
      vehicle_id: 'vehicle-gfx-022',
      user_id: 'user-marina',
      action_label: 'Acionar suporte avançado',
    },
    optionLabels: {
      route_id: 'Rota 4 · Linha Expressa',
      vehicle_id: 'GFX-022 · Mercedes-Benz O500',
      user_id: 'Marina Ribeiro',
    },
  },
  'alert-attention': {
    record: { id: 'alert-attention' },
    values: {
      type: 'Atenção',
      title: 'Trânsito denso na zona leste',
      message: 'Trânsito denso próximo ao Campus Norte',
      timestamp: '2024-05-10T07:05',
      route_id: 'route-3',
      vehicle_id: 'vehicle-gfx-031',
      user_id: 'user-joao',
      action_label: 'Sugestão de rota alternativa',
    },
    optionLabels: {
      route_id: 'Rota 3 · Linha Leste',
      vehicle_id: 'GFX-031 · NeoCity Elétrico',
      user_id: 'João Batista',
    },
  },
  'alert-info': {
    record: { id: 'alert-info' },
    values: {
      type: 'Informativo',
      title: 'Firmware atualizado',
      message: 'Atualização de firmware concluída no GFX-031',
      timestamp: '2024-05-10T06:55',
      route_id: 'route-1',
      vehicle_id: 'vehicle-gfx-001',
      user_id: 'user-marina',
      action_label: 'Nenhuma ação necessária',
    },
    optionLabels: {
      route_id: 'Rota 1 · Linha Azul',
      vehicle_id: 'GFX-001 · Marcopolo G8',
      user_id: 'Marina Ribeiro',
    },
  },
}

const alertOrder = ['alert-critical', 'alert-attention', 'alert-info']
const alertFeed = alertOrder.map((id) => buildDisplayFromDetail('Alertas', initialAlertDetails[id]))

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

const initialReportDetails: Record<string, EntityDetail> = {
  'report-occupancy': {
    record: { id: 'report-occupancy' },
    values: {
      name: 'Ocupação diária',
      frequency: 'Diário',
      delivery: '08:00',
    },
    optionLabels: {},
  },
  'report-routes': {
    record: { id: 'report-routes' },
    values: {
      name: 'Análise de rotas',
      frequency: 'Semanal',
      delivery: 'Segunda-feira',
    },
    optionLabels: {},
  },
  'report-drivers': {
    record: { id: 'report-drivers' },
    values: {
      name: 'Performance dos motoristas',
      frequency: 'Mensal',
      delivery: 'Dia 02',
    },
    optionLabels: {},
  },
  'report-finance': {
    record: { id: 'report-finance' },
    values: {
      name: 'Resumo financeiro',
      frequency: 'Mensal',
      delivery: 'Dia 05',
    },
    optionLabels: {},
  },
}

const reportOrder = ['report-occupancy', 'report-routes', 'report-drivers', 'report-finance']
const reportCatalog = reportOrder.map((id) => buildDisplayFromDetail('Relatórios', initialReportDetails[id]))

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

const initialHistoryDetails: Record<string, EntityDetail> = {
  'history-start': {
    record: { id: 'history-start' },
    values: {
      route_id: 'route-1',
      route_name: 'Início das operações',
      driver_id: 'driver-ana',
      driver_name: 'Ana Souza',
      vehicle_id: 'vehicle-gfx-001',
      vehicle_plate: 'GFX-001',
      execution_date: '2024-05-10',
      start_time: '05:50',
      end_time: '06:40',
      total_time: 50,
      total_distance: 24.5,
      passengers_boarded: 28,
      passengers_not_boarded: 2,
      total_passengers: 30,
      fuel_consumption: 12.4,
      operational_cost: 1450,
      punctuality: 0,
      route_optimization: 8.5,
      detail: 'Checklist concluído para as rotas da manhã',
    },
    optionLabels: {
      route_id: 'Rota 1 · Linha Azul',
      driver_id: 'Ana Souza',
      vehicle_id: 'GFX-001 · Marcopolo G8',
    },
  },
  'history-board': {
    record: { id: 'history-board' },
    values: {
      route_id: 'route-2',
      route_name: 'Primeiro embarque',
      driver_id: 'driver-marcos',
      driver_name: 'Marcos Lima',
      vehicle_id: 'vehicle-gfx-014',
      vehicle_plate: 'GFX-014',
      execution_date: '2024-05-10',
      start_time: '06:30',
      end_time: '07:15',
      total_time: 45,
      total_distance: 18.7,
      passengers_boarded: 28,
      passengers_not_boarded: 0,
      total_passengers: 28,
      fuel_consumption: 10.1,
      operational_cost: 980,
      punctuality: 1,
      route_optimization: 5.2,
      detail: 'Rota 1 registrou 28 passageiros',
    },
    optionLabels: {
      route_id: 'Rota 2 · Linha Verde',
      driver_id: 'Marcos Lima',
      vehicle_id: 'GFX-014 · Volvo Híbrido 9800',
    },
  },
  'history-adjust': {
    record: { id: 'history-adjust' },
    values: {
      route_id: 'route-3',
      route_name: 'Ajuste de rota',
      driver_id: 'driver-joana',
      driver_name: 'Joana Martins',
      vehicle_id: 'vehicle-gfx-031',
      vehicle_plate: 'GFX-031',
      execution_date: '2024-05-10',
      start_time: '06:45',
      end_time: '07:40',
      total_time: 55,
      total_distance: 21.4,
      passengers_boarded: 25,
      passengers_not_boarded: 3,
      total_passengers: 28,
      fuel_consumption: 11.3,
      operational_cost: 1120,
      punctuality: -4,
      route_optimization: 6.1,
      detail: 'Desvio de 4 minutos contornado na Rota 3',
    },
    optionLabels: {
      route_id: 'Rota 3 · Linha Leste',
      driver_id: 'Joana Martins',
      vehicle_id: 'GFX-031 · NeoCity Elétrico',
    },
  },
  'history-alert': {
    record: { id: 'history-alert' },
    values: {
      route_id: 'route-4',
      route_name: 'Alerta crítico tratado',
      driver_id: 'driver-carlos',
      driver_name: 'Carlos Alberto',
      vehicle_id: 'vehicle-gfx-022',
      vehicle_plate: 'GFX-022',
      execution_date: '2024-05-10',
      start_time: '07:10',
      end_time: '08:05',
      total_time: 55,
      total_distance: 19.2,
      passengers_boarded: 26,
      passengers_not_boarded: 1,
      total_passengers: 27,
      fuel_consumption: 9.8,
      operational_cost: 1310,
      punctuality: 3,
      route_optimization: 4.8,
      detail: 'Equipe acionada para suporte ao veículo GFX-022',
    },
    optionLabels: {
      route_id: 'Rota 4 · Linha Expressa',
      driver_id: 'Carlos Alberto',
      vehicle_id: 'GFX-022 · Mercedes-Benz O500',
    },
  },
}

const historyOrder = ['history-start', 'history-board', 'history-adjust', 'history-alert']
const historyTimeline = historyOrder.map((id) => buildDisplayFromDetail('Histórico', initialHistoryDetails[id]))

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

const initialCostDetails: Record<string, EntityDetail> = {
  'cost-operational': {
    record: { id: 'cost-operational' },
    values: {
      route_id: 'route-1',
      route_name: 'Custo operacional diário',
      period: 'Maio/2024',
      total_kilometers: 420,
      average_fuel_consumption: 3.4,
      fuel_cost: 5.89,
      total_fuel_cost: 2450,
      driver_cost: 3800,
      vehicle_maintenance_cost: 1750,
      operational_cost: 12450,
      revenue_per_passenger: 8.4,
      total_revenue: 18600,
      profit_margin: 33,
      cost_per_km: 29.6,
      cost_per_passenger: 5.1,
      variation_note: '+4,2%',
    },
    optionLabels: {
      route_id: 'Rota 1 · Linha Azul',
    },
  },
  'cost-revenue': {
    record: { id: 'cost-revenue' },
    values: {
      route_id: 'route-2',
      route_name: 'Receita projetada',
      period: 'Maio/2024',
      total_kilometers: 380,
      average_fuel_consumption: 3.7,
      fuel_cost: 5.75,
      total_fuel_cost: 2180,
      driver_cost: 3540,
      vehicle_maintenance_cost: 1650,
      operational_cost: 11280,
      revenue_per_passenger: 8.9,
      total_revenue: 19820,
      profit_margin: 36,
      cost_per_km: 29.7,
      cost_per_passenger: 4.9,
      variation_note: '+6,1%',
    },
    optionLabels: {
      route_id: 'Rota 2 · Linha Verde',
    },
  },
  'cost-margin': {
    record: { id: 'cost-margin' },
    values: {
      route_id: 'route-3',
      route_name: 'Margem estimada',
      period: 'Maio/2024',
      total_kilometers: 360,
      average_fuel_consumption: 3.2,
      fuel_cost: 5.6,
      total_fuel_cost: 2010,
      driver_cost: 3320,
      vehicle_maintenance_cost: 1490,
      operational_cost: 10260,
      revenue_per_passenger: 8.1,
      total_revenue: 15300,
      profit_margin: 33,
      cost_per_km: 28.5,
      cost_per_passenger: 4.7,
      variation_note: '+1,8%',
    },
    optionLabels: {
      route_id: 'Rota 3 · Linha Leste',
    },
  },
}

const costOrder = ['cost-operational', 'cost-revenue', 'cost-margin']
const costSummary = costOrder.map((id) => buildDisplayFromDetail('Custos', initialCostDetails[id]))

const expenseBreakdown = [
  { id: 'expense-fuel', item: 'Combustível e energia', percentage: '38%', note: 'Contratos indexados ao reajuste trimestral' },
  { id: 'expense-payroll', item: 'Folha operacional', percentage: '27%', note: 'Inclui benefícios e treinamentos recorrentes' },
  { id: 'expense-maintenance', item: 'Manutenção e peças', percentage: '19%', note: 'Programas preventivos e corretivos' },
  { id: 'expense-tech', item: 'Tecnologia e licenças', percentage: '11%', note: 'Softwares embarcados e conectividade' },
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
  'group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 p-5 text-black shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:shadow-[0_24px_65px_rgba(2,6,23,0.55)] sm:rounded-3xl sm:p-6'

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

const CreateButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    type="button"
    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-500/15 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-indigo-400/40 dark:bg-indigo-400/10 dark:text-indigo-200 dark:hover:bg-indigo-400/20"
  >
    <Plus className="h-4 w-4" />
    {label}
  </motion.button>
)

const EditButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Editar ${label}`}
    className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10"
  >
    <PencilLine className="h-4 w-4" />
    <span className="hidden sm:inline">Editar</span>
  </button>
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
  const [routes, setRoutes] = useState(routesToday)
  const [vehicles, setVehicles] = useState(vehicleFleet)
  const [drivers, setDrivers] = useState(driverRoster)
  const [companies, setCompanies] = useState(companyPartners)
  const [permissions, setPermissions] = useState(permissionMatrix)
  const [supportEntries, setSupportEntries] = useState(supportChannels)
  const [alerts, setAlerts] = useState(alertFeed)
  const [reports, setReports] = useState(reportCatalog)
  const [historyEntries, setHistoryEntries] = useState(historyTimeline)
  const [costCards, setCostCards] = useState(costSummary)
  const [expenseCards, setExpenseCards] = useState(expenseBreakdown)
  const [routeDetails, setRouteDetails] = useState<Record<string, EntityDetail>>(initialRouteDetails)
  const [vehicleDetails, setVehicleDetails] = useState<Record<string, EntityDetail>>(initialVehicleDetails)
  const [driverDetails, setDriverDetails] = useState<Record<string, EntityDetail>>(initialDriverDetails)
  const [companyDetails, setCompanyDetails] = useState<Record<string, EntityDetail>>(initialCompanyDetails)
  const [permissionDetails, setPermissionDetails] = useState<Record<string, EntityDetail>>(initialPermissionDetails)
  const [supportDetails, setSupportDetails] = useState<Record<string, EntityDetail>>(initialSupportDetails)
  const [alertDetails, setAlertDetails] = useState<Record<string, EntityDetail>>(initialAlertDetails)
  const [reportDetails, setReportDetails] = useState<Record<string, EntityDetail>>(initialReportDetails)
  const [historyDetails, setHistoryDetails] = useState<Record<string, EntityDetail>>(initialHistoryDetails)
  const [costDetails, setCostDetails] = useState<Record<string, EntityDetail>>(initialCostDetails)
  const [createEntity, setCreateEntity] = useState<EntityKey | null>(null)
  const [editRequest, setEditRequest] = useState<{ entity: EntityKey; id: string } | null>(null)

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
  theme === 'dark' ? 'bg-[#040712] text-slate-100' : 'bg-[#f4f6ff] text-slate-950'

  const orbTransition = { duration: 18, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }

  const badgeText = headerBadges[activeNav] ?? 'Sincronização ativa'
  const activeConfig = createEntity
    ? entityConfigs[createEntity]
    : editRequest
    ? entityConfigs[editRequest.entity]
    : null

  const handleEntitySubmitted = ({
    entity,
    values,
    record,
    optionLabels,
    mode,
    contextId,
  }: {
    entity: EntityKey
    values: Record<string, any>
    record?: Record<string, any>
    optionLabels: Record<string, string>
    mode: 'create' | 'edit'
    contextId?: string
  }) => {
    const config = entityConfigs[entity]
    const display = config.toDisplay({ values, record, optionLabels }) as { id?: string }
    const resolvedId =
      (typeof record?.id === 'string' && record.id) ||
      (typeof display.id === 'string' && display.id) ||
      (contextId ?? '')

    const recordWithId =
      record && typeof record.id === 'string'
        ? record
        : resolvedId
        ? { ...(record ?? {}), id: resolvedId }
        : record

    const nextDetail: EntityDetail = {
      values,
      optionLabels,
      record: recordWithId,
    }

    const applyUpdate = <T extends { id?: string }>(collection: T[]): T[] => {
      if (mode === 'edit') {
        const exists = collection.some((item) => item.id === resolvedId)
        if (!exists) {
          return [...collection, display as T]
        }
        return collection.map((item) => (item.id === resolvedId ? (display as T) : item))
      }
      return [...collection, display as T]
    }

    switch (entity) {
      case 'Rotas':
        if (resolvedId) {
          setRouteDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setRoutes((prev) => applyUpdate(prev as (typeof routesToday)[number][]))
        break
      case 'Veículos':
        if (resolvedId) {
          setVehicleDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setVehicles((prev) => applyUpdate(prev as (typeof vehicleFleet)[number][]))
        break
      case 'Motoristas':
        if (resolvedId) {
          setDriverDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setDrivers((prev) => applyUpdate(prev as (typeof driverRoster)[number][]))
        break
      case 'Empresas':
        if (resolvedId) {
          setCompanyDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setCompanies((prev) => applyUpdate(prev as (typeof companyPartners)[number][]))
        break
      case 'Permissões':
        if (resolvedId) {
          setPermissionDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setPermissions((prev) => applyUpdate(prev as (typeof permissionMatrix)[number][]))
        break
      case 'Suporte':
        if (resolvedId) {
          setSupportDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setSupportEntries((prev) => applyUpdate(prev as (typeof supportChannels)[number][]))
        break
      case 'Alertas':
        if (resolvedId) {
          setAlertDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setAlerts((prev) => applyUpdate(prev as (typeof alertFeed)[number][]))
        break
      case 'Relatórios':
        if (resolvedId) {
          setReportDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setReports((prev) => applyUpdate(prev as (typeof reportCatalog)[number][]))
        break
      case 'Histórico':
        if (resolvedId) {
          setHistoryDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setHistoryEntries((prev) => applyUpdate(prev as (typeof historyTimeline)[number][]))
        break
      case 'Custos':
        if (resolvedId) {
          setCostDetails((prev) => ({ ...prev, [resolvedId]: nextDetail }))
        }
        setCostCards((prev) => applyUpdate(prev as (typeof costSummary)[number][]))
        break
      default:
        break
    }
  }

  const closeModal = () => {
    setCreateEntity(null)
    setEditRequest(null)
  }

  const openEdit = (entity: EntityKey, id: string) => {
    setCreateEntity(null)
    setEditRequest({ entity, id })
  }

  const getEntityDetail = (entity: EntityKey, id: string): EntityDetail | undefined => {
    switch (entity) {
      case 'Rotas':
        return routeDetails[id]
      case 'Veículos':
        return vehicleDetails[id]
      case 'Motoristas':
        return driverDetails[id]
      case 'Empresas':
        return companyDetails[id]
      case 'Permissões':
        return permissionDetails[id]
      case 'Suporte':
        return supportDetails[id]
      case 'Alertas':
        return alertDetails[id]
      case 'Relatórios':
        return reportDetails[id]
      case 'Histórico':
        return historyDetails[id]
      case 'Custos':
        return costDetails[id]
      default:
        return undefined
    }
  }

  const modalMode: 'create' | 'edit' = editRequest ? 'edit' : 'create'
  const modalDetail = editRequest ? getEntityDetail(editRequest.entity, editRequest.id) : undefined
  const shouldRenderModal = Boolean(activeConfig && (modalMode === 'create' || modalDetail))

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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Operação do dia</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Acompanhe horários, ocupação e status de cada rota.</p>
                </div>
                <CreateButton label={entityConfigs['Rotas'].createLabel} onClick={() => setCreateEntity('Rotas')} />
              </div>
              <div className="mt-4 space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id ?? `${route.name}-${route.departure}`}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-black dark:text-white">{route.name}</p>
                      <p className="text-xs text-black/70 dark:text-slate-300">Partida às {route.departure}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                      <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                        Ocupação {route.occupancy}
                      </span>
                      <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                        {route.status}
                      </span>
                      {route.id && (
                        <EditButton label={route.name ?? 'rota'} onClick={() => openEdit('Rotas', route.id as string)} />
                      )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Status da frota</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Monitore a disponibilidade e atualização da frota.</p>
                </div>
                <CreateButton label={entityConfigs['Veículos'].createLabel} onClick={() => setCreateEntity('Veículos')} />
              </div>
              <div className="mt-4 space-y-3">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id ?? vehicle.code}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-6"
                  >
                    <span className="font-semibold text-black dark:text-white">{vehicle.code}</span>
                    <span>{vehicle.model}</span>
                    <span className="text-black/70 dark:text-slate-300">{vehicle.driver ?? '—'}</span>
                    <span className="text-black/70 dark:text-slate-300">{vehicle.lastUpdate}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {vehicle.status}
                    </span>
                    {vehicle.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={vehicle.code ?? 'veículo'} onClick={() => openEdit('Veículos', vehicle.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Escala operacional</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Gerencie turnos e disponibilidade da equipe de motoristas.</p>
                </div>
                <CreateButton label={entityConfigs['Motoristas'].createLabel} onClick={() => setCreateEntity('Motoristas')} />
              </div>
              <div className="mt-4 space-y-3">
                {drivers.map((driver) => (
                  <div
                    key={driver.id ?? driver.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-5"
                  >
                    <span className="font-semibold text-black dark:text-white">{driver.name}</span>
                    <span>{driver.route}</span>
                    <span>{driver.shift}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {driver.status}
                    </span>
                    {driver.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={driver.name ?? 'motorista'} onClick={() => openEdit('Motoristas', driver.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Parceiros ativos</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Cadastre novas empresas e acompanhe o status do relacionamento.</p>
                </div>
                <CreateButton label={entityConfigs['Empresas'].createLabel} onClick={() => setCreateEntity('Empresas')} />
              </div>
              <div className="mt-4 space-y-3">
                {companies.map((company) => (
                  <div
                    key={company.id ?? company.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{company.name}</span>
                    <span>{company.contact}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {company.status}
                    </span>
                    {company.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={company.name ?? 'empresa'} onClick={() => openEdit('Empresas', company.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Matriz de acesso</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Defina perfis de permissão personalizados para cada time.</p>
                </div>
                <CreateButton label={entityConfigs['Permissões'].createLabel} onClick={() => setCreateEntity('Permissões')} />
              </div>
              <div className="mt-4 space-y-3">
                {permissions.map((role) => (
                  <div
                    key={role.id ?? role.role}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{role.role}</span>
                    <span>{role.scope}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {role.users} usuários
                    </span>
                    {role.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={role.role ?? 'permissão'} onClick={() => openEdit('Permissões', role.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Canais de atendimento</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Organize chamados e acompanhe a capacidade do time de suporte.</p>
                </div>
                <CreateButton label={entityConfigs['Suporte'].createLabel} onClick={() => setCreateEntity('Suporte')} />
              </div>
              <div className="mt-4 space-y-3">
                {supportEntries.map((channel) => (
                  <div
                    key={channel.id ?? channel.channel}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{channel.channel}</span>
                    <span>{channel.availability}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {channel.detail}
                    </span>
                    {channel.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={channel.channel ?? 'canal'} onClick={() => openEdit('Suporte', channel.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Fila de alertas</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Dispare alertas manuais ou automatizados para a equipe em campo.</p>
                </div>
                <CreateButton label={entityConfigs['Alertas'].createLabel} onClick={() => setCreateEntity('Alertas')} />
              </div>
              <div className="mt-4 space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id ?? alert.message}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-5"
                  >
                    <span className="font-semibold text-black dark:text-white">{alert.level}</span>
                    <span>{alert.message}</span>
                    <span className="text-black/70 dark:text-slate-300">{alert.time}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {alert.action}
                    </span>
                    {alert.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={alert.level ?? 'alerta'} onClick={() => openEdit('Alertas', alert.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Catálogo de relatórios</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Agende entregas automáticas e acompanhe os principais indicadores.</p>
                </div>
                <CreateButton label={entityConfigs['Relatórios'].createLabel} onClick={() => setCreateEntity('Relatórios')} />
              </div>
              <div className="mt-4 space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id ?? report.name}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-4"
                  >
                    <span className="font-semibold text-black dark:text-white">{report.name}</span>
                    <span>{report.frequency}</span>
                    <span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-center font-semibold text-black dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      Entrega: {report.delivery}
                    </span>
                    {report.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={report.name ?? 'relatório'} onClick={() => openEdit('Relatórios', report.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Linha do tempo</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Registre eventos relevantes para auditoria e análises futuras.</p>
                </div>
                <CreateButton label={entityConfigs['Histórico'].createLabel} onClick={() => setCreateEntity('Histórico')} />
              </div>
              <div className="mt-4 space-y-3">
                {historyEntries.map((event) => (
                  <div
                    key={event.id ?? event.time + event.title}
                    className="grid gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200 sm:grid-cols-[80px_1fr_auto]"
                  >
                    <span className="font-semibold text-black dark:text-white">{event.time}</span>
                    <div>
                      <p className="font-semibold text-black dark:text-white">{event.title}</p>
                      <p className="text-sm text-black/70 dark:text-slate-300">{event.detail}</p>
                    </div>
                    {event.id && (
                      <div className="flex items-center justify-start sm:justify-end">
                        <EditButton label={event.title ?? 'evento'} onClick={() => openEdit('Histórico', event.id as string)} />
                      </div>
                    )}
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">Resumo financeiro</h2>
                  <p className="mt-1 text-sm text-black/70 dark:text-slate-300">Centralize os principais indicadores de custos por rota.</p>
                </div>
                <CreateButton label={entityConfigs['Custos'].createLabel} onClick={() => setCreateEntity('Custos')} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {costCards.map((item) => (
                  <div
                    key={item.id ?? item.label}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/70 dark:text-slate-300">
                        {item.label}
                      </p>
                      {item.id && (
                        <EditButton label={item.label ?? 'custo'} onClick={() => openEdit('Custos', item.id as string)} />
                      )}
                    </div>
                    <p className="mt-2 text-2xl font-bold text-black dark:text-white">{item.value}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">{item.variation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${cardBase} border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.05]`}>
              <h2 className="text-lg font-semibold text-black dark:text-white">Distribuição de custos</h2>
              <div className="mt-4 space-y-3">
                {expenseCards.map((expense) => (
                  <div
                    key={expense.id ?? expense.item}
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
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 pb-20 pt-10 sm:gap-8 sm:px-6 sm:pb-16 sm:pt-12 lg:flex-row lg:gap-10 lg:px-12">
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

            <LayoutGroup id="desktop-nav">
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
                          layoutId="navHighlightDesktop"
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

          <main className="flex flex-1 flex-col gap-6 sm:gap-8">
            <div
              className={`${cardBase} flex flex-col gap-4 border-slate-200/60 bg-white/85 dark:border-white/10 dark:bg-white/[0.06] lg:hidden`}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/40">
                  🦊
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black dark:text-indigo-300">
                    Golf Fox Admin
                  </span>
                  <span className="text-sm font-semibold text-black dark:text-slate-100">Premium 9.0</span>
                </div>
              </div>

              <LayoutGroup id="mobile-nav">
                <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1">
                  {navItems.map((item) => {
                    const isActive = item.label === activeNav
                    return (
                      <motion.button
                        key={item.label}
                        type="button"
                        layout
                        onClick={() => setActiveNav(item.label)}
                        whileTap={{ scale: 0.97 }}
                        className={`relative flex min-w-max items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                          isActive
                            ? 'text-white shadow-[0_12px_35px_rgba(59,130,246,0.25)]'
                            : 'text-black hover:text-black dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="navHighlightMobile"
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/90 to-sky-500/70"
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </nav>
              </LayoutGroup>
            </div>

            <header
              className={`${cardBase} flex flex-col gap-5 border-slate-200/60 bg-white/85 px-5 py-5 dark:border-white/10 dark:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black dark:text-indigo-300">Golf Fox Admin</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xl font-semibold sm:text-2xl">
                  {activeNav}
                  <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-black backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                    {badgeText}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200/70 bg-white/80 text-black shadow-[0_16px_35px_rgba(15,23,42,0.12)] transition-all duration-500 hover:shadow-[0_20px_45px_rgba(99,102,241,0.18)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-[0_26px_60px_rgba(2,6,23,0.55)] dark:hover:shadow-[0_32px_70px_rgba(8,12,24,0.6)] sm:h-12 sm:w-12"
                style={{ backdropFilter: 'blur(18px)' }}
              >
                <motion.span
                  layout
                  className={`absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-indigo-500/85 to-sky-500/65 transition-opacity duration-500 ${
                    theme === 'dark' ? 'opacity-90' : 'opacity-0'
                  }`}
                />
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black shadow-inner shadow-white/40 dark:bg-white/10 dark:text-white/90"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </motion.span>
                <span className="sr-only">
                  {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
                </span>
              </motion.button>
            </header>

            {renderSectionBody()}

            <AnimatePresence>
              {shouldRenderModal && activeConfig && (
                <CreateEntityModal
                  key={`${activeConfig.entity}-${modalMode}`}
                  config={activeConfig}
                  onClose={closeModal}
                  onSubmit={handleEntitySubmitted}
                  mode={modalMode}
                  initialValues={modalMode === 'edit' ? modalDetail?.values : undefined}
                  initialOptionLabels={modalMode === 'edit' ? modalDetail?.optionLabels : undefined}
                  initialRecord={modalMode === 'edit' ? modalDetail?.record : undefined}
                  contextId={modalMode === 'edit' ? editRequest?.id : undefined}
                />
              )}
            </AnimatePresence>

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

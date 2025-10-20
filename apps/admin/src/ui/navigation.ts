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
} from 'lucide-react'

export type NavItem = { icon: LucideIcon; label: string; path: string }

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutGrid, label: 'Painel', path: '/' },
  { icon: MapIcon, label: 'Mapa', path: '/map' },
  { icon: Route, label: 'Rotas', path: '/routes' },
  { icon: Bus, label: 'Veículos', path: '/vehicles' },
  { icon: Users, label: 'Motoristas', path: '/drivers' },
  { icon: Building2, label: 'Empresas', path: '/companies' },
  { icon: ShieldCheck, label: 'Permissões', path: '/permissions' },
  { icon: LifeBuoy, label: 'Suporte', path: '/support' },
  { icon: Bell, label: 'Alertas', path: '/alerts' },
  { icon: FileBarChart, label: 'Relatórios', path: '/reports' },
  { icon: History, label: 'Histórico', path: '/history' },
  { icon: Wallet2, label: 'Custos', path: '/costs' },
]

export const EXTRA_ROUTE_LABELS: Record<string, string> = {
  '/settings': 'Configurações e marca',
}

import React from 'react'
import Image from 'next/image'
import type { View } from '../../types/types'
import { VIEWS } from '../../../constants'
import {
  DashboardIcon,
  MapIcon,
  RouteIcon,
  AlertIcon,
  ReportIcon,
  TruckIcon,
  UserCircleIcon,
  LifebuoyIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '../../../components/icons/Icons'

interface SidebarProps {
  currentView: View
  setCurrentView: (view: View) => void
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const items: { icon: React.ReactNode; label: View }[] = [
    { icon: <DashboardIcon className="h-5 w-5" variant="premium" />, label: VIEWS.DASHBOARD },
    { icon: <MapIcon className="h-5 w-5" variant="float" />, label: VIEWS.MAP },
    { icon: <RouteIcon className="h-5 w-5" variant="hover" />, label: VIEWS.ROUTES },
    { icon: <TruckIcon className="h-5 w-5" variant="scale" />, label: VIEWS.VEHICLES },
    { icon: <UserCircleIcon className="h-5 w-5" variant="hover" />, label: VIEWS.DRIVERS },
    { icon: <BuildingOfficeIcon className="h-5 w-5" variant="scale" />, label: VIEWS.COMPANIES },
    { icon: <AdjustmentsHorizontalIcon className="h-5 w-5" variant="rotate" />, label: VIEWS.PERMISSIONS },
    { icon: <LifebuoyIcon className="h-5 w-5" variant="bounce" />, label: VIEWS.RESCUE },
    { icon: <AlertIcon className="h-5 w-5" variant="pulse" />, label: VIEWS.ALERTS },
    { icon: <ReportIcon className="h-5 w-5" variant="scale" />, label: VIEWS.REPORTS },
    { icon: <ClockIcon className="h-5 w-5" variant="rotate" />, label: VIEWS.ROUTE_HISTORY },
    { icon: <CurrencyDollarIcon className="h-5 w-5" variant="glow" />, label: VIEWS.COST_CONTROL },
  ]

  return (
    <aside className="h-full w-72 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(8,9,18,0.65)] backdrop-blur-2xl">
      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
        <Image src="/golffox-logo.svg" alt="Golffox Logo" width={40} height={40} className="h-10 w-10" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-golffox-muted">Golffox</p>
          <p className="text-sm font-semibold text-white">Experience OS</p>
        </div>
      </div>
      <nav className="mt-8 flex-1 space-y-1">
        {items.map((item) => {
          const active = currentView === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setCurrentView(item.label)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active ? 'bg-white/12 text-white shadow-[0_18px_40px_rgba(108,99,255,0.25)]' : 'text-golffox-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-white/10">
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="mt-6 rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-sky-500/50 p-5 text-white shadow-[0_25px_60px_rgba(88,80,255,0.32)]">
        <p className="text-sm font-semibold">Experiência concierge</p>
        <p className="mt-2 text-xs text-white/80">Ative a suíte Golffox Signature com branding completo e suporte 24/7.</p>
      </div>
      <div className="mt-8 text-center text-xs text-golffox-muted">
        © {new Date().getFullYear()} Golffox
        <br />
        Painel Experience v2.0
      </div>
    </aside>
  )
}

export default Sidebar

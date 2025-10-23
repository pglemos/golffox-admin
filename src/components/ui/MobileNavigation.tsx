import React, { useState } from 'react'
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
} from '../../../components/icons/Icons'

interface MobileNavigationProps {
  currentView: View
  setCurrentView: (view: View) => void
}

const menuItems: { icon: React.ReactNode; view: View }[] = [
  { icon: <DashboardIcon className="h-5 w-5" variant="premium" />, view: VIEWS.DASHBOARD },
  { icon: <MapIcon className="h-5 w-5" variant="float" />, view: VIEWS.MAP },
  { icon: <RouteIcon className="h-5 w-5" variant="hover" />, view: VIEWS.ROUTES },
  { icon: <TruckIcon className="h-5 w-5" variant="scale" />, view: VIEWS.VEHICLES },
  { icon: <UserCircleIcon className="h-5 w-5" variant="hover" />, view: VIEWS.DRIVERS },
  { icon: <BuildingOfficeIcon className="h-5 w-5" variant="scale" />, view: VIEWS.COMPANIES },
  { icon: <AdjustmentsHorizontalIcon className="h-5 w-5" variant="rotate" />, view: VIEWS.PERMISSIONS },
  { icon: <LifebuoyIcon className="h-5 w-5" variant="bounce" />, view: VIEWS.RESCUE },
  { icon: <AlertIcon className="h-5 w-5" variant="pulse" />, view: VIEWS.ALERTS },
  { icon: <ReportIcon className="h-5 w-5" variant="scale" />, view: VIEWS.REPORTS },
]

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSelect = (view: View) => {
    setCurrentView(view)
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="lg:hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(8,9,18,0.55)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Image src="/golffox-logo.svg" alt="Golffox Logo" width={32} height={32} className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.35em] text-golffox-muted">Golffox</span>
              <span className="text-sm font-semibold text-white">Experience OS</span>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-2xl border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Alternar menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur">
          <div className="ml-auto flex h-full w-80 flex-col gap-6 border-l border-white/10 bg-[#06070d]/95 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/golffox-logo.svg" alt="Golffox Logo" width={36} height={36} className="h-9 w-9" />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-golffox-muted">Golffox</p>
                  <p className="text-sm font-semibold text-white">Experience OS</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Fechar menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map(({ icon, view }) => {
                const active = currentView === view
                return (
                  <button
                    key={view}
                    onClick={() => handleSelect(view)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active ? 'bg-white/12 text-white shadow-[0_18px_40px_rgba(108,99,255,0.25)]' : 'text-golffox-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-white/10">
                      {icon}
                    </span>
                    {view}
                  </button>
                )
              })}
            </nav>
            <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-golffox-muted">
              <p className="font-semibold text-white">Golffox concierge</p>
              <p className="mt-2">Suporte 24/7 e integração completa com os times de operação.</p>
            </div>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#070812]/95 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 px-2 py-3">
          {[VIEWS.DASHBOARD, VIEWS.MAP, VIEWS.ROUTES, VIEWS.VEHICLES, VIEWS.ALERTS].map((view, index) => {
            const active = currentView === view
            const icon = menuItems[index]?.icon
            return (
              <button
                key={view}
                onClick={() => handleSelect(view)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.7rem] font-medium transition ${
                  active ? 'bg-white/12 text-white shadow-[0_12px_30px_rgba(108,99,255,0.25)]' : 'text-golffox-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-white/10">
                  {icon}
                </span>
                {view}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default MobileNavigation

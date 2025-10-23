import React from 'react'
import Image from 'next/image'

// Tipos temporários
type AppView = string

// Mock data temporário
const APP_VIEWS = { MANAGEMENT: 'management' }

interface AppSelectorProps {
  currentView: AppView
  setCurrentView: (view: AppView) => void
}

const AppSelector: React.FC<AppSelectorProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="relative w-full overflow-hidden rounded-b-[2.5rem] border-b border-white/10 bg-white/5 px-4 py-6 shadow-[0_30px_80px_rgba(8,9,18,0.65)] backdrop-blur-xl sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.45),_transparent_60%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,212,255,0.35),_transparent_60%)] opacity-70" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="golffox-glass flex items-center gap-3 rounded-2xl px-4 py-3">
            <Image src="/golffox-logo.svg" alt="Golffox Logo" width={36} height={36} className="h-9 w-9" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-golffox-muted">Golffox Experience</p>
              <p className="text-lg font-semibold text-white">Painel unificado</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:flex">
            Inspired by Apple • Nike • Tesla • Nubank • Santander
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/80">
            Plataforma management
          </div>
          <button
            onClick={() => setCurrentView(APP_VIEWS.MANAGEMENT)}
            className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
              currentView === APP_VIEWS.MANAGEMENT
                ? 'bg-white/5 text-[#050508] shadow-[0_20px_60px_rgba(255,255,255,0.28)]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span className="relative z-10">Experience OS</span>
            <span className="relative z-10 text-[0.6rem] tracking-[0.4em]">Live</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppSelector

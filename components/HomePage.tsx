import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const cards = [
  {
    href: '/golffox',
    title: 'Painel Golffox',
    subtitle: 'Suite administrativa imersiva',
  },
  {
    href: '/transportadora',
    title: 'Transportadora premium',
    subtitle: 'Gestão enterprise e integrações bancárias',
  },
  {
    href: '/operador',
    title: 'Mission control',
    subtitle: 'Orquestração tática em tempo real',
  },
]

const HomePage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-golffox-base px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-25%] h-[40vh] bg-[radial-gradient(circle,_rgba(108,99,255,0.3),_transparent_70%)] blur-3xl" />
        <div className="absolute left-[-15%] top-[30%] h-[35vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(0,212,255,0.24),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-25%] right-[-15%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(255,71,87,0.28),_transparent_72%)] blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
        <div className="text-center">
          <Image src="/assets/golffox-logo.svg" alt="Golffox Logo" className="mx-auto mb-6 h-20 w-20" width={80} height={80} priority />
          <p className="golffox-tag mx-auto">Experience Platform</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Escolha onde começar sua jornada Golffox</h1>
          <p className="mt-3 max-w-2xl text-sm text-golffox-muted sm:text-base">
            Interfaces e fluxos inspirados em Apple, Tesla, Nubank, Santander e Nike para elevar a mobilidade executiva ao nível das marcas icônicas.
          </p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_60px_rgba(8,9,18,0.55)] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
            >
              <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute -right-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(108,99,255,0.35),_transparent_60%)] blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                  <p className="mt-2 text-sm text-golffox-muted">{card.subtitle}</p>
                </div>
                <span className="inline-flex w-max items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition group-hover:gap-3">
                  Entrar <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage

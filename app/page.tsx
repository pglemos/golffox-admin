import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, Sparkle, ShieldCheck, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Golffox — Mobilidade icônica para operações premium',
  description:
    'Experiência de gestão de transporte executivo inspirada nas maiores marcas do mundo. Inteligência, luxo e performance no mesmo ecossistema.',
}

const metrics = [
  { label: 'Satisfação executiva', value: '98%', detail: 'CSAT médio em operações globais' },
  { label: 'SLA cumprido', value: '99,4%', detail: 'Tempo de resposta sub 3 minutos' },
  { label: 'Frotas conectadas', value: '180+', detail: 'Empresas enterprise e bancos digitais' },
]

const experiences = [
  {
    title: 'Design signature',
    description:
      'Tipografia elegante, microinterações sutis e superfícies translúcidas criam uma atmosfera premium inspirada em Apple e Tesla.',
    icon: Sparkle,
  },
  {
    title: 'Confiança financeira',
    description:
      'Fluxos de auditoria, trilhas de aprovação e aderência bancária seguindo padrões Nubank e Santander.',
    icon: ShieldCheck,
  },
  {
    title: 'Performance esportiva',
    description:
      'Dashboards reativos, projeções preditivas e operação com velocidade Nike para sua equipe.',
    icon: Zap,
  },
]

const journeys = [
  {
    title: 'Boardroom overview',
    description: 'Insights cross-frota com KPIs e storytelling visual para C-levels.',
    href: '/administrador',
  },
  {
    title: 'Mission control',
    description: 'Orquestração tática de rotas e motoristas em tempo real.',
    href: '/operador',
  },
  {
    title: 'Signature ride',
    description: 'Aplicativo do passageiro com linguagem concierge e rastreio premium.',
    href: '/passageiro',
  },
  {
    title: 'Driver studio',
    description: 'Área do motorista com turnos inteligentes e feedback contínuo.',
    href: '/motorista',
  },
]

export default function Home() {
  return (
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-20 px-6 pb-24 pt-32 sm:px-10 lg:pt-36">
      <section className="relative flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="absolute -left-8 top-4 hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(108,99,255,0.32),_transparent_70%)] blur-3xl lg:block" />
        <div className="absolute -right-6 top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(0,212,255,0.28),_transparent_68%)] blur-3xl" />

        <div className="relative flex flex-1 flex-col gap-8">
          <span className="golffox-tag w-fit">Mobilidade executiva reimaginada</span>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            A experiência Golffox coloca sua operação no mesmo patamar das marcas mais admiradas do planeta.
          </h1>
          <p className="max-w-xl text-lg text-golffox-muted">
            Um ecossistema digital com design inspirado em Apple e Tesla, performance guiada pela energia da Nike e confiança
            regulatória que espelha Nubank e Santander. Tudo calibrado para passageiros, motoristas e times estratégicos.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/golffox"
              className="group inline-flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#050508] shadow-[0_20px_50px_rgba(255,255,255,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Explorar plataforma
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/transportadora"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:border-white hover:bg-white/10"
            >
              Ver suites corporativas
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="golffox-glass p-6">
                <p className="text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-golffox-muted">{metric.label}</p>
                <p className="mt-3 text-sm text-golffox-muted">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 justify-center lg:justify-end">
          <div className="golffox-glass-strong relative w-full max-w-md overflow-hidden p-8">
            <div className="absolute -right-32 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,71,87,0.35),_transparent_65%)] blur-3xl" />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-golffox-muted">Signature HUD</p>
                <span className="golffox-pill text-xs text-white/80">Live Ops</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">Motoristas sincronizados, clientes encantados.</h2>
              <p className="text-sm text-golffox-muted">
                Experiência panorâmica com telemetria, agenda inteligente e KPIs acionáveis. O painel se adapta ao contexto do usuário e
                mantém a essência Golffox em todas as interações.
              </p>
              <div className="golffox-grid sm:grid-cols-2">
                {experiences.map((exp) => (
                  <div key={exp.title} className="rounded-2xl bg-white/5 p-4">
                    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                      <exp.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-semibold text-white">{exp.title}</h3>
                    <p className="mt-2 text-sm text-golffox-muted">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="golffox-glass-strong relative overflow-hidden px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_65%)]" />
        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            <span className="golffox-tag mx-auto">Ecossistema integrado</span>
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
              Uma suíte Golffox para cada protagonista da mobilidade corporativa
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-golffox-muted">
              Painéis, apps e hubs desenhados com consistência visual e experiências dedicadas. Cada jornada foi prototipada ao lado de times de inovação e marcas premium.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {journeys.map((journey) => (
              <Link
                key={journey.title}
                href={journey.href}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -left-14 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(108,99,255,0.35),_transparent_60%)] blur-2xl" />
                </div>
                <div className="relative flex h-full flex-col gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{journey.title}</h3>
                    <p className="mt-3 text-sm text-golffox-muted">{journey.description}</p>
                  </div>
                  <span className="inline-flex w-max items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 transition group-hover:gap-3">
                    Acessar experiência <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/5 px-10 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_70%)]" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="golffox-tag">Future ready</span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Do onboarding ao faturamento, o Golffox entrega um serviço com cara de flagship store.
          </h2>
          <p className="text-lg text-golffox-muted">
            Configurações sem atrito, integrações abertas e camadas de segurança nível enterprise, com supervisão ativa de IA para garantir excelência contínua.
          </p>
          <Link
            href="/admin"
            className="group inline-flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#050508] shadow-[0_20px_50px_rgba(255,255,255,0.18)] transition-transform hover:-translate-y-0.5"
          >
            Abrir demo imersiva
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="mt-auto pb-8 text-center text-sm text-golffox-muted">
        © {new Date().getFullYear()} Golffox Experience Platform. Todos os direitos reservados.
      </footer>
    </main>
  )
}

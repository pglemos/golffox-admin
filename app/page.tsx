import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GolfFox - Sistema de Gerenciamento de Transporte Executivo',
  description:
    'Plataforma para gerenciamento de transporte executivo com rastreamento em tempo real e experiência premium.',
};

const stats = [
  { label: 'Taxa média de satisfação', value: '98%' },
  { label: 'Solicitações atendidas/mês', value: '12k+' },
  { label: 'Veículos monitorados', value: '3.5k+' },
];

const features = [
  {
    title: 'Design centrado no passageiro',
    description:
      'Experiências fluidas e responsivas com foco na jornada do passageiro corporativo, do pedido ao desembarque.',
  },
  {
    title: 'Inteligência operacional',
    description:
      'Painéis avançados com KPIs em tempo real, previsões de demanda e alertas proativos para equipes táticas.',
  },
  {
    title: 'Segurança de nível enterprise',
    description:
      'Arquitetura preparada para auditoria, criptografia ponta a ponta e conformidade com padrões internacionais.',
  },
];

const panels = [
  {
    title: 'Painel do Motorista',
    description: 'Controle de viagens, rotas inteligentes e disponibilidade dinâmica.',
    href: '/motorista',
  },
  {
    title: 'Painel do Passageiro',
    description: 'Solicitação expressa, acompanhamento em tempo real e histórico completo.',
    href: '/passageiro',
  },
  {
    title: 'Painel Administrativo',
    description: 'Gestão de frotas, contratos, equipes e performance em um só lugar.',
    href: '/administrador',
  },
  {
    title: 'Painel do Operador',
    description: 'Orquestração de rotas, motoristas e veículos com precisão cirúrgica.',
    href: '/operador',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,46,255,0.35),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,224,255,0.25),_transparent_60%)] blur-3xl lg:block" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-32 sm:px-8 lg:px-12">
        <header className="flex flex-col items-center text-center">
          <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
            Mobilidade executiva de próxima geração
          </span>
          <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            GolfFox eleva sua operação ao padrão das marcas mais admiradas do mundo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl">
            Inspirado pela sofisticação da Apple, a performance da Tesla e a energia da Nike, o GolfFox combina tecnologia, luxo e
            eficiência para entregar experiências memoráveis em cada trajeto.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/golffox"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#05050a] shadow-[0_15px_45px_rgba(255,255,255,0.15)] transition hover:translate-y-0.5 hover:bg-slate-100"
            >
              Conheça a plataforma
            </Link>
            <Link
              href="/transportadora"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white/80 transition hover:border-white hover:text-white"
            >
              Ver planos empresariais
            </Link>
          </div>
          <div className="mt-16 grid w-full gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur"
              >
                <span className="text-3xl font-semibold text-white sm:text-4xl">{stat.value}</span>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
              Estratégia, dados e design integrados em um ecossistema único.
            </h2>
            <p className="text-lg text-white/70">
              Cada ponto de contato foi desenhado para refletir a excelência das empresas que inspiram o GolfFox. Uma linguagem visual
              sofisticada, microinterações precisas e fluxos intuitivos aumentam a confiança de passageiros, motoristas e gestores.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-lg">
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 text-left backdrop-blur-xl">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(91,46,255,0.35),_transparent_65%)] blur-3xl" />
            <div className="relative flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">Marca</span>
              <h3 className="text-2xl font-semibold text-white">
                O design conversa com o futuro.
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Tipografia limpa, módulos adaptáveis e uma paleta premium criam presença digital marcante. Sua operação transmite o
                mesmo nível de confiança de empresas icônicas como Apple, Nike, Tesla e beyond.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-white/50 sm:grid-cols-2">
                <span className="rounded-full border border-white/10 px-4 py-2 text-center">Apple-inspired minimalism</span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-center">Tesla-level intelligence</span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-center">Nike-grade performance</span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-center">GolfFox signature DNA</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">Painéis pensados para cada protagonista</h2>
            <p className="mx-auto max-w-2xl text-lg text-white/70">
              Interfaces desenhadas com precisão milimétrica para cada perfil, conectadas por um núcleo inteligente que simplifica a
              tomada de decisão e potencializa a operação.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {panels.map((panel) => (
              <div
                key={panel.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition duration-300 hover:border-white/30 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(91,46,255,0.4),_transparent_60%)] blur-2xl" />
                </div>
                <div className="relative flex h-full flex-col gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{panel.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{panel.description}</p>
                  </div>
                  <Link
                    href={panel.href}
                    className="inline-flex w-max items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition group-hover:border-white group-hover:text-white"
                  >
                    Acessar painel
                    <span aria-hidden className="text-lg transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-white/10 via-transparent to-white/5 px-10 py-16 text-center backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] opacity-80" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
              Uma experiência premium em cada etapa do transporte executivo.
            </h2>
            <p className="text-lg text-white/70">
              Do onboarding ao faturamento, o GolfFox entrega fluidez, confiabilidade e uma sensação de marca inconfundível.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#05050a] shadow-[0_15px_45px_rgba(255,255,255,0.18)] transition hover:translate-y-0.5 hover:bg-slate-100"
            >
              Iniciar demonstração
            </Link>
          </div>
        </section>

        <footer className="mt-auto pb-8 text-center text-sm text-white/50">
          © {new Date().getFullYear()} GolfFox Management System. Todos os direitos reservados.
        </footer>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { ArrowRight, BarChart3, MapPin, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

const features = [
  {
    title: 'Telemetria em tempo real',
    description: 'Acompanhe veículos, rotas e status operacionais em um painel de performance elevado.',
    icon: MapPin,
  },
  {
    title: 'Alertas inteligentes',
    description: 'Sistema proativo que notifica desvios, atrasos e manutenções preventivas.',
    icon: ShieldCheck,
  },
  {
    title: 'Análises avançadas',
    description: 'Indicadores financeiros, produtividade e satisfação em dashboards personalizáveis.',
    icon: BarChart3,
  },
];

export default function MarketingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link className="flex items-center gap-3" href="/">
            <Image alt="Golffox" height={32} src="/logo.svg" width={120} />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link className="transition hover:text-slate-900" href="#solucao">
              Solução
            </Link>
            <Link className="transition hover:text-slate-900" href="#indicadores">
              Indicadores
            </Link>
            <Link className="transition hover:text-slate-900" href="#seguranca">
              Segurança
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-in">
                Acessar plataforma
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-24 text-center">
          <span className="rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Nova versão 2025
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Gestão inteligente de transporte executivo com confiabilidade SaaS
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Controle toda a operação Golffox — motoristas, passageiros, rotas e indicadores financeiros — em uma plataforma
            totalmente integrada ao Supabase e pronta para escala corporativa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/sign-in">
                Iniciar agora
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#indicadores">Ver painel de indicadores</Link>
            </Button>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-white/80" id="solucao">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
            {features.map(feature => (
              <Card className="h-full" key={feature.title}>
                <CardHeader className="flex items-start gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <feature.icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-slate-500">
                  Disponível para equipes administrativas, operadores, motoristas e passageiros com regras de permissão
                  independentes.
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24" id="indicadores">
          <div className="grid gap-8 md:grid-cols-[1.4fr,1fr]">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle>Performance operacional em tempo real</CardTitle>
                <CardDescription>
                  Dashboards com SLA de corridas, nível de serviço por cliente e produtividade dos motoristas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    { label: 'SLAs cumpridos', value: '97%', trend: '+3,2% vs. último mês' },
                    { label: 'Frota ativa', value: '128 veículos', trend: '+12 novos contratos' },
                    { label: 'Satisfação do passageiro', value: '4,8/5', trend: 'NPS atualizado automaticamente' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                      <p className="text-xs text-brand-600">{item.trend}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Integração segura</CardTitle>
                <CardDescription>
                  Infraestrutura com autenticação Supabase, validação de ambiente com Zod e monitoramento de erros estruturado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-slate-500">
                <p>• Conformidade LGPD com controle de acesso por perfil e logs auditáveis.</p>
                <p>• API Routes protegidas com validação e rate limit por tenant.</p>
                <p>• Observabilidade com logs estruturados e métricas prontos para APM.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/80 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Golffox. Todos os direitos reservados.
      </footer>
    </div>
  );
}

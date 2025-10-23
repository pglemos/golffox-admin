'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth, UserProfile, UserRole } from '../hooks/useAuth';
import { ShieldCheck, Users, SteeringWheel, Building2, Workflow } from 'lucide-react';

const roleRedirectMap: Record<UserRole, string> = {
  admin: '/admin',
  operator: '/operador',
  driver: '/motorista',
  passenger: '/passageiro',
  carrier: '/transportadora',
};

const roleHighlights = [
  {
    label: 'Administrativo',
    description: 'Painel completo com indicadores, gestão de operações e governança.',
    icon: ShieldCheck,
  },
  {
    label: 'Operador',
    description: 'Orquestração de rotas, frotas e equipes em tempo real.',
    icon: Workflow,
  },
  {
    label: 'Motorista',
    description: 'Agenda inteligente, checklist digital e suporte instantâneo.',
    icon: SteeringWheel,
  },
  {
    label: 'Passageiro',
    description: 'Experiência premium com reservas rápidas e acompanhamento ao vivo.',
    icon: Users,
  },
  {
    label: 'Transportadora',
    description: 'Portal dedicado para empresas com visão financeira e contratos.',
    icon: Building2,
  },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const redirectByRole = useCallback(
    (profile: UserProfile) => {
      const destination = roleRedirectMap[profile.role] ?? '/';
      router.replace(destination);
    },
    [router]
  );

  useEffect(() => {
    if (!isLoading && user) {
      redirectByRole(user);
    }
  }, [user, isLoading, redirectByRole]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010B1F] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,_rgba(0,88,255,0.28)_0%,_rgba(1,11,31,0)_60%)]" />
        <div className="absolute -right-40 bottom-[-8rem] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,_rgba(255,95,0,0.25)_0%,_rgba(1,11,31,0)_60%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#031431] via-[#010B1F]/40 to-transparent" />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, rgba(255,255,255,0) 45%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0, rgba(255,255,255,0) 40%)',
        }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 lg:flex-row lg:items-center lg:gap-16">
        <header className="flex flex-col gap-6 lg:max-w-xl">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image src="/golffox-logo.svg" alt="Logo GolfFox" width={48} height={48} className="h-10 w-10" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-[0.4em] text-white/60">GolfFox Plataforma</span>
              <span className="text-lg font-semibold text-white/90">Gestão inteligente de mobilidade premium</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
              Acesso exclusivo
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Entre com seu email corporativo e continue sua jornada com a GolfFox.
            </h1>
            <p className="max-w-xl text-base text-white/70">
              Nosso login integra Supabase e as políticas avançadas de permissão para entregar a experiência certa para administradores, operadores, motoristas, passageiros e transportadoras.
            </p>
          </div>

          <div className="relative mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="absolute -top-3 left-6 flex items-center gap-2 rounded-full bg-[#FF5F00] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg">
              Papéis GolfFox
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {roleHighlights.map((item) => (
                <li
                  key={item.label}
                  className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition hover:border-white/30 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E3A70] via-[#0B2C53] to-[#031431] text-white shadow-lg shadow-[#0b1f35]/40">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                    <p className="mt-1 text-xs text-white/60 sm:text-sm">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-white/50">
              Em caso de dúvidas, contate o administrador da sua empresa ou nosso time de atendimento GolfFox.
            </p>
          </div>
        </header>

        <section className="relative flex w-full max-w-md flex-1 justify-center">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#0B2C53] via-[#041126] to-transparent opacity-80 blur-3xl" />
          <LoginForm className="w-full" onSuccess={redirectByRole} />
        </section>
      </div>
    </div>
  );
}

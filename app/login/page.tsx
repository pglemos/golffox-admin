'use client';

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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-24 right-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-900 via-slate-950 to-transparent" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <section className="flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              Acesso unificado GolfFox
            </span>
            <h1 className="mt-8 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Faça login com seu email corporativo para entrar no painel certo para o seu papel.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/70 sm:text-base">
              A autenticação é realizada via Supabase com políticas de acesso dedicadas para cada perfil. Use suas credenciais de produção para continuar.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {roleHighlights.map((item) => (
              <li
                key={item.label}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/30 hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-xs text-white/60 sm:text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs text-white/50">
            Está com dúvidas sobre seu acesso? Procure o administrador da sua empresa ou abra um chamado com o time GolfFox.
          </p>
        </section>

        <section className="flex items-center justify-center p-2 sm:p-6">
          <LoginForm className="w-full" onSuccess={redirectByRole} />
        </section>
      </div>
    </div>
  );
}

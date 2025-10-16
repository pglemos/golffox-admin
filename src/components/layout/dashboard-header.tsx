'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useAuth } from '@features/auth/hooks/use-auth';

export function DashboardHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
      <Link className="flex items-center gap-2" href="/">
        <Image alt="Golffox" height={28} src="/logo.svg" width={110} />
      </Link>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span className="hidden md:inline-flex">
          {user ? (
            <>
              <strong className="mr-1 text-slate-900">{user.name ?? user.email}</strong>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">{user.role}</span>
            </>
          ) : (
            'Carregando usuário...'
          )}
        </span>
        <Button onClick={signOut} size="sm" variant="ghost">
          Sair
        </Button>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { SignInForm } from '@features/auth/components/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

export const metadata = {
  title: 'Entrar na plataforma — Golffox',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 text-slate-50 shadow-2xl backdrop-blur-lg">
        <CardHeader className="items-center gap-2 text-center">
          <Image alt="Golffox" className="mb-4" height={36} src="/logo.svg" width={140} />
          <CardTitle>Bem-vindo de volta</CardTitle>
          <CardDescription className="text-slate-400">
            Faça login para acessar o painel administrativo e acompanhar sua operação em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <p className="mt-6 text-center text-xs text-slate-400">
            Precisa de acesso? Entre em contato com o time Golffox em
            <Link className="ml-1 underline decoration-dashed" href="mailto:suporte@golffox.com">
              suporte@golffox.com
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

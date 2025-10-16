'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { cn } from '@utils/cn';
import { useAuth } from '../hooks/use-auth';

const signInSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({ className }: { className?: string }) {
  const { signIn, status, error } = useAuth();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async values => {
    setSubmissionError(null);
    const validation = signInSchema.safeParse(values);

    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        const field = issue.path[0];
        if (field === 'email' || field === 'password') {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    const result = await signIn(validation.data);

    if (!result.success) {
      setSubmissionError(result.message ?? 'Não foi possível entrar. Verifique suas credenciais.');
      return;
    }

    router.replace('/dashboard');
    router.refresh();
  });

  const isLoading = status === 'loading';

  return (
    <form className={cn('grid gap-6', className)} onSubmit={onSubmit} noValidate>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
          E-mail
        </label>
        <Input
          autoComplete="email"
          id="email"
          placeholder="exemplo@golffox.com"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">
          Senha
        </label>
        <Input autoComplete="current-password" id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {(submissionError || error) && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{submissionError ?? error}</span>
        </div>
      )}

      <Button className="w-full" disabled={isLoading} size="lg" type="submit">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Entrando...
          </span>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}

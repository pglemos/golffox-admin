'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth, UserProfile } from '../../app/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: (user: UserProfile) => void;
  onForgotPassword?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, onForgotPassword, className = '' }: LoginFormProps) {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erro quando usuário começa a digitar
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;

    // Validação básica
    if (!formData.email.trim()) {
      setError('Usuário ou Email é obrigatório');
      return;
    }

    if (!formData.password.trim()) {
      setError('Senha é obrigatória');
      return;
    }

    // Remove validação de formato de email para permitir usuário "admin"
    // if (!formData.email.includes('@')) {
    //   setError('Email inválido');
    //   return;
    // }

    setIsSubmitting(true);
    setError(null);

    try {
      const { user, error: signInError } = await signIn(formData.email, formData.password);

      if (signInError) {
        setError(signInError);
        return;
      }

      if (user) {
        console.log('Login realizado com sucesso:', user.email);
        onSuccess?.(user);
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={clsx('relative mx-auto w-full max-w-md', className)}>
      <div className="absolute -inset-0.5 rounded-[30px] bg-gradient-to-br from-[#0F4C92] via-[#0B2C53] to-[#FF5F00] opacity-70 blur-lg" aria-hidden />
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#031431]/90 p-10 text-white shadow-xl backdrop-blur-2xl">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Header */}
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
            <LogIn className="h-7 w-7 text-[#FF5F00]" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Bem-vindo ao GolfFox</h2>
          <p className="text-sm text-white/70">
            Acesse com suas credenciais corporativas para continuar.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <AlertCircle className="h-5 w-5 text-red-300" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80">
              Usuário ou Email
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Mail className="h-5 w-5 text-white/40 transition-colors group-focus-within:text-white" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-3 text-sm text-white outline-none transition focus:border-[#FF5F00]/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#FF5F00]/60 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="admin ou seu@email.com"
                disabled={isSubmitting || loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/80">
              Senha
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Lock className="h-5 w-5 text-white/40 transition-colors group-focus-within:text-white" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-12 text-sm text-white outline-none transition focus:border-[#FF5F00]/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#FF5F00]/60 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Sua senha"
                disabled={isSubmitting || loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-white/50 transition hover:text-white"
                disabled={isSubmitting || loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          {onForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-[#7FB2FF] transition hover:text-white"
                disabled={isSubmitting || loading}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#FF5F00] via-[#FF6F1A] to-[#FF8B40] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#FF5F00]/30 transition hover:shadow-xl hover:shadow-[#FF5F00]/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5F00] focus:ring-offset-[#031431] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting || loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-center text-xs text-white/50">
          Sistema de Gestão de Transporte Premium GolfFox
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
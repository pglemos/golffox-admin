'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@lib/supabase/browser-client';
import { logger } from '@lib/logging/logger';
import type { UserRole } from '@lib/supabase/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  companyId: string | null;
  avatarUrl: string | null;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface SignInInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  status: AuthStatus;
  error: string | null;
  signIn: (payload: SignInInput) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchUserProfile(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) {
    return null;
  }

  const supabase = getSupabaseBrowserClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, company_id, avatar_url')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      logger.warn('Falha ao carregar perfil detalhado do usuário, utilizando metadados básicos.', { error });

      return {
        id: session.user.id,
        email: session.user.email ?? '',
        name: (session.user.user_metadata as { name?: string })?.name ?? null,
        role: ((session.user.user_metadata as { role?: UserRole })?.role ?? 'passenger') as UserRole,
        companyId: null,
        avatarUrl: (session.user.user_metadata as { avatar_url?: string })?.avatar_url ?? null,
      };
    }

    if (!data) {
      return {
        id: session.user.id,
        email: session.user.email ?? '',
        name: (session.user.user_metadata as { name?: string })?.name ?? null,
        role: ((session.user.user_metadata as { role?: UserRole })?.role ?? 'passenger') as UserRole,
        companyId: null,
        avatarUrl: (session.user.user_metadata as { avatar_url?: string })?.avatar_url ?? null,
      };
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      companyId: data.company_id,
      avatarUrl: data.avatar_url,
    };
  } catch (error) {
    logger.error('Erro inesperado ao montar perfil do usuário', { error });
    return {
      id: session.user.id,
      email: session.user.email ?? '',
      name: (session.user.user_metadata as { name?: string })?.name ?? null,
      role: ((session.user.user_metadata as { role?: UserRole })?.role ?? 'passenger') as UserRole,
      companyId: null,
      avatarUrl: (session.user.user_metadata as { avatar_url?: string })?.avatar_url ?? null,
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const syncSession = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    setStatus('loading');

    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      logger.error('Falha ao recuperar sessão atual', { error: sessionError });
      setSession(null);
      setUser(null);
      setStatus('unauthenticated');
      setError('Não foi possível validar a sessão atual. Faça login novamente.');
      return;
    }

    setSession(data.session);

    if (!data.session) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    const profile = await fetchUserProfile(data.session);
    setUser(profile);
    setStatus(profile ? 'authenticated' : 'unauthenticated');
    setError(null);
  }, []);

  useEffect(() => {
    syncSession();

    const supabase = getSupabaseBrowserClient();
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setStatus('loading');
        const profile = await fetchUserProfile(nextSession);
        setUser(profile);
        setStatus(profile ? 'authenticated' : 'unauthenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [syncSession]);

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    const supabase = getSupabaseBrowserClient();

    try {
      setStatus('loading');
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        logger.warn('Tentativa de login falhou', { error: signInError });
        setStatus('unauthenticated');
        setError(signInError.message ?? 'Credenciais inválidas.');
        return { success: false, message: signInError.message };
      }

      setSession(data.session ?? null);

      const profile = await fetchUserProfile(data.session ?? null);
      setUser(profile);
      setStatus(profile ? 'authenticated' : 'unauthenticated');

      return { success: true };
    } catch (caught) {
      logger.error('Erro inesperado ao executar login', { error: caught });
      setStatus('unauthenticated');
      setError('Ocorreu um erro inesperado ao fazer login. Tente novamente.');
      return { success: false, message: 'Erro inesperado ao autenticar.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      status,
      error,
      signIn,
      signOut,
      refresh: syncSession,
    }),
    [error, session, signIn, signOut, status, syncSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }

  return context;
}

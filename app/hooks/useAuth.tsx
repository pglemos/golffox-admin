'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../services/supabase';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'driver' | 'passenger' | 'operator' | 'carrier';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  company_id?: string;
  role: UserRole;
  avatar_url?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // alias para compatibilidade com componentes existentes
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: UserProfile | null; error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: Extract<UserRole, 'driver' | 'passenger'>
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        company_id: data.company_id,
        avatar_url: data.avatar_url,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Development bypass: only enabled outside production
      if (process.env.NODE_ENV !== 'production' && email === 'admin' && password === 'admin') {
        const userProfile: UserProfile = {
          id: 'local-admin',
          email: 'admin@local',
          name: 'Administrador',
          role: 'admin',
          company_id: 'local',
        };
        setUser(userProfile);
        setError(null);
        setIsLoading(false);
        return { user: userProfile, error: null };
      }
      
      if (!email || !password) {
        const errorMsg = 'Email e senha são obrigatórios';
        setError(errorMsg);
        return { user: null, error: errorMsg };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const errorMsg = error.message || 'Falha na autenticação';
        setError(errorMsg);
        return { user: null, error: errorMsg };
      }
      
      // Se o login for bem-sucedido, carregar o perfil do usuário e retornar
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profile) {
          const userProfile = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            company_id: profile.company_id,
            avatar_url: profile.avatar_url,
          } as UserProfile;
          setUser(userProfile);
          setError(null);
          return { user: userProfile, error: null };
        }

        // Fallback: retornar informações básicas do usuário autenticado
        const basicUser: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: (data.user.user_metadata as any)?.name || '',
          role: ((data.user.user_metadata as any)?.role || 'passenger') as UserRole,
        };
        setUser(basicUser);
        setError(null);
        return { user: basicUser, error: null };
      }

      const errorMsg = 'Falha ao obter dados do usuário';
      setError(errorMsg);
      return { user: null, error: errorMsg };
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao fazer login';
      console.error(errorMsg, error);
      setError(errorMsg);
      return { user: null, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: Extract<UserRole, 'driver' | 'passenger'>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validação de campos
      if (!email || !password || !name) {
        const errorMsg = 'Todos os campos são obrigatórios';
        setError(errorMsg);
        return { error: errorMsg };
      }

      if (password.length < 6) {
        const errorMsg = 'A senha deve ter pelo menos 6 caracteres';
        setError(errorMsg);
        return { error: errorMsg };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        const errorMsg = error.message || 'Falha ao criar conta';
        setError(errorMsg);
        return { error: errorMsg };
      }

      if (!data.user) {
        const errorMsg = 'Falha ao criar conta de usuário';
        setError(errorMsg);
        return { error: errorMsg };
      }

      // Create user record
      const { error: userError } = await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        role,
      });

      if (userError) {
        const errorMsg = 'Erro ao criar perfil de usuário';
        console.error(errorMsg, userError);
        setError(errorMsg);
        return { error: errorMsg };
      }

      setError(null);
      return { error: null };
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao criar conta';
      console.error(errorMsg, error);
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const errorMsg = error.message || 'Falha ao fazer logout';
        console.error(errorMsg, error);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao fazer logout';
      console.error(errorMsg, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        loading: isLoading,
        error,
        signIn,
        signUp,
        signOut,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
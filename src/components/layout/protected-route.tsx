'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@features/auth/hooks/use-auth';
import type { UserRole } from '@lib/supabase/types';
import { Skeleton } from '@components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/sign-in' }: ProtectedRouteProps) {
  const { status, user, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, router]);

  if (status === 'loading') {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.replace(redirectTo);
    return null;
  }

  return <>{children}</>;
}

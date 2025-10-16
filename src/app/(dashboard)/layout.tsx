import type { ReactNode } from 'react';
import { ProtectedRoute } from '@components/layout/protected-route';
import { DashboardHeader } from '@components/layout/dashboard-header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <DashboardHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

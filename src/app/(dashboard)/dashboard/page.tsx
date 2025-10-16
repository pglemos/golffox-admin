import { Suspense } from 'react';
import { getDashboardOverview } from '@features/dashboard/api/get-overview';
import { getRecentActivity } from '@features/dashboard/api/get-recent-activity';
import { OverviewCards } from '@features/dashboard/components/overview-cards';
import { RecentActivity } from '@features/dashboard/components/recent-activity';
import { Skeleton } from '@components/ui/skeleton';

async function OverviewSection() {
  const data = await getDashboardOverview();
  return <OverviewCards data={data} />;
}

async function RecentActivitySection() {
  const items = await getRecentActivity();
  return <RecentActivity items={items} />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Visão geral</h1>
        <p className="text-sm text-slate-500">
          KPIs em tempo real da sua operação. Todos os dados são atualizados diretamente do Supabase.
        </p>
        <Suspense fallback={<Skeleton className="h-36 w-full" />}>
          {/* @ts-expect-error Async Server Component */}
          <OverviewSection />
        </Suspense>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          {/* @ts-expect-error Async Server Component */}
          <RecentActivitySection />
        </Suspense>
        <div className="flex h-full flex-col gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Próximas entregas</h2>
          <p>
            • Configuração de webhooks para alertas de manutenção.
            <br />• Importador em massa de passageiros via planilha.
            <br />• Dashboard de SLA por empresa contratante.
          </p>
          <p className="text-xs text-slate-400">
            Estas funcionalidades fazem parte do roadmap público da plataforma Golffox.
          </p>
        </div>
      </section>
    </div>
  );
}

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import type { DashboardRecentActivityItem } from '../types';

interface RecentActivityProps {
  items: DashboardRecentActivityItem[];
}

const statusMap: Record<DashboardRecentActivityItem['status'], { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  scheduled: { label: 'Agendada', variant: 'warning' },
  in_progress: { label: 'Em andamento', variant: 'default' },
  completed: { label: 'Concluída', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Últimas rotas monitoradas</CardTitle>
        <CardDescription>Resumo das viagens mais recentes com telemetria ativa.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.length === 0 && <p className="text-sm text-slate-500">Nenhuma rota registrada nas últimas horas.</p>}
        {items.map(item => {
          const status = statusMap[item.status];
          return (
            <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/70" key={item.id}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-slate-50">{item.route.name}</span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="text-slate-500">
                Motorista: {item.driver?.name ?? 'Não associado'} — Veículo: {item.vehicle?.model ?? 'Não informado'}
              </p>
              <p className="text-xs text-slate-400">
                Programada {formatDistanceToNow(new Date(item.scheduledAt), { locale: ptBR, addSuffix: true })}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

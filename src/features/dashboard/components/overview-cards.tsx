import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import type { DashboardOverview } from '../types';

interface OverviewCardsProps {
  data: DashboardOverview;
}

const cards: Array<{ key: keyof DashboardOverview; title: string; description: string }> = [
  { key: 'totalVehicles', title: 'Frota ativa', description: 'Veículos disponíveis para operação' },
  { key: 'totalDrivers', title: 'Motoristas homologados', description: 'Profissionais aptos e documentados' },
  { key: 'totalPassengers', title: 'Passageiros atendidos', description: 'Usuários com acesso ao app' },
  { key: 'activeRoutes', title: 'Rotas em andamento', description: 'Percursos com telemetria ativa' },
];

export function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <Card key={card.key}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{data[card.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

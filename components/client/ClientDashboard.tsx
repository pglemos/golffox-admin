import React from 'react';
import Image from 'next/image';
// import { MOCK_ROUTES } from '../../constants';
// import type { Route } from '../../types';
// import { RouteStatus } from '../../types';

type RouteStatusType = 'ontime' | 'delayed' | 'problem';

interface Route {
  id: number;
  name: string;
  driver: string;
  status: RouteStatusType;
  passengers: { onboard: number; total: number };
  punctuality: number;
}

const statusLabelMap: Record<RouteStatusType, string> = {
  ontime: 'No horário',
  delayed: 'Atraso',
  problem: 'Problema',
};

const MOCK_ROUTES: Route[] = [
  { id: 1, name: 'Rota Minerva - Manhã', driver: 'João Silva', status: 'ontime', passengers: { onboard: 18, total: 20 }, punctuality: 1 },
  { id: 2, name: 'Rota Minerva - Tarde', driver: 'Maria Oliveira', status: 'delayed', passengers: { onboard: 17, total: 20 }, punctuality: 6 },
  { id: 3, name: 'Rota Minerva - Noite', driver: 'Pedro Martins', status: 'problem', passengers: { onboard: 12, total: 20 }, punctuality: 12 },
];
import { UserGroupIcon, ChartBarIcon, ClockIcon } from '../icons/Icons';

const getStatusBadgeClass = (status: RouteStatusType) => {
  switch (status) {
    case 'ontime':
      return 'bg-golffox-blue-dark/80 text-white';
    case 'delayed':
      return 'bg-golffox-yellow/80 text-golffox-gray-dark';
    case 'problem':
      return 'bg-golffox-red/80 text-white';
    default:
      return 'bg-golffox-gray-medium/80 text-white';
  }
};


const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
  <div className="bg-golffox-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
        <div className="p-3 rounded-full bg-golffox-orange-primary/10 mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-md font-medium text-golffox-gray-medium">{title}</h3>
            <p className="text-2xl font-bold text-golffox-gray-dark">{value}</p>
        </div>
    </div>
  </div>
);


const ClientDashboard: React.FC = () => {
    // Simulating data for a specific client, e.g., "Minerva"
    const clientRoutes = MOCK_ROUTES.filter((route) => route.name.includes('Minerva'));
    const totalPassengers = clientRoutes.reduce((sum, route) => sum + route.passengers.onboard, 0);
    const averagePunctuality = clientRoutes.length > 0 ? clientRoutes.reduce((sum, route) => sum + route.punctuality, 0) / clientRoutes.length : 0;

    return (
        <div className="h-full w-full bg-golffox-gray-light/80 flex flex-col">
            <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b border-golffox-gray-light">
                <div className="flex items-center">
                    <Image src="/golffox-logo.svg" alt="Logotipo do cliente" className="h-10 mr-4" width={40} height={40} />
                    <h1 className="text-xl font-semibold">Bem-vindo(a), Cliente</h1>
                     <div>
                        <h1 className="text-2xl font-bold text-golffox-gray-dark">Portal do Operador</h1>
                        <p className="text-sm text-golffox-gray-medium">Contrato: Minerva Foods</p>
                    </div>
                </div>
                 <div className="flex items-center text-sm text-golffox-gray-medium">
                    <span className="mr-2">Tecnologia</span> 
                    {/* FIX: Use Base64 logo to prevent broken image icon. */}
                    <Image src="/golffox-logo.svg" alt="Logotipo da Golffox" className="h-6" width={24} height={24} />
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <InfoCard 
                        title="Colaboradores Transportados Hoje"
                        value={totalPassengers.toLocaleString('pt-BR')}
                        icon={<UserGroupIcon className="h-8 w-8 text-golffox-orange-primary" variant="float"/>}
                    />
                    <InfoCard 
                        title="Rotas Contratadas Ativas"
                        value={clientRoutes.length.toString()}
                        icon={<ChartBarIcon className="h-8 w-8 text-golffox-orange-primary" variant="scale"/>}
                    />
                    <InfoCard
                        title="Pontualidade Média"
                        value={clientRoutes.length > 0 ? `${averagePunctuality.toFixed(1)} min` : '--'}
                        icon={<ClockIcon className="h-8 w-8 text-golffox-orange-primary" variant="rotate"/>}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-golffox-gray-dark mb-4">Status das Rotas de Hoje</h2>
                    <div className="bg-golffox-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                        <thead className="bg-golffox-blue-dark text-white">
                            <tr>
                            <th className="py-3 px-6 text-left font-semibold">Rota</th>
                            <th className="py-3 px-6 text-left font-semibold">Motorista</th>
                            <th className="py-3 px-6 text-center font-semibold">Status</th>
                            <th className="py-3 px-6 text-center font-semibold">Passageiros</th>
                            <th className="py-3 px-6 text-center font-semibold">Pontualidade</th>
                            </tr>
                        </thead>
                        <tbody className="text-golffox-gray-medium">
                            {clientRoutes.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-6 px-6 text-center text-golffox-gray-medium">Nenhuma rota encontrada para o contrato selecionado.</td>
                              </tr>
                            ) : (
                            clientRoutes.map((route: Route, index: number) => (
                            <tr key={route.id} className={index % 2 === 0 ? 'bg-white' : 'bg-golffox-gray-light'}>
                                <td className="py-4 px-6 font-medium text-golffox-gray-dark">{route.name}</td>
                                <td className="py-4 px-6">{route.driver}</td>
                                <td className="py-4 px-6 text-center">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(route.status)}`}>
                                    {statusLabelMap[route.status]}
                                </span>
                                </td>
                                <td className="py-4 px-6 text-center">{`${route.passengers.onboard} / ${route.passengers.total}`}</td>
                                <td className={`py-4 px-6 text-center font-bold ${route.punctuality > 5 ? 'text-golffox-red' : route.punctuality > 0 ? 'text-golffox-yellow' : 'text-golffox-blue-light'}`}>
                                {route.punctuality === 0 ? 'Pontual' : `${route.punctuality > 0 ? '+' : ''}${route.punctuality} min`}
                                </td>
                            </tr>
                            )))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
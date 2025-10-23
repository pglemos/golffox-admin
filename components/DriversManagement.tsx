import React, { useState, useMemo } from 'react';
import Image from 'next/image';
// import { Driver, DriverPerformance } from '../types';

// Temporary type definitions
type Driver = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  photoUrl?: string;
  vehicleId?: string;
  assignedRoutes?: any[];
  performance?: DriverPerformance;
  cpf?: string;
  cnh?: string;
  cnhCategory?: string;
  cnhValidity?: string;
  hasEAR?: boolean;
  contractType?: string;
  linkedCompany?: string;
  credentialingDate?: string;
  lastToxicologicalExam?: string;
  transportCourseValidity?: string;
  availability?: string;
  lastUpdate?: string;
  rg?: string;
  birthDate?: string;
  address?: string;
  cep?: string;
};

type DriverPerformance = {
  id?: string;
  driverId?: string;
  driverName?: string;
  driverPhoto?: string;
  totalTrips?: number;
  completedTrips?: number;
  rating?: number;
  onTimePercentage?: number;
  totalDistance?: number;
  fuelEfficiency?: number;
  averageSpeed?: number;
  incidentCount?: number;
  customerRating?: number;
  punctualityScore?: number;
  overallScore?: number;
  totalSavings?: number;
  routesCompleted?: number;
  ranking?: number;
  monthlyPoints?: number;
  level?: string;
  fuelEfficiencyScore?: number;
  routeComplianceScore?: number;
  badges?: string[];
};

import { MOCK_DRIVERS } from '../constants';
import DriverRegistrationForm from './DriverRegistrationForm';
import { TruckIcon, ChartBarIcon, FlagCheckeredIcon, ClockIcon } from './icons/Icons';

const DriversManagement: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [activeTab, setActiveTab] = useState<'drivers' | 'ranking'>('drivers');

    // Mock data para performance dos motoristas
    const DRIVER_PERFORMANCE = useMemo<DriverPerformance[]>(() => [
        {
            id: 'dp1',
            driverId: 'd1',
            driverName: 'Carlos Silva',
            driverPhoto: 'https://picsum.photos/seed/carlos/100',
            punctualityScore: 95,
            fuelEfficiencyScore: 88,
            routeComplianceScore: 92,
            overallScore: 91.7,
            routesCompleted: 156,
            totalSavings: 2450.80,
            deviations: 3,
            ranking: 1,
            badges: ['Pontualidade Ouro', 'Economia de Combustível', 'Rota Perfeita'],
            level: 'Expert',
            monthlyPoints: 2750
        },
        {
            id: 'dp2',
            driverId: 'd2',
            driverName: 'Ana Santos',
            driverPhoto: 'https://picsum.photos/seed/ana/100',
            punctualityScore: 92,
            fuelEfficiencyScore: 94,
            routeComplianceScore: 89,
            overallScore: 91.7,
            routesCompleted: 142,
            totalSavings: 2890.45,
            deviations: 5,
            ranking: 2,
            badges: ['Economia Máxima', 'Pontualidade Prata', 'Condução Segura'],
            level: 'Expert',
            monthlyPoints: 2680
        },
        {
            id: 'dp3',
            driverId: 'd3',
            driverName: 'Roberto Lima',
            driverPhoto: 'https://picsum.photos/seed/roberto/100',
            punctualityScore: 87,
            fuelEfficiencyScore: 85,
            routeComplianceScore: 94,
            overallScore: 88.7,
            routesCompleted: 134,
            totalSavings: 1980.30,
            deviations: 2,
            ranking: 3,
            badges: ['Rota Perfeita', 'Pontualidade Bronze'],
            level: 'Avançado',
            monthlyPoints: 2420
        },
        {
            id: 'dp4',
            driverId: 'd4',
            driverName: 'Maria Oliveira',
            driverPhoto: 'https://picsum.photos/seed/maria/100',
            punctualityScore: 89,
            fuelEfficiencyScore: 82,
            routeComplianceScore: 91,
            overallScore: 87.3,
            routesCompleted: 128,
            totalSavings: 1750.60,
            deviations: 4,
            ranking: 4,
            badges: ['Pontualidade Prata', 'Condução Segura'],
            level: 'Avançado',
            monthlyPoints: 2180
        }
    ], []);

    const topDrivers = useMemo(() => {
        const sorted = [...DRIVER_PERFORMANCE].sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0));
        return sorted.slice(0, 3);
    }, [DRIVER_PERFORMANCE]);

    const handleViewCNH = (driver: Driver) => {
        setSelectedDriver(driver);
    };

    const handleAddDriver = () => {
        setEditingDriver(null);
        setShowRegistrationForm(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setShowRegistrationForm(true);
    };

    const handleSubmitDriver = (driverData: Partial<Driver>) => {
        if (editingDriver) {
            // Editar motorista existente
            setDrivers(prev => prev.map(driver => 
                driver.id === editingDriver.id 
                    ? { ...driver, ...driverData } as Driver
                    : driver
            ));
        } else {
            // Adicionar novo motorista
            const newDriver: Driver = {
                ...driverData,
                id: `d${Date.now()}`,
                photoUrl: 'https://picsum.photos/seed/new/100'
            } as Driver;
            setDrivers(prev => [...prev, newDriver]);
        }
        setShowRegistrationForm(false);
        setEditingDriver(null);
    };

    const handleCancelRegistration = () => {
        setShowRegistrationForm(false);
        setEditingDriver(null);
    };

    const handleDeleteDriver = (driverId: string) => {
        if (confirm('Tem certeza que deseja excluir este motorista?')) {
            setDrivers(prev => prev.filter(driver => driver.id !== driverId));
        }
    };

    const getStatusColor = (status: Driver['status']) => {
        switch (status) {
            case 'Ativo':
                return 'bg-emerald-500/20 text-emerald-200';
            case 'Em análise':
                return 'bg-amber-500/20 text-yellow-800';
            case 'Inativo':
                return 'bg-rose-500/20 text-red-800';
            default:
                return 'bg-white/5 text-white';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-200';
        if (score >= 80) return 'text-amber-200';
        if (score >= 70) return 'text-orange-600';
        return 'text-rose-200';
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Expert':
                return 'bg-purple-100 text-purple-800';
            case 'Avançado':
                return 'bg-sky-500/20 text-blue-800';
            case 'Intermediário':
                return 'bg-emerald-500/20 text-emerald-200';
            case 'Iniciante':
                return 'bg-white/5 text-white';
            default:
                return 'bg-white/5 text-white';
        }
    };

    const getRankingIcon = (ranking: number) => {
        switch (ranking) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${ranking}`;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-golffox-blue-dark">Gestão de Motoristas</h2>
                    <Image src="/golffox-logo.svg" alt="Golffox Logo" className="h-6" width={24} height={24} />
                </div>
                <button 
                    onClick={handleAddDriver}
                    className="bg-golffox-orange-primary text-white px-4 py-2 rounded-lg hover:bg-golffox-orange-secondary transition-colors"
                >
                    Cadastrar Motorista
                </button>
            </div>

            {/* Navegação por abas */}
            <div className="bg-white/5 rounded-lg shadow-sm border border-golffox-gray-light/20">
                <div className="border-b border-golffox-gray-light/20">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('drivers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'drivers'
                                    ? 'border-golffox-orange-primary text-golffox-orange-primary'
                                    : 'border-transparent text-golffox-gray-medium hover:text-golffox-blue-dark hover:border-golffox-gray-medium'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <TruckIcon className="h-5 w-5" />
                                <span>Lista de Motoristas</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('ranking')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'ranking'
                                    ? 'border-golffox-orange-primary text-golffox-orange-primary'
                                    : 'border-transparent text-golffox-gray-medium hover:text-golffox-blue-dark hover:border-golffox-gray-medium'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <FlagCheckeredIcon className="h-5 w-5" />
                                <span>Ranking & Gamificação</span>
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Conteúdo baseado na aba ativa */}
            {activeTab === 'drivers' ? (
                <div className="bg-white/5 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Motorista
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    CPF
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    CNH
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Validade CNH
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Contrato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-gray-200">
                            {drivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-white/10">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image
                                                className="h-10 w-10 rounded-full"
                                                src="/golffox-logo.svg"
                                                alt="Golffox Logo"
                                                width={40}
                                                height={40}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">
                                                    {driver.name}
                                                </div>
                                                <div className="text-sm text-golffox-muted/90">
                                                    {driver.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {driver.cpf}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {driver.cnh}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {driver.cnhCategory}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {driver.cnhValidity ? formatDate(driver.cnhValidity) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {driver.contractType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewCNH(driver)}
                                                className="text-sky-200 hover:text-blue-900"
                                                title="Ver detalhes"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => handleEditDriver(driver)}
                                                className="text-emerald-200 hover:text-green-900"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDriver(driver.id)}
                                                className="text-rose-200 hover:text-red-900"
                                                title="Excluir"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            ) : (
                // Ranking & Gamificação Section
                <div className="space-y-6">
                    {/* Resumo Geral */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm">Motoristas Ativos</p>
                                    <p className="text-2xl font-bold">{topDrivers.length}</p>
                                </div>
                                <TruckIcon className="h-8 w-8 text-yellow-200" />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Economia Total</p>
                                    <p className="text-2xl font-bold">R$ {topDrivers.reduce((acc, p) => acc + (p.totalSavings ?? 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <ChartBarIcon className="h-8 w-8 text-green-200" />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Rotas Completadas</p>
                                    <p className="text-2xl font-bold">{topDrivers.reduce((acc, p) => acc + (p.routesCompleted ?? 0), 0)}</p>
                                </div>
                                <FlagCheckeredIcon className="h-8 w-8 text-blue-200" />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Pontuação Média</p>
                                    <p className="text-2xl font-bold">{(topDrivers.reduce((acc, p) => acc + (p.overallScore ?? 0), 0) / topDrivers.length).toFixed(1)}</p>
                                </div>
                                <ClockIcon className="h-8 w-8 text-purple-200" />
                            </div>
                        </div>
                    </div>

                    {/* Ranking dos Motoristas */}
                    <div className="bg-white/5 rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/12">
                            <h3 className="text-lg font-semibold text-white">🏆 Ranking de Performance</h3>
                            <p className="text-sm text-golffox-muted mt-1">Classificação baseada na pontuação geral dos motoristas</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Posição
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Motorista
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Nível
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Pontuação Geral
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Pontualidade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Economia
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Conformidade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Rotas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Economia Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-golffox-muted/90 uppercase tracking-wider">
                                            Badges
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/5 divide-y divide-gray-200">
                                    {topDrivers.map((performance, index) => (
                                        <tr key={performance.id} className={`hover:bg-white/10 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">{getRankingIcon(performance.ranking ?? 0)}</span>
                                                    <span className="text-sm font-medium text-white">#{performance.ranking ?? 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Image
                                                        className="h-10 w-10 rounded-full"
                                                        src="/golffox-logo.svg"
                                                        alt="Golffox Logo"
                                                        width={40}
                                                        height={40}
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">
                                                            {performance.driverName}
                                                        </div>
                                                        <div className="text-sm text-golffox-muted/90">
                                                            {performance.monthlyPoints} pts este mês
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(performance.level ?? '')}`}>
                                                    {performance.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`text-lg font-bold ${getScoreColor(performance.overallScore ?? 0)}`}>
                                                        {(performance.overallScore ?? 0).toFixed(1)}
                                                    </span>
                                                    <span className="text-sm text-golffox-muted/90 ml-1">/100</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-white/10 rounded-full h-2 mr-2">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full" 
                                                            style={{ width: `${performance.punctualityScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-white">{performance.punctualityScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-white/10 rounded-full h-2 mr-2">
                                                        <div 
                                                            className="bg-green-600 h-2 rounded-full" 
                                                            style={{ width: `${performance.fuelEfficiencyScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-white">{performance.fuelEfficiencyScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-white/10 rounded-full h-2 mr-2">
                                                        <div 
                                                            className="bg-purple-600 h-2 rounded-full" 
                                                            style={{ width: `${performance.routeComplianceScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-white">{performance.routeComplianceScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {performance.routesCompleted}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-200">
                                                R$ {(performance.totalSavings ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {(performance.badges ?? []).slice(0, 2).map((badge, badgeIndex) => (
                                                        <span 
                                                            key={badgeIndex}
                                                            className="inline-flex px-2 py-1 text-xs font-medium bg-amber-500/20 text-yellow-800 rounded-full"
                                                            title={badge}
                                                        >
                                                            🏅
                                                        </span>
                                                    ))}
                                                    {(performance.badges?.length ?? 0) > 2 && (
                                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-white/5 text-golffox-muted rounded-full">
                                                            +{(performance.badges?.length ?? 0) - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detalhes dos Top 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topDrivers.slice(0, 3).map((performance, index) => (
                            <div key={performance.id} className={`bg-white/5 rounded-lg shadow-lg border-2 ${
                                index === 0 ? 'border-yellow-400' : 
                                index === 1 ? 'border-gray-400' : 
                                'border-orange-400'
                            }`}>
                                <div className={`p-4 rounded-t-lg ${
                                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                                    'bg-gradient-to-r from-orange-400 to-orange-500'
                                } text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-3">{getRankingIcon(performance.ranking ?? 0)}</span>
                                            <div>
                                                <h3 className="font-bold text-lg">{performance.driverName}</h3>
                                                <p className="text-sm opacity-90">{performance.level}</p>
                                            </div>
                                        </div>
                                        <Image
                                            className="h-16 w-16 rounded-full border-4 border-white"
                                            src="/golffox-logo.svg"
                                            alt="Golffox Logo"
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                </div>
                                
                                <div className="p-4 space-y-3">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-white">{(performance.overallScore ?? 0).toFixed(1)}</p>
                                        <p className="text-sm text-golffox-muted">Pontuação Geral</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="text-center">
                                            <p className="font-semibold text-sky-200">{performance.punctualityScore}%</p>
                                            <p className="text-golffox-muted">Pontualidade</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-emerald-200">{performance.fuelEfficiencyScore}%</p>
                                            <p className="text-golffox-muted">Economia</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-purple-600">{performance.routeComplianceScore}%</p>
                                            <p className="text-golffox-muted">Conformidade</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-white">{performance.routesCompleted}</p>
                                            <p className="text-golffox-muted">Rotas</p>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t pt-3">
                                        <p className="text-center text-lg font-bold text-emerald-200">
                                            R$ {(performance.totalSavings ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-center text-sm text-golffox-muted">Economia Total</p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {(performance.badges ?? []).map((badge, badgeIndex) => (
                                            <span 
                                                key={badgeIndex}
                                                className="inline-flex px-2 py-1 text-xs font-medium bg-amber-500/20 text-yellow-800 rounded-full"
                                                title={badge}
                                            >
                                                🏅 {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal para visualizar detalhes do motorista */}
            {selectedDriver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/5 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Detalhes do Motorista</h3>
                            <button
                                onClick={() => setSelectedDriver(null)}
                                className="text-golffox-muted/90 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Dados Pessoais */}
                            <div>
                                <h4 className="font-semibold text-white mb-3">Dados Pessoais</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Nome:</span> {selectedDriver.name}</p>
                                    <p><span className="font-medium">CPF:</span> {selectedDriver.cpf}</p>
                                    <p><span className="font-medium">RG:</span> {selectedDriver.rg}</p>
                                    <p><span className="font-medium">Nascimento:</span> {selectedDriver.birthDate ? formatDate(selectedDriver.birthDate) : '-'}</p>
                                    <p><span className="font-medium">Telefone:</span> {selectedDriver.phone}</p>
                                    <p><span className="font-medium">E-mail:</span> {selectedDriver.email}</p>
                                    <p><span className="font-medium">Endereço:</span> {selectedDriver.address}</p>
                                    <p><span className="font-medium">CEP:</span> {selectedDriver.cep}</p>
                                </div>
                            </div>

                            {/* Dados Profissionais */}
                            <div>
                                <h4 className="font-semibold text-white mb-3">Dados Profissionais</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">CNH:</span> {selectedDriver.cnh}</p>
                                    <p><span className="font-medium">Validade CNH:</span> {selectedDriver.cnhValidity ? formatDate(selectedDriver.cnhValidity) : '-'}</p>
                                    <p><span className="font-medium">Categoria:</span> {selectedDriver.cnhCategory}</p>
                                    <p><span className="font-medium">EAR:</span> {selectedDriver.hasEAR ? 'Sim' : 'Não'}</p>
                                    <p><span className="font-medium">Último Exame:</span> {selectedDriver.lastToxicologicalExam ? formatDate(selectedDriver.lastToxicologicalExam) : '-'}</p>
                                    {selectedDriver.transportCourseValidity && (
                                        <p><span className="font-medium">Validade Curso:</span> {formatDate(selectedDriver.transportCourseValidity)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Vínculo Golffox */}
                            <div>
                                <h4 className="font-semibold text-white mb-3">Vínculo Golffox</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Contrato:</span> {selectedDriver.contractType}</p>
                                    <p><span className="font-medium">Credenciamento:</span> {selectedDriver.credentialingDate ? formatDate(selectedDriver.credentialingDate) : '-'}</p>
                                    <p><span className="font-medium">Status:</span> {selectedDriver.status}</p>
                                    <p><span className="font-medium">Empresa:</span> {selectedDriver.linkedCompany}</p>
                                </div>
                            </div>

                            {/* Informações Operacionais */}
                            <div>
                                <h4 className="font-semibold text-white mb-3">Informações Operacionais</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Rotas:</span> {selectedDriver.assignedRoutes?.join(', ') || 'Nenhuma'}</p>
                                    <p><span className="font-medium">Disponibilidade:</span> {selectedDriver.availability || 'Não informado'}</p>
                                    <p><span className="font-medium">Última Atualização:</span> {selectedDriver.lastUpdate ? formatDate(selectedDriver.lastUpdate) : '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedDriver(null)}
                                className="bg-white/100 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulário de Cadastro/Edição */}
            {showRegistrationForm && (
                <DriverRegistrationForm
                    onSubmit={handleSubmitDriver}
                    onCancel={handleCancelRegistration}
                    initialData={editingDriver || {}}
                />
            )}
        </div>
    );
};

export default DriversManagement;
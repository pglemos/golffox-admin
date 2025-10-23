import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  DollarSign,
  Users,
  MapPin,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Bell,
  X
} from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const {
    performance,
    routeAnalytics,
    vehicleAnalytics,
    dailyMetrics,
    monthlyTrends,
    alerts,
    kpis,
    isLoading,
    error,
    lastUpdated,
    loadAnalytics,
    refreshPerformanceMetrics,
    dismissAlert,
    calculateSummary,
    getBestPerformingVehicle,
    getAlertsBySeverity,
    formatValue,
    hasData,
    alertCount,
    highPriorityAlerts
  } = useAnalytics();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'vehicles' | 'trends'>('overview');
  const [showAlerts, setShowAlerts] = useState(false);

  const summary = calculateSummary();
  const bestVehicle = getBestPerformingVehicle();
  const alertsBySeverity = getAlertsBySeverity();

  if (error) {
    return (
      <div className="bg-rose-500/15 border border-rose-400/40 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-rose-200">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Erro ao carregar dados</span>
        </div>
        <p className="text-rose-200 mt-2">{error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard de Análises</h2>
          {lastUpdated && (
            <p className="text-sm text-golffox-muted/90 mt-1">
              Última atualização: {lastUpdated.toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Seletor de período */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
          </select>

          {/* Botão de alertas */}
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`relative px-3 py-2 rounded-lg transition-colors ${
              highPriorityAlerts > 0
                ? 'bg-rose-500/20 text-rose-200 hover:bg-rose-500/30'
                : 'bg-white/12 text-golffox-muted/90 hover:bg-white/10'
            }`}
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>

          {/* Botão de refresh */}
          <button
            onClick={refreshPerformanceMetrics}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500 text-white shadow-[0_15px_40px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Alertas (se visível) */}
      {showAlerts && alerts.length > 0 && (
        <div className="bg-white/5 border border-white/15 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Alertas do Sistema</h3>
            <button
              onClick={() => setShowAlerts(false)}
              className="text-golffox-muted/80 hover:text-golffox-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-3 rounded-lg ${
                  alert.severity === 'high' ? 'bg-rose-500/15 border border-rose-400/40' :
                  alert.severity === 'medium' ? 'bg-amber-500/15 border border-amber-400/40' :
                  'bg-sky-500/15 border border-sky-400/40'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-rose-300' :
                    alert.severity === 'medium' ? 'text-amber-200' :
                    'text-sky-200'
                  }`} />
                  <div>
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <p className="text-sm text-golffox-muted">{alert.message}</p>
                    <p className="text-xs text-golffox-muted/80 mt-1">
                      {alert.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-golffox-muted/80 hover:text-golffox-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navegação por abas */}
      <div className="border-b border-white/15">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'routes', label: 'Análise de Rotas', icon: MapPin },
            { id: 'vehicles', label: 'Frota', icon: Users },
            { id: 'trends', label: 'Tendências', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-golffox-muted/90 hover:text-white hover:border-white/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {isLoading && !hasData ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-300" />
            <span className="text-golffox-muted">Carregando dados de análise...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(kpis).map(([key, kpi]) => (
                  <div key={key} className="bg-white/5 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-golffox-muted capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {key.includes('Satisfaction') ? kpi.value.toFixed(1) : 
                           key.includes('Percentage') || key.includes('efficiency') || key.includes('Reduction') || key.includes('Savings') || key.includes('Delivery') || key.includes('Utilization') ? 
                           `${kpi.value.toFixed(1)}%` : kpi.value.toFixed(1)}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        kpi.trend === 'up' ? 'text-emerald-300' : 
                        kpi.trend === 'down' ? 'text-rose-200' : 'text-golffox-muted'
                      }`}>
                        {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                         kpi.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                         <div className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                          {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo Executivo */}
              {summary && (
                <div className="bg-white/5 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-white mb-4">Resumo Executivo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-sky-500/20 rounded-lg mx-auto mb-3">
                        <MapPin className="w-6 h-6 text-sky-200" />
                      </div>
                      <p className="text-2xl font-bold text-white">{summary.totalRoutes}</p>
                      <p className="text-sm text-golffox-muted">Rotas Otimizadas</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-lg mx-auto mb-3">
                        <DollarSign className="w-6 h-6 text-emerald-300" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {formatValue(summary.totalCostSaved, 'currency')}
                      </p>
                      <p className="text-sm text-golffox-muted">Economia Total</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-lg mx-auto mb-3">
                        <Clock className="w-6 h-6 text-amber-200" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {formatValue(summary.totalTimeSaved, 'time')}
                      </p>
                      <p className="text-sm text-golffox-muted">Tempo Economizado</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-lg mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-violet-200" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {summary.efficiency.toFixed(1)}%
                      </p>
                      <p className="text-sm text-golffox-muted">Eficiência Média</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Análise de Rotas */}
          {activeTab === 'routes' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-white mb-4">Performance de Rotas - Últimos 7 Dias</h3>
                <div className="space-y-4">
                  {routeAnalytics.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Data</p>
                          <p className="font-medium">{new Date(route.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Rotas</p>
                          <p className="font-medium">{route.routesOptimized}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Distância Economizada</p>
                          <p className="font-medium text-emerald-300">{formatValue(route.distanceSaved, 'distance')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Economia</p>
                          <p className="font-medium text-emerald-300">{formatValue(route.costSaved, 'currency')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Análise da Frota */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-white mb-4">Performance da Frota</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {vehicleAnalytics.map((vehicle) => (
                    <div key={vehicle.vehicleId} className="border border-white/15 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{vehicle.vehicleName}</h4>
                        <span className="text-sm text-golffox-muted/90">{vehicle.vehicleId}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-golffox-muted">Distância Total</p>
                          <p className="font-medium">{formatValue(vehicle.totalDistance, 'distance')}</p>
                        </div>
                        <div>
                          <p className="text-golffox-muted">Eficiência Combustível</p>
                          <p className="font-medium">{vehicle.fuelEfficiency.toFixed(1)} km/L</p>
                        </div>
                        <div>
                          <p className="text-golffox-muted">Taxa de Utilização</p>
                          <p className="font-medium">{(vehicle.utilizationRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-golffox-muted">Score Manutenção</p>
                          <p className={`font-medium ${
                            vehicle.maintenanceScore > 0.8 ? 'text-emerald-300' :
                            vehicle.maintenanceScore > 0.6 ? 'text-amber-200' : 'text-rose-200'
                          }`}>
                            {(vehicle.maintenanceScore * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {bestVehicle && (
                  <div className="mt-6 p-4 bg-emerald-500/15 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-emerald-200 mb-2">🏆 Melhor Performance</h4>
                    <p className="text-emerald-200">
                      <strong>{bestVehicle.vehicleName}</strong> com eficiência de {bestVehicle.fuelEfficiency.toFixed(1)} km/L
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tendências */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-white mb-4">Tendências Mensais</h3>
                <div className="space-y-4">
                  {monthlyTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Mês</p>
                          <p className="font-medium">{trend.month}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Receita</p>
                          <p className="font-medium text-emerald-300">{formatValue(trend.revenue, 'currency')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Lucro</p>
                          <p className={`font-medium ${trend.profit > 0 ? 'text-emerald-300' : 'text-rose-200'}`}>
                            {formatValue(trend.profit, 'currency')}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-golffox-muted">Crescimento</p>
                          <p className={`font-medium ${trend.customerGrowth > 0 ? 'text-emerald-300' : 'text-rose-200'}`}>
                            {trend.customerGrowth > 0 ? '+' : ''}{trend.customerGrowth.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
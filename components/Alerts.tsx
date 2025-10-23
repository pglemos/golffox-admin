import React, { useMemo, useState } from 'react';
import { AlertTriangle, Info, X, RefreshCw, Filter } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';
import { AlertType } from '../src/types/types';
import { useNotifications } from '../hooks/useNotifications';

const Alerts: React.FC = () => {
  const [showMockData, setShowMockData] = useState(false);
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');

  const {
    alerts,
    stats,
    isLoading,
    dismissAlert,
    clearOldAlerts,
    refresh,
  } = useNotifications({
    autoCheck: true,
    checkInterval: 30000,
  });

  const tipoParaRotulo: Record<AlertType, string> = {
    [AlertType.Critical]: 'Críticos',
    [AlertType.Warning]: 'Avisos',
    [AlertType.Info]: 'Informativos',
  };

  // Combina alertas reais com mock data se necessário
  const allAlerts = useMemo(() => {
    if (!showMockData) {
      return alerts;
    }

    const mockAlerts = MOCK_ALERTS.filter(
      (mockAlert) => !alerts.some((alert) => alert.id === mockAlert.id),
    );

    return [...alerts, ...mockAlerts];
  }, [alerts, showMockData]);

  const computedStats = useMemo(() => {
    const totais = {
      total: allAlerts.length,
      critical: 0,
      warning: 0,
      info: 0,
      last24h: 0,
    };

    const limite24h = Date.now() - 24 * 60 * 60 * 1000;

    allAlerts.forEach((alert) => {
      if (alert.type === AlertType.Critical) {
        totais.critical += 1;
      }

      if (alert.type === AlertType.Warning) {
        totais.warning += 1;
      }

      if (alert.type === AlertType.Info) {
        totais.info += 1;
      }

      if (new Date(alert.timestamp).getTime() >= limite24h) {
        totais.last24h += 1;
      }
    });

    return {
      ...stats,
      ...totais,
    };
  }, [allAlerts, stats]);

  // Aplica filtro por tipo
  const filteredAlerts = useMemo(() => {
    if (filterType === 'all') {
      return allAlerts;
    }

    return allAlerts.filter((alert) => alert.type === filterType);
  }, [allAlerts, filterType]);

  const sortedAlerts = useMemo(
    () =>
      [...filteredAlerts].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [filteredAlerts],
  );

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.Critical:
        return <AlertTriangle className="w-5 h-5" />;
      case AlertType.Warning:
        return <AlertTriangle className="w-5 h-5" />;
      case AlertType.Info:
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case AlertType.Critical:
        return 'bg-rose-500/15 border-red-200 text-red-800';
      case AlertType.Warning:
        return 'bg-amber-500/15 border-yellow-200 text-yellow-800';
      case AlertType.Info:
        return 'bg-sky-500/15 border-blue-200 text-blue-800';
      default:
        return 'bg-white/10 border-white/12 text-white';
    }
  };

  const handleDismissAlert = (alertId: string) => {
    if (!showMockData || !MOCK_ALERTS.find((alert) => alert.id === alertId)) {
      dismissAlert(alertId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Sistema de Alertas</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-white">{computedStats.total}</div>
          <div className="text-sm text-golffox-muted">Total de Alertas</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-rose-200">{computedStats.critical}</div>
          <div className="text-sm text-golffox-muted">Críticos</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-amber-200">{computedStats.warning}</div>
          <div className="text-sm text-golffox-muted">Avisos</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-sky-200">{computedStats.info}</div>
          <div className="text-sm text-golffox-muted">Informativos</div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-golffox-muted/90" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as AlertType | 'all')}
              className="border border-white/15 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todos os tipos</option>
              <option value={AlertType.Critical}>{tipoParaRotulo[AlertType.Critical]}</option>
              <option value={AlertType.Warning}>{tipoParaRotulo[AlertType.Warning]}</option>
              <option value={AlertType.Info}>{tipoParaRotulo[AlertType.Info]}</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showMockData}
              onChange={(e) => setShowMockData(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-golffox-muted">Mostrar dados de exemplo</span>
          </label>
        </div>

        {allAlerts.length > 0 && (
          <button
            onClick={clearOldAlerts}
            className="px-4 py-2 text-sm text-golffox-muted hover:text-white border border-white/15 rounded-lg hover:bg-white/10"
          >
            Limpar alertas antigos
          </button>
        )}
      </div>

      {/* Lista de alertas */}
      <div className="space-y-4">
        {isLoading && alerts.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white/70 mb-2" />
            <p className="text-golffox-muted">Carregando alertas...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Info className="w-12 h-12 mx-auto text-white/70 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum alerta encontrado</h3>
            <p className="text-golffox-muted">
              {filterType === 'all' 
                ? 'Não há alertas no momento.' 
                : `Não há alertas do tipo ${filterType}.`}
            </p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getAlertStyles(alert.type)} relative`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-lg">{alert.title}</h3>
                  <p className="mt-1 text-sm opacity-90">{alert.message}</p>
                  <p className="mt-2 text-xs opacity-75">
                    {new Date(alert.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                  title="Dispensar alerta"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
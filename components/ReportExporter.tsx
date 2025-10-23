import React, { useState } from 'react';
import { Download, FileText, Table, File, Clock, CheckCircle, AlertCircle, X, Settings } from 'lucide-react';
import { useReportExport } from '../hooks/useReportExport';
import { useAnalytics } from '../hooks/useAnalytics';
import { useVehicleTracking } from '../hooks/useVehicleTracking';
import { useRouteOptimization } from '../hooks/useRouteOptimization';

interface ReportExporterProps {
  onClose?: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [selectedReports, setSelectedReports] = useState<string[]>(['analytics']);
  const [customFileName, setCustomFileName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(true);

  const {
    isExporting,
    exportHistory,
    error,
    exportConsolidatedReport,
    exportRouteReport,
    exportVehicleReport,
    exportKPIReport,
    exportMultipleReports,
    clearError,
    getExportStats
  } = useReportExport();

  const { 
    performance, 
    routeAnalytics, 
    vehicleAnalytics, 
    kpis 
  } = useAnalytics();

  const { vehicles } = useVehicleTracking();
  const { state: routeOptimizationState } = useRouteOptimization();

  const reportTypes = [
    {
      id: 'analytics',
      name: 'Dashboard de Análises',
      description: 'Relatório completo com todas as métricas',
      icon: FileText,
      color: 'text-sky-200'
    },
    {
      id: 'routes',
      name: 'Análise de Rotas',
      description: 'Otimização e performance de rotas',
      icon: FileText,
      color: 'text-emerald-200'
    },
    {
      id: 'vehicles',
      name: 'Performance da Frota',
      description: 'Análise detalhada dos veículos',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      id: 'kpis',
      name: 'Indicadores (KPIs)',
      description: 'Métricas chave de performance',
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  const formatOptions = [
    {
      id: 'pdf' as const,
      name: 'PDF',
      description: 'Documento formatado para impressão',
      icon: FileText,
      color: 'text-rose-200'
    },
    {
      id: 'excel' as const,
      name: 'Excel',
      description: 'Planilha para análise de dados',
      icon: Table,
      color: 'text-emerald-200'
    },
    {
      id: 'csv' as const,
      name: 'CSV',
      description: 'Dados tabulares simples',
      icon: File,
      color: 'text-sky-200'
    }
  ];

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) return;

    clearError();

    try {
      if (selectedReports.length === 1) {
        const reportType = selectedReports[0];
        const options = {
          format: selectedFormat,
          fileName: customFileName || undefined,
          includeCharts,
          includeRawData
        };

        switch (reportType) {
          case 'analytics':
            await exportConsolidatedReport({
              performance,
              routeAnalytics,
              vehicleAnalytics,
              kpis
            }, selectedFormat);
            break;
          case 'routes':
            await exportRouteReport(routeOptimizationState.optimizationHistory, selectedFormat);
            break;
          case 'vehicles':
            await exportVehicleReport(vehicles, selectedFormat);
            break;
          case 'kpis':
            await exportKPIReport(kpis, selectedFormat);
            break;
        }
      } else {
        // Exportação múltipla
        const reports = selectedReports.map(reportType => {
          switch (reportType) {
            case 'analytics':
              return {
                data: { performance, routeAnalytics, vehicleAnalytics, kpis },
                type: 'consolidated' as const
              };
            case 'routes':
              return { data: routeOptimizationState.optimizationHistory, type: 'route' as const };
            case 'vehicles':
              return { data: vehicles, type: 'vehicle' as const };
            case 'kpis':
              return { data: kpis, type: 'kpi' as const };
            default:
              return { data: [], type: 'route' as const };
          }
        });

        await exportMultipleReports(reports, selectedFormat);
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
    }
  };

  const exportStats = getExportStats();

  return (
    <div className="bg-white/5 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Download className="h-6 w-6 text-sky-200" />
          <h2 className="text-xl font-semibold text-white">Exportar Relatórios</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-golffox-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-rose-500/15 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-rose-200" />
          <span className="text-rose-200">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-rose-200 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seleção de Relatórios */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Selecionar Relatórios</h3>
          <div className="space-y-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReports.includes(report.id);
              
              return (
                <div
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-sky-500/15'
                      : 'border-white/12 hover:border-white/15'
                  }`}
                  onClick={() => handleReportToggle(report.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${report.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{report.name}</h4>
                      <p className="text-sm text-golffox-muted">{report.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-sky-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurações de Exportação */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Formato de Exportação</h3>
          
          {/* Formatos */}
          <div className="space-y-3 mb-6">
            {formatOptions.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormat === format.id;
              
              return (
                <div
                  key={format.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-sky-500/15'
                      : 'border-white/12 hover:border-white/15'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${format.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{format.name}</h4>
                      <p className="text-sm text-golffox-muted">{format.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-sky-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nome do Arquivo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Nome do Arquivo (opcional)
            </label>
            <input
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="relatorio_personalizado"
              className="w-full px-3 py-2 border border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Configurações Avançadas */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-sky-200 hover:text-blue-800"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações Avançadas</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 p-3 bg-white/10 rounded-lg">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="rounded border-white/15 text-sky-200 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Incluir gráficos</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeRawData}
                    onChange={(e) => setIncludeRawData(e.target.checked)}
                    className="rounded border-white/15 text-sky-200 focus:ring-blue-500"
                  />
                  <span className="text-sm text-white">Incluir dados brutos</span>
                </label>
              </div>
            )}
          </div>

          {/* Botão de Exportação */}
          <button
            onClick={handleExport}
            disabled={isExporting || selectedReports.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Exportar Relatórios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Histórico de Exportações */}
      {exportHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/12">
          <h3 className="text-lg font-medium text-white mb-4">Histórico de Exportações</h3>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-golffox-muted">Total</div>
              <div className="text-lg font-semibold text-white">{exportStats.totalExports}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-golffox-muted">Formato Preferido</div>
              <div className="text-lg font-semibold text-white">{exportStats.mostUsedFormat}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-golffox-muted">Último Export</div>
              <div className="text-lg font-semibold text-white">
                {exportStats.lastExport ? exportStats.lastExport.format : 'N/A'}
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-golffox-muted">PDF</div>
              <div className="text-lg font-semibold text-white">
                {exportStats.formatCounts.PDF || 0}
              </div>
            </div>
          </div>

          {/* Lista do Histórico */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {exportHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-white/10 rounded">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-white/70" />
                  <div>
                    <div className="text-sm font-medium text-white">{item.fileName}</div>
                    <div className="text-xs text-golffox-muted">
                      {item.reportType} • {item.format} • {item.size}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-golffox-muted/90">
                  {item.exportedAt.toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  Compass,
  Cpu,
  Moon,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';

const gradientColors = ['#6C63FF', '#4AA8FF', '#2ADBCB', '#7C3AED'];

const AnalyticsDashboard: React.FC = () => {
  const {
    dailyMetrics,
    vehicleAnalytics,
    alerts,
    isLoading,
    error,
    lastUpdated,
    loadAnalytics,
    refreshPerformanceMetrics,
    calculateSummary,
    formatValue,
    alertCount,
    highPriorityAlerts
  } = useAnalytics();

  const router = useRouter();
  const alertasRecentesRef = useRef<HTMLDivElement | null>(null);
  const destaqueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [destacarAlertas, setDestacarAlertas] = useState(false);
  const [modoEscuroAtivo, setModoEscuroAtivo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const temaSalvo = window.localStorage.getItem('golffox-theme');
    const prefereEscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const usarModoEscuro = temaSalvo ? temaSalvo === 'dark' : prefereEscuro;

    setModoEscuroAtivo(usarModoEscuro);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', usarModoEscuro);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (destaqueTimeoutRef.current) {
        clearTimeout(destaqueTimeoutRef.current);
      }
    };
  }, []);

  const alternarTema = useCallback(() => {
    setModoEscuroAtivo((prev) => {
      const proximo = !prev;

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', proximo);
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('golffox-theme', proximo ? 'dark' : 'light');
      }

      return proximo;
    });
  }, []);

  const abrirAlertasRecentes = useCallback(() => {
    alertasRecentesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setDestacarAlertas(true);

    if (destaqueTimeoutRef.current) {
      clearTimeout(destaqueTimeoutRef.current);
    }

    destaqueTimeoutRef.current = setTimeout(() => {
      setDestacarAlertas(false);
    }, 1600);
  }, []);

  const todaysMetrics = dailyMetrics[dailyMetrics.length - 1];
  const yesterdayMetrics = dailyMetrics[dailyMetrics.length - 2];

  const summary = calculateSummary();

  const passengersInTransit = todaysMetrics
    ? Math.max(0, Math.round(todaysMetrics.totalRoutes * 2.4))
    : 0;
  const passengerDelta = yesterdayMetrics
    ? passengersInTransit - Math.round(yesterdayMetrics.totalRoutes * 2.4)
    : 0;

  const activeVehicles = todaysMetrics?.activeVehicles ?? vehicleAnalytics.length;
  const activeVehiclesDelta = yesterdayMetrics
    ? activeVehicles - yesterdayMetrics.activeVehicles
    : 0;

  const routesToday = todaysMetrics?.totalRoutes ?? 0;
  const routesDelta = yesterdayMetrics
    ? routesToday - yesterdayMetrics.totalRoutes
    : 0;

  const criticalAlerts = alerts.filter((alert) => alert.severity === 'high');

  const occupancyData = useMemo(() => {
    if (!todaysMetrics) {
      return [65, 68, 70, 72, 75, 74];
    }

    const base = todaysMetrics.totalRoutes * 2.1;
    return Array.from({ length: 6 }, (_, index) => {
      const wave = Math.sin(index / 1.8) * 6;
      return Math.round(base + wave);
    });
  }, [todaysMetrics]);

  const maxOccupancy = Math.max(...occupancyData);
  const minOccupancy = Math.min(...occupancyData);
  const range = maxOccupancy - minOccupancy || 1;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Erro ao carregar dados</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
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
    <div className="space-y-6 text-golffox-gray-dark">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-golffox-blue-dark shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-golffox-orange-primary" />
            Golf Fox Admin • Premium 9.0
          </span>
          {lastUpdated && (
            <span className="text-sm text-golffox-gray-medium">
              Atualizado em {lastUpdated.toLocaleString('pt-BR')}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={refreshPerformanceMetrics}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-golffox-blue-dark shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar métricas
          </button>
          <button
            onClick={alternarTema}
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-gradient-to-r from-white/90 to-white px-4 py-2 text-sm font-medium text-golffox-blue-dark shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label={modoEscuroAtivo ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            <Moon className={`h-4 w-4 ${modoEscuroAtivo ? 'text-golffox-blue-dark' : ''}`} />
            {modoEscuroAtivo ? 'Modo claro' : 'Modo escuro'}
          </button>
          <button
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              highPriorityAlerts > 0
                ? 'bg-red-500 text-white'
                : 'bg-white text-golffox-blue-dark'
            }`}
            onClick={abrirAlertasRecentes}
          >
            <Bell className="h-4 w-4" />
            Alertas
            {alertCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/20 px-2 text-xs font-semibold">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#EEF2FF] via-white to-[#FDF2EC]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-golffox-gray-medium">Passageiros em trânsito</p>
              <p className="mt-2 text-3xl font-bold text-golffox-blue-dark">{passengersInTransit}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
              <Users className="h-6 w-6 text-[#6C63FF]" />
            </div>
          </div>
          <div
            className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${
              passengerDelta >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${passengerDelta < 0 ? 'rotate-180 text-red-500' : ''}`} />
            {passengerDelta >= 0 ? '+' : ''}{passengerDelta} vs ontem
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E6FFFA] via-white to-[#F0F5FF]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-golffox-gray-medium">Veículos ativos</p>
              <p className="mt-2 text-3xl font-bold text-golffox-blue-dark">{activeVehicles}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
              <Activity className="h-6 w-6 text-[#2ADBCB]" />
            </div>
          </div>
          <div
            className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${
              activeVehiclesDelta >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${activeVehiclesDelta < 0 ? 'rotate-180 text-red-500' : ''}`} />
            {activeVehiclesDelta >= 0 ? '+' : ''}{activeVehiclesDelta} vs ontem
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FFF4D5] via-white to-[#F0F5FF]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-golffox-gray-medium">Rotas de hoje</p>
              <p className="mt-2 text-3xl font-bold text-golffox-blue-dark">{routesToday}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
              <Compass className="h-6 w-6 text-[#FFB347]" />
            </div>
          </div>
          <div
            className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${
              routesDelta >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${routesDelta < 0 ? 'rotate-180 text-red-500' : ''}`} />
            {routesDelta >= 0 ? '+' : ''}{routesDelta} vs ontem
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FFE4E6] via-white to-[#F3F4FF]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-golffox-gray-medium">Alertas críticos</p>
              <p className="mt-2 text-3xl font-bold text-golffox-blue-dark">{criticalAlerts.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
              <AlertTriangle className="h-6 w-6 text-[#F97316]" />
            </div>
          </div>
          <div className="mt-4 text-sm font-medium text-golffox-gray-medium">
            {criticalAlerts.length > 0 ? 'Ações imediatas necessárias' : 'Nenhum alerta crítico'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-golffox-blue-dark">Ocupação por hora</h3>
              <p className="text-sm text-golffox-gray-medium">Monitoramento contínuo da taxa de ocupação da frota</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-golffox-gray-medium">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#4C1D95]">
                <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                Hoje
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F5FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                Meta
              </span>
            </div>
          </div>
          <div className="mt-8">
            <svg viewBox="0 0 100 40" className="h-48 w-full">
              <defs>
                <linearGradient id="occupancy-gradient" x1="0" x2="1" y1="0" y2="0">
                  {gradientColors.map((color, index) => (
                    <stop
                      key={color}
                      offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              </defs>
              <path
                d={`M0,${40 - ((occupancyData[0] - minOccupancy) / range) * 30 - 5}` +
                  occupancyData
                    .map((value, index) => {
                      const x = (index / (occupancyData.length - 1)) * 100;
                      const y = 40 - ((value - minOccupancy) / range) * 30 - 5;
                      return ` L${x.toFixed(2)},${y.toFixed(2)}`;
                    })
                    .join('')}
                fill="none"
                stroke="url(#occupancy-gradient)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {occupancyData.map((value, index) => {
                const x = (index / (occupancyData.length - 1)) * 100;
                const y = 40 - ((value - minOccupancy) / range) * 30 - 5;
                return <circle key={index} cx={x} cy={y} r={1.5} fill="#7C3AED" />;
              })}
            </svg>
            <div className="mt-4 grid grid-cols-6 text-center text-sm text-golffox-gray-medium">
              {['08h', '11h', '14h', '17h', '20h', '23h'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-golffox-blue-dark">Status de operação</h4>
                <p className="mt-1 text-sm text-golffox-gray-medium">Sinalização em tempo real das rotas</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-[#ECFDF5] p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                <div>
                  <p className="text-sm font-semibold text-[#047857]">Operação estável</p>
                  <p className="text-xs text-[#065F46]">Todas as rotas dentro da tolerância de desvio</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-[#FEF3C7] p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#D97706]" />
                <div>
                  <p className="text-sm font-semibold text-[#92400E]">Monitorar rotas</p>
                  <p className="text-xs text-[#B45309]">2 rotas com leve desvio aguardando correção</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                <div>
                  <p className="text-sm font-semibold text-[#991B1B]">Alerta pendente</p>
                  <p className="text-xs text-[#B91C1C]">
                    {criticalAlerts.length > 0
                      ? `${criticalAlerts.length} alerta(s) precisam de atenção imediata`
                      : 'Nenhum alerta crítico agora'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={alertasRecentesRef}
            className={`rounded-3xl bg-white p-6 shadow-sm transition ${destacarAlertas ? 'ring-2 ring-golffox-blue-dark shadow-lg' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-golffox-blue-dark">Alertas recentes</h4>
              <span className="text-xs font-medium text-golffox-gray-medium">Últimas 24h</span>
            </div>
            <div className="mt-4 space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-xl ${
                      alert.severity === 'high'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : alert.severity === 'medium'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#DBEAFE] text-[#1D4ED8]'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-golffox-blue-dark">{alert.title}</p>
                      <span className="text-xs text-golffox-gray-medium">
                        {alert.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-golffox-gray-medium">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Rastrear veículos',
            description: 'Verifique a localização e status em tempo real da frota',
            accent: 'from-[#EDE9FE] to-white',
            icon: <Compass className="h-5 w-5 text-[#5B21B6]" />,
            href: '/operador'
          },
          {
            title: 'Análises avançadas',
            description: 'Explore dados históricos e previsões automáticas',
            accent: 'from-[#DBEAFE] to-white',
            icon: <Cpu className="h-5 w-5 text-[#1D4ED8]" />,
            href: '/administrador'
          },
          {
            title: 'Branding e experiência',
            description: 'Personalize o app com a identidade da sua empresa',
            accent: 'from-[#FEF3C7] to-white',
            icon: <CheckCircle className="h-5 w-5 text-[#B45309]" />,
            href: '/golffox'
          }
        ].map((card) => (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.accent} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(91,46,255,0.15), transparent 45%)' }}
            />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                  {card.icon}
                </div>
                <h5 className="text-lg font-semibold text-golffox-blue-dark">{card.title}</h5>
              </div>
              <p className="text-sm text-golffox-gray-medium">{card.description}</p>
              <button
                onClick={() => router.push(card.href)}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-golffox-blue-dark transition hover:translate-x-0.5"
                aria-label={`Ir para ${card.title}`}
              >
                Acessar painel
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-xl font-semibold text-golffox-blue-dark">Insights de IA</h4>
            <p className="text-sm text-golffox-gray-medium">Relatório diário com oportunidades de otimização detectadas automaticamente</p>
          </div>
          {summary && (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#047857]">
              <TrendingUp className="h-4 w-4" />
              +{summary.efficiency.toFixed(1)}% eficiência média
            </div>
          )}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#EEF2FF] p-5">
            <h5 className="text-sm font-semibold text-golffox-blue-dark">Rotas inteligentes</h5>
            <p className="mt-2 text-sm text-golffox-gray-medium">Algoritmo identificou 5 rotas com potencial de economia adicional de 12%.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF2FF] p-5">
            <h5 className="text-sm font-semibold text-golffox-blue-dark">Operações preditivas</h5>
            <p className="mt-2 text-sm text-golffox-gray-medium">Probabilidade de atrasos críticos reduziu 18% comparado à última semana.</p>
          </div>
          <div className="rounded-2xl border border-[#EEF2FF] p-5">
            <h5 className="text-sm font-semibold text-golffox-blue-dark">Custo por quilômetro</h5>
            <p className="mt-2 text-sm text-golffox-gray-medium">
              Economia projetada de {summary ? formatValue(summary.totalCostSaved * 0.12, 'currency') : 'R$ 0,00'} para o próximo ciclo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;

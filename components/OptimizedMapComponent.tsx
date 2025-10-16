import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { optimizedMapsService, type OptimizedRoute, type RouteWaypoint, type DynamicMarker } from '../services/optimizedMapsService';
import { queryKeys, queryOptions } from '../lib/react-query';
import { Loader2, Route, MapPin, Zap, Clock, DollarSign } from 'lucide-react';

interface OptimizedMapProps {
  waypoints?: RouteWaypoint[];
  markers?: DynamicMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  width?: string;
  showRouteOptimization?: boolean;
  showMarkerClustering?: boolean;
  onRouteOptimized?: (route: OptimizedRoute) => void;
  onMarkerClick?: (marker: DynamicMarker) => void;
  className?: string;
}

const OptimizedMapComponent: React.FC<OptimizedMapProps> = ({
  waypoints = [],
  markers = [],
  center = { lat: -23.5505, lng: -46.6333 },
  zoom = 12,
  height = '400px',
  width = '100%',
  showRouteOptimization = true,
  showMarkerClustering = true,
  onRouteOptimized,
  onMarkerClick,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [optimizationStatus, setOptimizationStatus] = useState<'idle' | 'optimizing' | 'completed' | 'error'>('idle');
  const queryClient = useQueryClient();

  // Query para otimização de rota
  const {
    data: optimizedRoute,
    isLoading: isOptimizing,
    error: optimizationError,
  } = useQuery({
    queryKey: queryKeys.maps.route(
      waypoints.map(w => w.address).join('|'),
      'optimized'
    ),
    queryFn: () => optimizedMapsService.optimizeRoute(waypoints),
    enabled: showRouteOptimization && waypoints.length >= 2,
    ...queryOptions.maps,
  });

  // Mutation para atualizar markers dinâmicos
  const updateMarkersMutation = useMutation({
    mutationFn: (newMarkers: DynamicMarker[]) => 
      optimizedMapsService.createDynamicMarkers(mapInstanceRef.current!, newMarkers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return;

    const initMap = () => {
      if (typeof google === 'undefined' || !google.maps) {
        setTimeout(initMap, 100);
        return;
      }

      const map = new google.maps.Map(mapRef.current!, {
        center,
        zoom,
        styles: getMapStyles(),
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    initMap();
  }, [center, zoom]);

  // Renderizar rota otimizada
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !optimizedRoute) return;

    const renderRoute = async () => {
      try {
        setOptimizationStatus('optimizing');
        await optimizedMapsService.renderOptimizedRoute(mapInstanceRef.current!, optimizedRoute);
        setOptimizationStatus('completed');
        onRouteOptimized?.(optimizedRoute);
      } catch (error) {
        console.error('Erro ao renderizar rota:', error);
        setOptimizationStatus('error');
      }
    };

    renderRoute();
  }, [isMapLoaded, optimizedRoute, onRouteOptimized]);

  // Renderizar markers dinâmicos
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || markers.length === 0) return;

    const renderMarkers = async () => {
      try {
        const markersWithCallbacks = markers.map(marker => ({
          ...marker,
          onClick: marker.onClick || (() => onMarkerClick?.(marker)),
        }));

        if (showMarkerClustering) {
          await optimizedMapsService.createDynamicMarkers(mapInstanceRef.current!, markersWithCallbacks);
        } else {
          // Renderizar sem clustering
          await optimizedMapsService.createDynamicMarkers(mapInstanceRef.current!, markersWithCallbacks);
        }
      } catch (error) {
        console.error('Erro ao renderizar markers:', error);
      }
    };

    renderMarkers();
  }, [isMapLoaded, markers, showMarkerClustering, onMarkerClick]);

  // Função para reotimizar rota
  const handleReoptimize = useCallback(() => {
    if (waypoints.length >= 2) {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.maps.route(waypoints.map(w => w.address).join('|'), 'optimized')
      });
    }
  }, [waypoints, queryClient]);

  // Função para centralizar mapa
  const centerMapOnRoute = useCallback(() => {
    if (!mapInstanceRef.current || !optimizedRoute) return;

    const bounds = new google.maps.LatLngBounds();
    optimizedRoute.waypoints.forEach(waypoint => {
      bounds.extend(waypoint.coordinates);
    });

    mapInstanceRef.current.fitBounds(bounds);
  }, [optimizedRoute]);

  // Estilos do mapa
  const getMapStyles = () => [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Mapa */}
      <div
        ref={mapRef}
        style={{ height, width }}
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      />

      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-golffox-orange-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Painel de informações da rota */}
      {showRouteOptimization && optimizedRoute && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <Route className="w-5 h-5 text-golffox-orange-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Rota Otimizada</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {optimizedRoute.waypoints.length} paradas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {optimizedRoute.totalDistance.toFixed(1)} km
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {Math.round(optimizedRoute.totalDuration)} min
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                R$ {optimizedRoute.estimatedFuelCost.toFixed(2)}
              </span>
            </div>

            {optimizedRoute.savings.percentage > 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Zap className="w-4 h-4" />
                <span className="font-medium">
                  {optimizedRoute.savings.percentage.toFixed(1)}% economia
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleReoptimize}
              disabled={isOptimizing}
              className="btn btn-sm btn-outline flex-1"
            >
              {isOptimizing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Reotimizar'
              )}
            </button>

            <button
              onClick={centerMapOnRoute}
              className="btn btn-sm btn-primary flex-1"
            >
              Centralizar
            </button>
          </div>
        </div>
      )}

      {/* Status de otimização */}
      {optimizationStatus === 'optimizing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-golffox-orange-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Otimizando rota...</span>
        </div>
      )}

      {optimizationStatus === 'error' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-medium">Erro na otimização</span>
        </div>
      )}

      {/* Controles do mapa */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {markers.length > 0 && (
          <button
            onClick={() => updateMarkersMutation.mutate(markers)}
            disabled={updateMarkersMutation.isPending}
            className="btn btn-sm btn-secondary"
            title="Atualizar markers"
          >
            {updateMarkersMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OptimizedMapComponent;

// Hook para usar o mapa otimizado
export const useOptimizedMap = (waypoints: RouteWaypoint[]) => {
  const queryClient = useQueryClient();

  const optimizeRoute = useCallback(async () => {
    if (waypoints.length < 2) return null;

    const result = await queryClient.fetchQuery({
      queryKey: queryKeys.maps.route(waypoints.map(w => w.address).join('|'), 'optimized'),
      queryFn: () => optimizedMapsService.optimizeRoute(waypoints),
      ...queryOptions.maps,
    });

    return result;
  }, [waypoints, queryClient]);

  const clearCache = useCallback(() => {
    optimizedMapsService.clearRouteCache();
    queryClient.invalidateQueries({ queryKey: ['maps'] });
  }, [queryClient]);

  const getCacheStats = useCallback(() => {
    return optimizedMapsService.getCacheStats();
  }, []);

  return {
    optimizeRoute,
    clearCache,
    getCacheStats,
  };
};
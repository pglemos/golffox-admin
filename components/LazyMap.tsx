import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import OptimizedMapComponent from './OptimizedMapComponent';

// Lazy load do componente de mapa
const GoogleMapsLoader = lazy(() => import('./GoogleMapsLoader'));

interface LazyMapProps {
  height?: string;
  width?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}

// Componente de loading para o mapa
const MapSkeleton = ({ height = '400px', width = '100%' }: { height?: string; width?: string }) => (
  <div 
    className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center"
    style={{ height, width }}
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando mapa...</p>
    </div>
  </div>
);

// Componente de erro para o mapa
const MapError = ({ height = '400px', width = '100%', onRetry }: { 
  height?: string; 
  width?: string; 
  onRetry?: () => void;
}) => (
  <div 
    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center"
    style={{ height, width }}
  >
    <div className="text-center p-4">
      <div className="text-red-600 dark:text-red-400 text-4xl mb-2">🗺️</div>
      <p className="text-red-700 dark:text-red-300 text-sm mb-3">
        Erro ao carregar o mapa
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  </div>
);

const LazyMap: React.FC<LazyMapProps> = ({
  height = '400px',
  width = '100%',
  center,
  zoom,
  markers,
  onMapLoad,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  
  // Usar intersection observer para carregar apenas quando visível
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Carregar apenas uma vez
  });

  const handleRetry = () => {
    setHasError(false);
    setRetryKey(prev => prev + 1);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Preparar markers para OptimizedMapComponent
  const dynamicMarkers = (markers || []).map(m => ({
    id: m.id,
    position: m.position,
    type: 'pickup' as const,
    status: 'active' as const,
    data: {
      title: m.title || 'Local',
      description: m.info,
      icon: undefined,
      color: '#FF5F00',
      animation: null,
    },
  }));

  // Se houve erro, mostrar componente de erro
  if (hasError) {
    return (
      <div ref={ref} className={className}>
        <MapError height={height} width={width} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense fallback={<MapSkeleton height={height} width={width} />}>
          <ErrorBoundary onError={handleError} key={retryKey}>
            <GoogleMapsLoader>
              <OptimizedMapComponent
                height={height}
                width={width}
                center={center}
                zoom={zoom}
                markers={dynamicMarkers}
                className=""
              />
            </GoogleMapsLoader>
          </ErrorBoundary>
        </Suspense>
      ) : (
        <MapSkeleton height={height} width={width} />
      )}
    </div>
  );
};

// Error Boundary para capturar erros do mapa
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro no mapa:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // O componente pai vai mostrar o erro
    }

    return this.props.children;
  }
}

export default LazyMap;

// Hook para usar o mapa com cache
export const useMapData = (center?: { lat: number; lng: number }) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
    setIsLoaded(true);
  };

  // Função para adicionar marcadores de forma otimizada
  const addMarkers = (markers: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>) => {
    if (!mapInstance) return;

    // Limpar marcadores existentes
    // (implementar lógica de limpeza se necessário)

    // Adicionar novos marcadores
    markers.forEach(marker => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map: mapInstance,
        title: marker.title,
      });

      if (marker.info) {
        const infoWindow = new google.maps.InfoWindow({
          content: marker.info,
        });

        mapMarker.addListener('click', () => {
          infoWindow.open(mapInstance, mapMarker);
        });
      }
    });
  };

  // Função para centralizar o mapa
  const centerMap = (position: { lat: number; lng: number }, zoom?: number) => {
    if (!mapInstance) return;
    
    mapInstance.setCenter(position);
    if (zoom) {
      mapInstance.setZoom(zoom);
    }
  };

  return {
    mapInstance,
    isLoaded,
    handleMapLoad,
    addMarkers,
    centerMap,
  };
};
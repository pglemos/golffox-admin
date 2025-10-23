import React, { useState, useEffect } from 'react';
// import { useGeocoding } from '../hooks/useGeocoding';
// import { GeocodingResult } from '@/src/services/maps/geocodingService';

// Tipos temporários
type GeocodingResult = any;
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Navigation,
  Copy,
  ExternalLink
} from 'lucide-react';

interface AddressValidatorProps {
  onAddressSelected?: (result: GeocodingResult) => void;
  initialAddress?: string;
  placeholder?: string;
  showMap?: boolean;
}

const AddressValidator: React.FC<AddressValidatorProps> = ({
  onAddressSelected,
  initialAddress = '',
  placeholder = 'Digite o endereço para validar...',
  showMap = true
}) => {
  const [inputAddress, setInputAddress] = useState(initialAddress);
  const [showResults, setShowResults] = useState(false);
  
  // const {
  //   results,
  //   validationResult,
  //   isLoading,
  //   error,
  //   selectedResult,
  //   geocodeAddress,
  //   validateAddress,
  //   reverseGeocode,
  //   clearResults,
  //   selectResult
  // } = useGeocoding();
  
  // Mock values temporários
  const results: any[] = [];
  const validationResult: any = null;
  const isLoading = false;
  const error = null;
  const selectedResult: any = null;
  const geocodeAddress = (address: string) => Promise.resolve();
  const validateAddress = (address: string) => Promise.resolve();
  const reverseGeocode = (lat: number, lng: number) => Promise.resolve();
  const clearResults = () => {};
  const selectResult = (result: any) => {};

  useEffect(() => {
    if (initialAddress) {
      setInputAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleSearch = async () => {
    if (!inputAddress.trim()) return;
    
    setShowResults(true);
    try {
      await validateAddress(inputAddress);
    } catch (error) {
      console.error('Erro ao validar endereço:', error);
    }
  };

  const handleResultSelect = (result: GeocodingResult) => {
    selectResult(result);
    onAddressSelected?.(result);
    setShowResults(false);
  };

  const handleReverseGeocode = async () => {
    // Simular obtenção da localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setShowResults(true);
          try {
            await reverseGeocode(latitude, longitude);
          } catch (error) {
            console.error('Erro na geocodificação reversa:', error);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Usar coordenadas de São Paulo como fallback
          reverseGeocode(-23.5505, -46.6333);
        }
      );
    } else {
      // Usar coordenadas de São Paulo como fallback
      await reverseGeocode(-23.5505, -46.6333);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-200';
    if (confidence >= 0.6) return 'text-amber-200';
    return 'text-rose-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.6) return 'Média';
    return 'Baixa';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exact':
        return <CheckCircle className="w-4 h-4 text-emerald-200" />;
      case 'approximate':
        return <AlertTriangle className="w-4 h-4 text-amber-200" />;
      case 'partial':
        return <XCircle className="w-4 h-4 text-rose-200" />;
      default:
        return <MapPin className="w-4 h-4 text-golffox-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Campo de entrada */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Endereço para Validação
        </label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-2.5 w-5 h-5 animate-spin text-white/70" />
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !inputAddress.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Validar</span>
          </button>
          <button
            onClick={handleReverseGeocode}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            title="Usar localização atual"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resultado da validação */}
      {validationResult && (
        <div className={`p-4 rounded-lg border ${
          validationResult.isValid 
            ? 'bg-emerald-500/15 border-green-200' 
            : 'bg-rose-500/15 border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-200" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-200" />
            )}
            <span className={`font-medium ${
              validationResult.isValid ? 'text-emerald-200' : 'text-red-800'
            }`}>
              {validationResult.isValid ? 'Endereço Válido' : 'Endereço Inválido'}
            </span>
          </div>

          {/* Erros */}
          {validationResult.errors.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-rose-200 mb-1">Erros:</p>
              <ul className="text-sm text-rose-200 space-y-1">
                {validationResult.errors.map((error: string, index: number) => (
                  <li key={index} className="flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avisos */}
          {validationResult.warnings.length > 0 && (
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">Avisos:</p>
              <ul className="text-sm text-amber-200 space-y-1">
                {validationResult.warnings.map((warning: string, index: number) => (
                  <li key={index} className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resultados da geocodificação */}
      {showResults && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Resultados Encontrados ({results.length})
            </h3>
            <button
              onClick={() => setShowResults(false)}
              className="text-golffox-muted/90 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedResult === result
                    ? 'border-blue-500 bg-sky-500/15'
                    : 'border-white/12 hover:border-white/15 hover:bg-white/10'
                }`}
                onClick={() => handleResultSelect(result)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(result.type)}
                      <span className="font-medium text-white">
                        {result.formattedAddress}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-golffox-muted">
                      <div>
                        <span className="font-medium">Coordenadas:</span>
                        <br />
                        {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">Confiança:</span>
                        <br />
                        <span className={getConfidenceColor(result.confidence)}>
                          {getConfidenceText(result.confidence)} ({Math.round(result.confidence * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* Componentes do endereço */}
                    {Object.keys(result.components).length > 0 && (
                      <div className="mt-3 p-2 bg-white/10 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(result.components).map(([key, value]: [string, any]) => (
                            value && (
                              <div key={key}>
                                <span className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                </span> {value}
                              </div>
                            )
                          )).filter(Boolean)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(result.formattedAddress);
                      }}
                      className="p-1 text-white/70 hover:text-golffox-muted"
                      title="Copiar endereço"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `https://maps.google.com/?q=${result.coordinates.lat},${result.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="p-1 text-white/70 hover:text-golffox-muted"
                      title="Abrir no Google Maps"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Endereço selecionado */}
      {selectedResult && !showResults && (
        <div className="p-4 bg-sky-500/15 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900">Endereço Selecionado</h4>
            <button
              onClick={clearResults}
              className="text-sky-200 hover:text-blue-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-blue-800">{selectedResult.formattedAddress}</p>
          <p className="text-sm text-sky-200 mt-1">
            {selectedResult.coordinates.lat.toFixed(6)}, {selectedResult.coordinates.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="p-4 bg-rose-500/15 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-rose-200" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressValidator;
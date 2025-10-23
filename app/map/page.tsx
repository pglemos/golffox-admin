'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Search,
  Filter,
  RefreshCw,
  Car,
  Users,
  Route,
  Settings,
  Maximize,
  Minimize,
  Eye,
  EyeOff
} from 'lucide-react'

// Tipos para os dados do mapa
interface Vehicle {
  id: string
  plate: string
  driver: string
  position: { lat: number; lng: number }
  status: 'active' | 'inactive' | 'maintenance'
  passengers: number
  route?: string
}

interface RoutePoint {
  id: string
  name: string
  position: { lat: number; lng: number }
  type: 'pickup' | 'dropoff' | 'waypoint'
  passengers?: number
}

interface MapFilters {
  showVehicles: boolean
  showRoutes: boolean
  showPassengers: boolean
  vehicleStatus: string[]
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const routesRef = useRef<google.maps.DirectionsRenderer[]>([])
  
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [filters, setFilters] = useState<MapFilters>({
    showVehicles: true,
    showRoutes: true,
    showPassengers: true,
    vehicleStatus: ['active', 'inactive']
  })

  // Dados mockados para demonstração
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'ABC-1234',
      driver: 'João Silva',
      position: { lat: -23.5505, lng: -46.6333 },
      status: 'active',
      passengers: 12,
      route: 'Rota Centro-Aeroporto'
    },
    {
      id: '2',
      plate: 'DEF-5678',
      driver: 'Maria Santos',
      position: { lat: -23.5615, lng: -46.6565 },
      status: 'active',
      passengers: 8,
      route: 'Rota Shopping-Universidade'
    },
    {
      id: '3',
      plate: 'GHI-9012',
      driver: 'Carlos Oliveira',
      position: { lat: -23.5329, lng: -46.6395 },
      status: 'maintenance',
      passengers: 0
    }
  ]

  const routePoints: RoutePoint[] = [
    { id: '1', name: 'Terminal Central', position: { lat: -23.5505, lng: -46.6333 }, type: 'pickup', passengers: 15 },
    { id: '2', name: 'Shopping Center', position: { lat: -23.5615, lng: -46.6565 }, type: 'waypoint', passengers: 8 },
    { id: '3', name: 'Aeroporto', position: { lat: -23.4356, lng: -46.4731 }, type: 'dropoff', passengers: 23 },
    { id: '4', name: 'Universidade', position: { lat: -23.5329, lng: -46.6395 }, type: 'pickup', passengers: 12 }
  ]

  // Inicializar Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || isMapLoaded) return

      if (typeof google === 'undefined' || !google.maps) {
        setTimeout(initMap, 100)
        return
      }

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: 'cooperative'
      })

      mapInstanceRef.current = map
      setIsMapLoaded(true)
    }

    // Carregar Google Maps API se não estiver carregada
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [isMapLoaded])

  // Atualizar marcadores quando filtros ou dados mudarem
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Adicionar marcadores de veículos
    if (filters.showVehicles) {
      vehicles
        .filter(vehicle => filters.vehicleStatus.includes(vehicle.status))
        .forEach(vehicle => {
          const marker = new google.maps.Marker({
            position: vehicle.position,
            map: mapInstanceRef.current,
            title: `${vehicle.plate} - ${vehicle.driver}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: vehicle.status === 'active' ? '#10B981' : 
                        vehicle.status === 'inactive' ? '#F59E0B' : '#EF4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 8
            }
          })

          marker.addListener('click', () => {
            setSelectedVehicle(vehicle)
          })

          markersRef.current.push(marker)
        })
    }

    // Adicionar marcadores de pontos de rota
    if (filters.showRoutes) {
      routePoints.forEach(point => {
        const marker = new google.maps.Marker({
          position: point.position,
          map: mapInstanceRef.current,
          title: point.name,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: point.type === 'pickup' ? '#3B82F6' : 
                      point.type === 'dropoff' ? '#EF4444' : '#8B5CF6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 6
          }
        })

        markersRef.current.push(marker)
      })
    }
  }, [isMapLoaded, filters])

  // Controles de zoom
  const zoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12
      mapInstanceRef.current.setZoom(currentZoom + 1)
    }
  }, [])

  const zoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12
      mapInstanceRef.current.setZoom(currentZoom - 1)
    }
  }, [])

  // Centralizar mapa
  const centerMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: -23.5505, lng: -46.6333 })
      mapInstanceRef.current.setZoom(12)
    }
  }, [])

  // Buscar localização
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return

    const geocoder = new google.maps.Geocoder()
    
    try {
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results)
          } else {
            reject(new Error('Localização não encontrada'))
          }
        })
      })

      if (result[0]) {
        const location = result[0].geometry.location
        mapInstanceRef.current.setCenter(location)
        mapInstanceRef.current.setZoom(15)

        // Adicionar marcador temporário
        const searchMarker = new google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          title: searchQuery,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
          }
        })

        // Remover marcador após 5 segundos
        setTimeout(() => {
          searchMarker.setMap(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
    }
  }, [searchQuery])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white/5' : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Mapa Interativo</h1>
            <p className="text-golffox-muted">Visualização em tempo real de veículos e rotas</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-200 border-green-200">
              {vehicles.filter(v => v.status === 'active').length} Veículos Ativos
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Controles */}
          <div className="lg:col-span-1 space-y-4">
            {/* Busca */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Buscar Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite um endereço..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                  />
                  <Button size="sm" onClick={searchLocation}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Controles de Navegação */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom +
                  </Button>
                  <Button variant="outline" size="sm" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom -
                  </Button>
                  <Button variant="outline" size="sm" onClick={centerMap} className="col-span-2">
                    <Navigation className="h-4 w-4 mr-1" />
                    Centralizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showVehicles}
                      onChange={(e) => setFilters(prev => ({ ...prev, showVehicles: e.target.checked }))}
                      className="rounded"
                    />
                    <Car className="h-4 w-4" />
                    <span className="text-sm">Veículos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showRoutes}
                      onChange={(e) => setFilters(prev => ({ ...prev, showRoutes: e.target.checked }))}
                      className="rounded"
                    />
                    <Route className="h-4 w-4" />
                    <span className="text-sm">Pontos de Rota</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showPassengers}
                      onChange={(e) => setFilters(prev => ({ ...prev, showPassengers: e.target.checked }))}
                      className="rounded"
                    />
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Passageiros</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Veículo Selecionado */}
            {selectedVehicle && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Veículo Selecionado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold">{selectedVehicle.plate}</p>
                    <p className="text-sm text-golffox-muted">{selectedVehicle.driver}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge 
                      variant={selectedVehicle.status === 'active' ? 'default' : 'secondary'}
                      className={
                        selectedVehicle.status === 'active' ? 'bg-emerald-500/20 text-emerald-200' :
                        selectedVehicle.status === 'inactive' ? 'bg-amber-500/20 text-yellow-800' :
                        'bg-rose-500/20 text-red-800'
                      }
                    >
                      {selectedVehicle.status === 'active' ? 'Ativo' :
                       selectedVehicle.status === 'inactive' ? 'Inativo' : 'Manutenção'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Passageiros:</span>
                    <span className="font-semibold">{selectedVehicle.passengers}</span>
                  </div>
                  {selectedVehicle.route && (
                    <div>
                      <span className="text-sm">Rota:</span>
                      <p className="text-sm font-medium">{selectedVehicle.route}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mapa */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] lg:h-[700px]">
              <CardContent className="p-0 h-full">
                <div
                  ref={mapRef}
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: '400px' }}
                />
                {!isMapLoaded && (
                  <div className="absolute inset-0 bg-white/5/5 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-sky-200" />
                      <p className="text-golffox-muted">Carregando mapa...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="text-sm text-golffox-muted">Veículos Ativos</p>
                    <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-sky-200" />
                  <div>
                    <p className="text-sm text-golffox-muted">Passageiros</p>
                    <p className="text-xl font-bold">{vehicles.reduce((acc, v) => acc + v.passengers, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Route className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-golffox-muted">Pontos de Rota</p>
                    <p className="text-xl font-bold">{routePoints.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-rose-200" />
                  <div>
                    <p className="text-sm text-golffox-muted">Área Coberta</p>
                    <p className="text-xl font-bold">São Paulo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
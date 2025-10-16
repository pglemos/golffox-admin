import { geocodingService } from '../src/services/geocodingService';
import { generateReport } from '../src/services/ai/geminiService';

export interface OptimizedRoute {
  id: string;
  waypoints: RouteWaypoint[];
  optimizedOrder: number[];
  totalDistance: number;
  totalDuration: number;
  estimatedFuelCost: number;
  savings: {
    distance: number;
    time: number;
    fuel: number;
    percentage: number;
  };
}

export interface RouteWaypoint {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'pickup' | 'dropoff' | 'waypoint';
  priority?: number;
  timeWindow?: {
    start: string;
    end: string;
  };
  passenger?: {
    id: string;
    name: string;
    phone?: string;
  };
}

export interface DynamicMarker {
  id: string;
  position: { lat: number; lng: number };
  type: 'vehicle' | 'passenger' | 'pickup' | 'dropoff' | 'depot';
  status: 'active' | 'inactive' | 'waiting' | 'completed';
  data: {
        title: string;
        description?: string;
        icon?: string;
        color?: string;
        animation?: google.maps.Animation | null;
      };
  onClick?: () => void;
}

export interface MapCluster {
  id: string;
  center: { lat: number; lng: number };
  markers: DynamicMarker[];
  count: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class OptimizedMapsService {
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private markerClusterer: any = null;
  private activeMarkers: Map<string, google.maps.Marker> = new Map();
  private routeCache: Map<string, OptimizedRoute> = new Map();

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    if (typeof google !== 'undefined' && google.maps) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // Usaremos markers customizados
        polylineOptions: {
          strokeColor: '#FF5F00',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
    }
  }

  /**
   * Otimizar rota usando algoritmo inteligente
   */
  async optimizeRoute(waypoints: RouteWaypoint[]): Promise<OptimizedRoute> {
    const cacheKey = this.generateCacheKey(waypoints);
    
    // Verificar cache primeiro
    if (this.routeCache.has(cacheKey)) {
      return this.routeCache.get(cacheKey)!;
    }

    try {
      // Usar IA para otimização inicial
      const aiOptimization = await this.optimizeWithAI(waypoints);
      
      // Validar com Google Directions API
      const validatedRoute = await this.validateRouteWithGoogle(waypoints, aiOptimization.optimizedOrder);
      
      // Calcular métricas
      const optimizedRoute: OptimizedRoute = {
        id: `route_${Date.now()}`,
        waypoints,
        optimizedOrder: validatedRoute.optimizedOrder,
        totalDistance: validatedRoute.totalDistance,
        totalDuration: validatedRoute.totalDuration,
        estimatedFuelCost: this.calculateFuelCost(validatedRoute.totalDistance),
        savings: this.calculateSavings(waypoints, validatedRoute),
      };

      // Cachear resultado
      this.routeCache.set(cacheKey, optimizedRoute);
      
      return optimizedRoute;
    } catch (error) {
      console.error('Erro ao otimizar rota:', error);
      
      // Fallback: usar ordem original
      return this.createFallbackRoute(waypoints);
    }
  }

  /**
   * Otimizar usando IA (Gemini)
   */
  private async optimizeWithAI(waypoints: RouteWaypoint[]) {
    const routeData = {
      waypoints: waypoints.map(wp => ({
        id: wp.id,
        address: wp.address,
        coordinates: wp.coordinates,
        type: wp.type,
        priority: wp.priority || 1,
        timeWindow: wp.timeWindow,
      })),
      constraints: {
        maxDistance: 200, // km
        maxDuration: 480, // 8 horas
        vehicleCapacity: 50, // passageiros
      },
    };

    try {
      const prompt = `Otimize a seguinte rota de transporte considerando as restrições fornecidas. Retorne um JSON com optimizedOrder (array de índices), estimatedDistance (número), estimatedTime (número em minutos), savings (porcentagem) e reasoning (string explicativa).`;
      const response = await generateReport(prompt, routeData);
      
      const result = JSON.parse(response);
      return {
        optimizedOrder: result.optimizedOrder || waypoints.map((_, i) => i),
        estimatedDistance: parseFloat(result.estimatedDistance) || 0,
        estimatedTime: parseInt(result.estimatedTime) || 0,
        savings: parseFloat(result.savings) || 0,
        reasoning: result.reasoning || 'Otimização por IA',
      };
    } catch (error) {
      console.warn('Erro ao otimizar rota com IA:', error);
      return { optimizedOrder: waypoints.map((_, i) => i) };
    }
  }

  /**
   * Validar rota otimizada com Google Directions API
   */
  private async validateRouteWithGoogle(
    waypoints: RouteWaypoint[], 
    optimizedOrder: number[]
  ): Promise<{
    optimizedOrder: number[];
    totalDistance: number;
    totalDuration: number;
  }> {
    if (!this.directionsService) {
      throw new Error('Google Directions Service não inicializado');
    }

    const orderedWaypoints = optimizedOrder.map(index => waypoints[index]);
    
    if (orderedWaypoints.length < 2) {
      return {
        optimizedOrder,
        totalDistance: 0,
        totalDuration: 0,
      };
    }

    const origin = orderedWaypoints[0].coordinates;
    const destination = orderedWaypoints[orderedWaypoints.length - 1].coordinates;
    const waypointsForGoogle = orderedWaypoints.slice(1, -1).map(wp => ({
      location: wp.coordinates,
      stopover: true,
    }));

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          waypoints: waypointsForGoogle,
          optimizeWaypoints: false, // Já otimizamos com IA
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            let totalDistance = 0;
            let totalDuration = 0;

            route.legs.forEach(leg => {
              totalDistance += leg.distance?.value || 0;
              totalDuration += leg.duration?.value || 0;
            });

            resolve({
              optimizedOrder,
              totalDistance: totalDistance / 1000, // converter para km
              totalDuration: totalDuration / 60, // converter para minutos
            });
          } else {
            reject(new Error(`Erro no Google Directions: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Renderizar rota otimizada no mapa
   */
  async renderOptimizedRoute(
    map: google.maps.Map, 
    optimizedRoute: OptimizedRoute
  ): Promise<void> {
    if (!this.directionsRenderer) {
      throw new Error('Directions Renderer não inicializado');
    }

    // Limpar rota anterior
    this.directionsRenderer.setMap(null);
    
    // Configurar nova rota
    this.directionsRenderer.setMap(map);
    
    const orderedWaypoints = optimizedRoute.optimizedOrder.map(
      index => optimizedRoute.waypoints[index]
    );

    if (orderedWaypoints.length < 2) return;

    const origin = orderedWaypoints[0].coordinates;
    const destination = orderedWaypoints[orderedWaypoints.length - 1].coordinates;
    const waypoints = orderedWaypoints.slice(1, -1).map(wp => ({
      location: wp.coordinates,
      stopover: true,
    }));

    if (!this.directionsService) return;

    this.directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          this.directionsRenderer!.setDirections(result);
          
          // Adicionar markers customizados
          this.addCustomMarkers(map, orderedWaypoints);
        }
      }
    );
  }

  /**
   * Adicionar markers dinâmicos customizados
   */
  private addCustomMarkers(map: google.maps.Map, waypoints: RouteWaypoint[]): void {
    // Limpar markers anteriores
    this.clearMarkers();

    waypoints.forEach((waypoint, index) => {
      const marker = new google.maps.Marker({
        position: waypoint.coordinates,
        map,
        title: waypoint.address,
        icon: this.getMarkerIcon(waypoint.type, index),
        animation: index === 0 ? google.maps.Animation.BOUNCE : null,
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(waypoint, index),
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      this.activeMarkers.set(waypoint.id, marker);
    });
  }

  /**
   * Criar markers dinâmicos com clustering
   */
  async createDynamicMarkers(
    map: google.maps.Map,
    markers: DynamicMarker[]
  ): Promise<void> {
    // Limpar markers anteriores
    this.clearMarkers();

    // Criar clusters se necessário
    const clusters = this.shouldCluster(markers) 
      ? this.createClusters(markers)
      : null;

    if (clusters) {
      this.renderClusters(map, clusters);
    } else {
      this.renderIndividualMarkers(map, markers);
    }
  }

  /**
   * Determinar se deve usar clustering
   */
  private shouldCluster(markers: DynamicMarker[]): boolean {
    return markers.length > 20;
  }

  /**
   * Criar clusters de markers
   */
  private createClusters(markers: DynamicMarker[]): MapCluster[] {
    // Algoritmo simples de clustering por proximidade
    const clusters: MapCluster[] = [];
    const processed = new Set<string>();
    const clusterRadius = 0.01; // ~1km

    markers.forEach(marker => {
      if (processed.has(marker.id)) return;

      const cluster: MapCluster = {
        id: `cluster_${clusters.length}`,
        center: marker.position,
        markers: [marker],
        count: 1,
        bounds: {
          north: marker.position.lat,
          south: marker.position.lat,
          east: marker.position.lng,
          west: marker.position.lng,
        },
      };

      processed.add(marker.id);

      // Encontrar markers próximos
      markers.forEach(otherMarker => {
        if (processed.has(otherMarker.id)) return;

        const distance = this.calculateDistance(
          marker.position,
          otherMarker.position
        );

        if (distance <= clusterRadius) {
          cluster.markers.push(otherMarker);
          cluster.count++;
          processed.add(otherMarker.id);

          // Atualizar bounds
          cluster.bounds.north = Math.max(cluster.bounds.north, otherMarker.position.lat);
          cluster.bounds.south = Math.min(cluster.bounds.south, otherMarker.position.lat);
          cluster.bounds.east = Math.max(cluster.bounds.east, otherMarker.position.lng);
          cluster.bounds.west = Math.min(cluster.bounds.west, otherMarker.position.lng);
        }
      });

      // Recalcular centro do cluster
      const avgLat = cluster.markers.reduce((sum, m) => sum + m.position.lat, 0) / cluster.markers.length;
      const avgLng = cluster.markers.reduce((sum, m) => sum + m.position.lng, 0) / cluster.markers.length;
      cluster.center = { lat: avgLat, lng: avgLng };

      clusters.push(cluster);
    });

    return clusters;
  }

  /**
   * Renderizar clusters no mapa
   */
  private renderClusters(map: google.maps.Map, clusters: MapCluster[]): void {
    clusters.forEach(cluster => {
      if (cluster.count === 1) {
        // Renderizar marker individual
        this.renderIndividualMarkers(map, cluster.markers);
      } else {
        // Renderizar cluster
        const clusterMarker = new google.maps.Marker({
          position: cluster.center,
          map,
          icon: {
            url: this.createClusterIcon(cluster.count),
            scaledSize: new google.maps.Size(40, 40),
          },
          title: `${cluster.count} itens`,
        });

        // Expandir cluster ao clicar
        clusterMarker.addListener('click', () => {
          map.fitBounds(new google.maps.LatLngBounds(
            { lat: cluster.bounds.south, lng: cluster.bounds.west },
            { lat: cluster.bounds.north, lng: cluster.bounds.east }
          ));
          
          // Renderizar markers individuais
          setTimeout(() => {
            clusterMarker.setMap(null);
            this.renderIndividualMarkers(map, cluster.markers);
          }, 300);
        });

        this.activeMarkers.set(cluster.id, clusterMarker);
      }
    });
  }

  /**
   * Renderizar markers individuais
   */
  private renderIndividualMarkers(map: google.maps.Map, markers: DynamicMarker[]): void {
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.data.title,
        icon: this.getDynamicMarkerIcon(markerData),
        animation: markerData.data.animation || null,
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createDynamicInfoWindow(markerData),
      });

      marker.addListener('click', () => {
        if (markerData.onClick) {
          markerData.onClick();
        } else {
          infoWindow.open(map, marker);
        }
      });

      this.activeMarkers.set(markerData.id, marker);
    });
  }

  /**
   * Utilitários
   */
  private generateCacheKey(waypoints: RouteWaypoint[]): string {
    const coordinates = waypoints.map(wp => `${wp.coordinates.lat},${wp.coordinates.lng}`);
    return `route_${coordinates.join('|')}`;
  }

  private calculateFuelCost(distanceKm: number): number {
    const fuelConsumption = 8; // km/l
    const fuelPrice = 5.50; // R$/l
    return (distanceKm / fuelConsumption) * fuelPrice;
  }

  private calculateSavings(
    originalWaypoints: RouteWaypoint[], 
    optimizedRoute: { totalDistance: number; totalDuration: number }
  ) {
    // Estimar rota original (ordem sequencial)
    const originalDistance = this.estimateOriginalDistance(originalWaypoints);
    const originalDuration = originalDistance * 2; // Estimativa simples

    const distanceSaving = Math.max(0, originalDistance - optimizedRoute.totalDistance);
    const timeSaving = Math.max(0, originalDuration - optimizedRoute.totalDuration);
    const fuelSaving = this.calculateFuelCost(distanceSaving);
    const percentage = originalDistance > 0 ? (distanceSaving / originalDistance) * 100 : 0;

    return {
      distance: distanceSaving,
      time: timeSaving,
      fuel: fuelSaving,
      percentage,
    };
  }

  private estimateOriginalDistance(waypoints: RouteWaypoint[]): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(
        waypoints[i].coordinates,
        waypoints[i + 1].coordinates
      );
    }
    return totalDistance * 111; // Converter graus para km (aproximado)
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private createFallbackRoute(waypoints: RouteWaypoint[]): OptimizedRoute {
    return {
      id: `fallback_${Date.now()}`,
      waypoints,
      optimizedOrder: waypoints.map((_, i) => i),
      totalDistance: this.estimateOriginalDistance(waypoints),
      totalDuration: this.estimateOriginalDistance(waypoints) * 2,
      estimatedFuelCost: this.calculateFuelCost(this.estimateOriginalDistance(waypoints)),
      savings: { distance: 0, time: 0, fuel: 0, percentage: 0 },
    };
  }

  private getMarkerIcon(type: string, index: number): google.maps.Icon {
    const colors = {
      pickup: '#4CAF50',
      dropoff: '#F44336',
      waypoint: '#FF9800',
    };

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="${colors[type as keyof typeof colors] || '#2196F3'}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${index + 1}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16),
    };
  }

  private getDynamicMarkerIcon(marker: DynamicMarker): google.maps.Icon {
    const iconMap = {
      vehicle: '🚌',
      passenger: '👤',
      pickup: '📍',
      dropoff: '🏁',
      depot: '🏢',
    };

    const statusColors = {
      active: '#4CAF50',
      inactive: '#9E9E9E',
      waiting: '#FF9800',
      completed: '#2196F3',
    };

    const icon = iconMap[marker.type] || '📍';
    const color = marker.data.color || statusColors[marker.status];

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" font-size="16">${icon}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16),
    };
  }

  private createClusterIcon(count: number): string {
    const size = Math.min(50, 30 + count * 2);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#FF5F00" stroke="white" stroke-width="2"/>
        <text x="${size/2}" y="${size/2 + 4}" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${count}</text>
      </svg>
    `)}`;
  }

  private createInfoWindowContent(waypoint: RouteWaypoint, index: number): string {
    return `
      <div style="max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #FF5F00;">Parada ${index + 1}</h3>
        <p style="margin: 4px 0;"><strong>Endereço:</strong> ${waypoint.address}</p>
        <p style="margin: 4px 0;"><strong>Tipo:</strong> ${waypoint.type}</p>
        ${waypoint.passenger ? `
          <p style="margin: 4px 0;"><strong>Passageiro:</strong> ${waypoint.passenger.name}</p>
          ${waypoint.passenger.phone ? `<p style="margin: 4px 0;"><strong>Telefone:</strong> ${waypoint.passenger.phone}</p>` : ''}
        ` : ''}
        ${waypoint.timeWindow ? `
          <p style="margin: 4px 0;"><strong>Horário:</strong> ${waypoint.timeWindow.start} - ${waypoint.timeWindow.end}</p>
        ` : ''}
      </div>
    `;
  }

  private createDynamicInfoWindow(marker: DynamicMarker): string {
    return `
      <div style="max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #FF5F00;">${marker.data.title}</h3>
        ${marker.data.description ? `<p style="margin: 4px 0;">${marker.data.description}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Tipo:</strong> ${marker.type}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> ${marker.status}</p>
      </div>
    `;
  }

  private clearMarkers(): void {
    this.activeMarkers.forEach(marker => marker.setMap(null));
    this.activeMarkers.clear();
  }

  /**
   * Limpar cache de rotas
   */
  clearRouteCache(): void {
    this.routeCache.clear();
  }

  /**
   * Obter estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.routeCache.size,
      keys: Array.from(this.routeCache.keys()),
    };
  }
}

// Instância singleton
export const optimizedMapsService = new OptimizedMapsService();
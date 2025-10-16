import type { Passenger, Company } from '../../types/types';

export interface OptimizedRoute {
    waypoints: google.maps.LatLng[];
    orderedPassengers: Passenger[];
    totalDistance: number;
    totalDuration: number;
    polylinePath: google.maps.LatLng[];
    pickupTimes?: { passenger: Passenger; estimatedPickupTime: Date }[];
}

export interface RouteOptimizationOptions {
    startLocation: google.maps.LatLng;
    passengers: Passenger[];
    destination: google.maps.LatLng;
    optimizeOrder?: boolean;
}

export interface RouteCalculationError extends Error {
    code: 'GOOGLE_MAPS_NOT_LOADED' | 'INVALID_COORDINATES' | 'NO_PASSENGERS' | 'DIRECTIONS_API_ERROR' | 'UNKNOWN_ERROR' | 'SSR_ENVIRONMENT';
    details?: string;
}

export class RouteOptimizationService {
    private directionsService: google.maps.DirectionsService | null = null;
    private distanceCache = new Map<string, number>();
    private routeCache = new Map<string, OptimizedRoute>();
    private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

    constructor() {
        this.initializeService();
        // Limpa cache periodicamente
        setInterval(() => this.clearExpiredCache(), 60000); // A cada minuto
    }

    private clearExpiredCache(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];
        this.routeCache.forEach((value, key) => {
            if (now - (value as any).timestamp > this.CACHE_EXPIRY) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.routeCache.delete(key));
    }

    private getCacheKey(options: RouteOptimizationOptions): string {
        const { startLocation, passengers, destination, optimizeOrder } = options;
        const startKey = `${startLocation.lat()},${startLocation.lng()}`;
        const destKey = `${destination.lat()},${destination.lng()}`;
        const passengersKey = passengers
            .map(p => `${p.id}-${p.position.lat},${p.position.lng}`)
            .sort()
            .join('|');
        return `${startKey}-${destKey}-${passengersKey}-${optimizeOrder}`;
    }

    async optimizeRoute(options: RouteOptimizationOptions): Promise<OptimizedRoute> {
        // Implementation placeholder
        return {
            waypoints: [],
            orderedPassengers: options.passengers,
            totalDistance: 0,
            totalDuration: 0,
            polylinePath: [],
            pickupTimes: []
        };
    }

    private async initializeService(): Promise<void> {
        // Service initialization
    }

    generateOptimizationSuggestion(passengerCount: number): string {
        if (passengerCount > 10) {
            return 'Considere dividir esta rota em múltiplas rotas menores para melhor eficiência.';
        } else if (passengerCount > 5) {
            return 'Esta rota pode se beneficiar de otimização para reduzir tempo de viagem.';
        } else {
            return 'Rota com poucos passageiros - considere consolidar com outras rotas.';
        }
    }

    validateAddress(address: string, coordinates: { lat: number; lng: number }): boolean {
        // Validação básica de endereço
        if (!address || address.trim().length < 5) {
            return false;
        }
        
        // Validação de coordenadas
        if (!coordinates || 
            typeof coordinates.lat !== 'number' || 
            typeof coordinates.lng !== 'number' ||
            isNaN(coordinates.lat) || 
            isNaN(coordinates.lng)) {
            return false;
        }
        
        // Verifica se as coordenadas estão em uma faixa válida
        if (coordinates.lat < -90 || coordinates.lat > 90 ||
            coordinates.lng < -180 || coordinates.lng > 180) {
            return false;
        }
        
        return true;
    }
}

export const routeOptimizationService = new RouteOptimizationService();
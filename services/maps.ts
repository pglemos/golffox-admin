// Serviço para integração com a API do Google Maps

export type Coordinates = {
  lat: number;
  lng: number;
};

export type RouteInfo = {
  distance: number; // em km
  duration: number; // em minutos
  start_address: string;
  end_address: string;
  start_location: Coordinates;
  end_location: Coordinates;
  polyline: string; // encoded polyline string
};

// Verificar se a chave da API do Google Maps está configurada
export const isGoogleMapsApiKeyConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return apiKey !== undefined && apiKey !== null && apiKey !== '';
};

// Obter mensagem de erro para chave de API não configurada
export const getApiKeyErrorMessage = (): string => {
  return 'A chave da API do Google Maps não está configurada. Por favor, configure a variável de ambiente NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.';
};

// Geocodificação: Converter endereço em coordenadas
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    // Verificar se a chave da API está configurada
    if (!isGoogleMapsApiKeyConfigured()) {
      console.error(getApiKeyErrorMessage());
      return null;
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Geocodificação reversa: Converter coordenadas em endereço
export const reverseGeocode = async (coords: Coordinates): Promise<string | null> => {
  try {
    // Verificar se a chave da API está configurada
    if (!isGoogleMapsApiKeyConfigured()) {
      console.error(getApiKeyErrorMessage());
      return null;
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

// Calcular rota entre dois pontos
export const calculateRoute = async (
  origin: Coordinates | string,
  destination: Coordinates | string
): Promise<RouteInfo | null> => {
  try {
    // Verificar se a chave da API está configurada
    if (!isGoogleMapsApiKeyConfigured()) {
      console.error(getApiKeyErrorMessage());
      return null;
    }
    
    // Converter origem e destino para string se forem coordenadas
    const originStr = typeof origin === 'string' 
      ? origin 
      : `${origin.lat},${origin.lng}`;
    
    const destinationStr = typeof destination === 'string' 
      ? destination 
      : `${destination.lat},${destination.lng}`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originStr
      )}&destination=${encodeURIComponent(
        destinationStr
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.value / 1000, // Converter metros para km
        duration: Math.ceil(leg.duration.value / 60), // Converter segundos para minutos
        start_address: leg.start_address,
        end_address: leg.end_address,
        start_location: leg.start_location,
        end_location: leg.end_location,
        polyline: route.overview_polyline.points,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
};

// Estimar preço da viagem com base na distância
export const estimatePrice = (distance: number): number => {
  // Cálculo de preço baseado na distância (já em km)
  const baseFare = 5.0; // Taxa base em reais
  const ratePerKm = 2.5; // Taxa por km em reais
  
  const estimatedPrice = baseFare + distance * ratePerKm;
  
  // Arredonda para 2 casas decimais para evitar problemas com valores monetários
  return Number(estimatedPrice.toFixed(2));
};
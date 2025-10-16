// Temporary react-query configuration
export const queryKeys = {
  maps: {
    route: (waypoints: string, type: string) => ['maps', 'route', waypoints, type],
    markers: (mapId: string) => ['maps', 'markers', mapId],
    optimization: (routeId: string) => ['maps', 'optimization', routeId]
  },
  vehicles: {
    all: () => ['vehicles'],
    tracking: (vehicleId: string) => ['vehicles', 'tracking', vehicleId]
  }
};

export const queryOptions = {
  maps: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  },
  vehicles: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000 // 30 seconds
  }
};
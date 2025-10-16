import { cache } from 'react';
import { createSupabaseAdminClient } from '@lib/supabase/server-client';
import { logger } from '@lib/logging/logger';
import type { DashboardOverview } from '../types';

async function count(table: string, filter?: (query: ReturnType<ReturnType<typeof createSupabaseAdminClient>['from']>) => unknown) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from(table).select('*', { count: 'exact', head: true });

  if (filter) {
    const result = filter(query);
    if (result) {
      query = result as typeof query;
    }
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export const getDashboardOverview = cache(async (): Promise<DashboardOverview> => {
  try {
    const [totalVehicles, totalDrivers, totalPassengers, activeRoutes] = await Promise.all([
      count('vehicles'),
      count('drivers'),
      count('passengers'),
      count('routes', query => query.eq('status', 'in_progress')),
    ]);

    return {
      totalVehicles,
      totalDrivers,
      totalPassengers,
      activeRoutes,
    };
  } catch (error) {
    logger.error('Falha ao carregar overview do dashboard', { error });
    return {
      totalVehicles: 0,
      totalDrivers: 0,
      totalPassengers: 0,
      activeRoutes: 0,
    };
  }
});

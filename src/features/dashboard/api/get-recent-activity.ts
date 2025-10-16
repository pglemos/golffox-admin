import { cache } from 'react';
import { createSupabaseAdminClient } from '@lib/supabase/server-client';
import { logger } from '@lib/logging/logger';
import type { DashboardRecentActivityItem } from '../types';

export const getRecentActivity = cache(async (): Promise<DashboardRecentActivityItem[]> => {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('routes')
      .select(
        `
          id,
          name,
          status,
          company_id,
          driver_id,
          vehicle_id,
          scheduled_at,
          created_at,
          driver:drivers!routes_driver_id_fkey (
            id,
            name,
            company_id,
            user_id,
            created_at
          ),
          vehicle:vehicles!routes_vehicle_id_fkey (
            id,
            model,
            plate,
            status,
            company_id,
            created_at
          )
        `,
      )
      .order('scheduled_at', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(route => ({
      id: route.id,
      route: {
        id: route.id,
        name: route.name,
        status: route.status,
        company_id: route.company_id,
        driver_id: route.driver_id,
        vehicle_id: route.vehicle_id,
        scheduled_at: route.scheduled_at,
        created_at: route.created_at,
      },
      driver: route.driver
        ? {
            id: route.driver.id,
            name: route.driver.name,
            company_id: route.driver.company_id,
            user_id: route.driver.user_id,
            created_at: route.driver.created_at,
          }
        : null,
      vehicle: route.vehicle
        ? {
            id: route.vehicle.id,
            model: route.vehicle.model,
            plate: route.vehicle.plate,
            status: route.vehicle.status,
            company_id: route.vehicle.company_id,
            created_at: route.vehicle.created_at,
          }
        : null,
      status: route.status,
      scheduledAt: route.scheduled_at,
    }));
  } catch (error) {
    logger.error('Falha ao carregar atividades recentes', { error });
    return [];
  }
});

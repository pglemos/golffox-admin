import type { SupabaseDriverRow, SupabaseRouteRow, SupabaseVehicleRow } from '@lib/supabase/types';

export interface DashboardOverview {
  totalVehicles: number;
  totalDrivers: number;
  totalPassengers: number;
  activeRoutes: number;
}

export interface DashboardRecentActivityItem {
  id: string;
  route: SupabaseRouteRow;
  driver: SupabaseDriverRow | null;
  vehicle: SupabaseVehicleRow | null;
  status: SupabaseRouteRow['status'];
  scheduledAt: string;
}

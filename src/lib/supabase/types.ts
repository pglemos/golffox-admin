export type UserRole = 'admin' | 'operator' | 'driver' | 'passenger';

export interface SupabaseUserRow {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  company_id: string | null;
  avatar_url: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseDriverRow {
  id: string;
  user_id: string | null;
  name: string;
  company_id: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseVehicleRow {
  id: string;
  model: string;
  plate: string;
  status: 'active' | 'maintenance' | 'inactive';
  company_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseRouteRow {
  id: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  company_id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  scheduled_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabasePassengerRow {
  id: string;
  name: string;
  email: string | null;
  user_id: string | null;
  company_id: string | null;
  route_id: string | null;
  created_at?: string;
  updated_at?: string;
}

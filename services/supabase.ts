import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'driver' | 'passenger' | 'carrier';
  company_id?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  model: string;
  plate: string;
  year?: number;
  color?: string;
  capacity?: number;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type Route = {
  id: string;
  company_id: string;
  driver_id: string;
  vehicle_id: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  origin_coords?: any;
  destination_coords?: any;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  distance?: number;
  estimated_duration?: number;
  created_at: string;
  updated_at: string;
};

// Funções auxiliares para interagir com o Supabase

// Users
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as User;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
};

// Vehicles
export const getVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Vehicle[];
};

export const getVehicle = async (id: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Vehicle;
};

export const createVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicle)
    .select()
    .single();
  
  if (error) throw error;
  return data as Vehicle;
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Vehicle;
};

// Routes
export const getRoutes = async () => {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      driver:users!driver_id(*),
      vehicle:vehicles(*),
      company:companies(*)
    `)
    .order('scheduled_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getRoute = async (id: string) => {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      driver:users!driver_id(*),
      vehicle:vehicles(*),
      company:companies(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createRoute = async (route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('routes')
    .insert(route)
    .select()
    .single();
  
  if (error) throw error;
  return data as Route;
};

export const updateRoute = async (id: string, updates: Partial<Route>) => {
  const { data, error } = await supabase
    .from('routes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Route;
};

// Route Passengers
export const getRoutePassengers = async (routeId: string) => {
  const { data, error } = await supabase
    .from('route_passengers')
    .select(`
      *,
      passenger:users!passenger_id(*)
    `)
    .eq('route_id', routeId);
  
  if (error) throw error;
  return data;
};

export const addPassengerToRoute = async (routeId: string, passengerId: string) => {
  const { data, error } = await supabase
    .from('route_passengers')
    .insert({
      route_id: routeId,
      passenger_id: passengerId
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
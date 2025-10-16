// Base service
export { BaseCrudService } from './baseCrudService'
export type { CrudResponse, CrudListResponse, PaginationOptions, FilterOptions, SortOptions } from './baseCrudService'

// Authentication service
export { AuthService, authService } from '../auth/authService'
export type { 
  UserRow, 
  UserInsert, 
  UserUpdate, 
  UserRole, 
  CompanyStatus,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetData,
  PasswordUpdateData
} from '../auth/authService'

// Companies service
export { CompaniesService, companiesService } from '../transportadora/companiesService'
export type { 
  CompanyRow, 
  CompanyInsert, 
  CompanyUpdate,
  CompanyWithStats,
  CompanyFilters
} from '../transportadora/companiesService'

// Drivers service
export { DriversService, driversService } from '../drivers/driversService'
export type { 
  DriverRow, 
  DriverInsert, 
  DriverUpdate,
  DriverWithVehicle,
  DriverFilters
} from '../drivers/driversService'

// Vehicles service
export { VehiclesService, vehiclesService } from '../vehicles/vehiclesService'
export type { 
  VehicleRow, 
  VehicleInsert, 
  VehicleUpdate,
  VehicleWithDriver,
  VehicleFilters
} from '../vehicles/vehiclesService'

// Routes service
export { RoutesService, routesService } from '../transportadora/routesService'
export type { 
  RouteRow, 
  RouteInsert, 
  RouteUpdate,
  RouteWithDetails,
  RouteFilters
} from '../transportadora/routesService'

// Centralized services object for easy access - Temporariamente comentado para debug
/*
export const services = {
  auth: authService,
  companies: companiesService,
  drivers: driversService,
  vehicles: vehiclesService,
  passengers: passengersService,
  routes: routesService,
  alerts: alertsService,
}

// Service types for type safety
export type ServiceType = keyof typeof services
*/
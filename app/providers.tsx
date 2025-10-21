'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
// import GoogleMapsLoader from '@/components/GoogleMapsLoader'
// import type { Route as RouteType, Company, Employee, PermissionProfile } from '../types'
// import { MOCK_ROUTES, MOCK_COMPANIES, MOCK_EMPLOYEES, MOCK_PERMISSION_PROFILES } from '../constants'

// Tipos temporários
type RouteType = any
type Company = any
type Employee = any
type PermissionProfile = any

// Mock data temporário
const MOCK_ROUTES: RouteType[] = []
const MOCK_COMPANIES: Company[] = []
const MOCK_EMPLOYEES: Employee[] = []
const MOCK_PERMISSION_PROFILES: PermissionProfile[] = []
import { AuthProvider } from './hooks/useAuth'

interface AppContextType {
  routes: RouteType[]
  setRoutes: React.Dispatch<React.SetStateAction<RouteType[]>>
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  permissionProfiles: PermissionProfile[]
  setPermissionProfiles: React.Dispatch<React.SetStateAction<PermissionProfile[]>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext deve ser utilizado dentro de um AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [routes, setRoutes] = useState<RouteType[]>(MOCK_ROUTES)
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES)
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(MOCK_PERMISSION_PROFILES)

  const value = {
    routes,
    setRoutes,
    companies,
    setCompanies,
    employees,
    setEmployees,
    permissionProfiles,
    setPermissionProfiles,
  }

  return (
    <AuthProvider>
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    </AuthProvider>
  )
}
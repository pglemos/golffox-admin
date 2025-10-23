import React, { useState } from 'react'
import ManagementPanel from '../views/ManagementPanel'
import AppSelector from './AppSelector'

type AppView = string

type Route = any
type Company = any
type Employee = any
type PermissionProfile = any

const APP_VIEWS = { MANAGEMENT: 'management' }
const MOCK_ROUTES: Route[] = []
const MOCK_COMPANIES: Company[] = []
const MOCK_EMPLOYEES: Employee[] = []
const MOCK_PERMISSION_PROFILES: PermissionProfile[] = []

const AdminPanel: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(APP_VIEWS.MANAGEMENT)
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES)
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES)
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(MOCK_PERMISSION_PROFILES)

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-25%] h-[45vh] bg-[radial-gradient(circle,_rgba(108,99,255,0.35),_transparent_75%)] blur-[120px]" />
        <div className="absolute right-[-20%] top-[35%] h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(0,212,255,0.28),_transparent_68%)] blur-[130px]" />
        <div className="absolute bottom-[-30%] left-[-18%] h-[50vh] w-[45vw] rounded-full bg-[radial-gradient(circle,_rgba(255,71,87,0.22),_transparent_70%)] blur-[140px]" />
      </div>
      <AppSelector currentView={currentView} setCurrentView={setCurrentView} />
      <div className="relative flex-1 overflow-hidden">
        <ManagementPanel
          routes={routes}
          setRoutes={setRoutes}
          companies={companies}
          setCompanies={setCompanies}
          employees={employees}
          setEmployees={setEmployees}
          permissionProfiles={permissionProfiles}
          setPermissionProfiles={setPermissionProfiles}
        />
      </div>
    </div>
  )
}

export default AdminPanel

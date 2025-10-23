import React, { useState } from 'react'
import Sidebar from '../src/components/ui/Sidebar'
import MobileNavigation from '../src/components/ui/MobileNavigation'
import Dashboard from '../components/Dashboard'
import RealTimeMap from '../components/RealTimeMap'
import RoutesTable from '../components/RoutesTable'
import Alerts from '../components/Alerts'
import Reports from '../components/Reports'
import VehiclesManagement from '../components/VehiclesManagement'
import DriversManagement from '../components/DriversManagement'
import RescueDispatch from '../components/RescueDispatch'
import CompaniesManagement from '../components/CompaniesManagement'
import PermissionsManagement from '../components/PermissionsManagement'
import RouteHistory from '../components/RouteHistory'
import CostControl from '../components/CostControl'
import type { View, Route, Company, Employee, PermissionProfile } from '../src/types/types'
import { VIEWS } from '../constants'

interface ManagementPanelProps {
  routes: Route[]
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  permissionProfiles: PermissionProfile[]
  setPermissionProfiles: React.Dispatch<React.SetStateAction<PermissionProfile[]>>
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({
  routes,
  setRoutes,
  companies,
  setCompanies,
  employees,
  setEmployees,
  permissionProfiles,
  setPermissionProfiles,
}) => {
  const [currentView, setCurrentView] = useState<View>(VIEWS.DASHBOARD)

  const renderContent = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard />
      case VIEWS.MAP:
        return <RealTimeMap />
      case VIEWS.ROUTES:
        return <RoutesTable routes={routes} setRoutes={setRoutes} />
      case VIEWS.VEHICLES:
        return <VehiclesManagement />
      case VIEWS.DRIVERS:
        return <DriversManagement />
      case VIEWS.COMPANIES:
        return (
          <CompaniesManagement
            companies={companies}
            setCompanies={setCompanies}
            employees={employees}
            setEmployees={setEmployees}
            permissionProfiles={permissionProfiles}
          />
        )
      case VIEWS.PERMISSIONS:
        return <PermissionsManagement permissionProfiles={permissionProfiles} setPermissionProfiles={setPermissionProfiles} />
      case VIEWS.RESCUE:
        return <RescueDispatch />
      case VIEWS.ALERTS:
        return <Alerts />
      case VIEWS.REPORTS:
        return <Reports />
      case VIEWS.ROUTE_HISTORY:
        return <RouteHistory />
      case VIEWS.COST_CONTROL:
        return <CostControl />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-transparent lg:flex-row">
      <MobileNavigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>
      <main className="flex-1 overflow-y-auto bg-transparent px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="golffox-tag w-max">Command center</span>
            <h2 className="text-2xl font-semibold text-white">Experiência Golffox em modo operacional</h2>
            <p className="max-w-2xl text-sm text-golffox-muted">
              Selecione o módulo para mergulhar em dashboards, telemetria, gestão financeira e jornadas concierge.
            </p>
          </div>
          <div className="golffox-grid">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManagementPanel

import React, { useState } from 'react';
import ManagementPanel from '../views/ManagementPanel';
import AppSelector from './AppSelector';
// import type { AppView, Route, Company, Employee, PermissionProfile } from '../types';
// import { APP_VIEWS, MOCK_ROUTES, MOCK_COMPANIES, MOCK_EMPLOYEES, MOCK_PERMISSION_PROFILES } from '../constants';

// Tipos temporários
type AppView = string;
type Route = any;
type Company = any;
type Employee = any;
type PermissionProfile = any;

// Mock data temporário
const APP_VIEWS = { MANAGEMENT: 'management' };
const MOCK_ROUTES: Route[] = [];
const MOCK_COMPANIES: Company[] = [];
const MOCK_EMPLOYEES: Employee[] = [];
const MOCK_PERMISSION_PROFILES: PermissionProfile[] = [];

const AdminPanel: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(APP_VIEWS.MANAGEMENT);

  // Centralized state for the entire application
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [permissionProfiles, setPermissionProfiles] = useState<PermissionProfile[]>(MOCK_PERMISSION_PROFILES);

  return (
    <div className="h-full w-full bg-gray-100 font-sans text-gray-800 flex flex-col">
        <AppSelector currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 overflow-hidden">
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
  );
};

export default AdminPanel;
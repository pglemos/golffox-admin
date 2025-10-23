'use client';

import React from 'react';
import { useAuth, UserRole } from '../app/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps): React.ReactElement {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return React.createElement('div', {}, 'Carregando...');
  }

  // Admin acessa todas as páginas independentemente de papel/permissão
  if (user && user.role === 'admin') {
    return React.createElement(React.Fragment, {}, children);
  }

  if (!user) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : React.createElement('div', {}, 'Usuario nao autenticado');
  }

  if (requiredRole && user.role !== requiredRole) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : React.createElement('div', {}, 'Permissao insuficiente');
  }

  return React.createElement(React.Fragment, {}, children);
}
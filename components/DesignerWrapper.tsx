'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Importando o componente DesignerDashboard de forma dinâmica para evitar problemas de SSR
const DesignerDashboard = dynamic(() => import('./DesignerDashboard'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen w-screen">Carregando...</div>
});

export default function DesignerWrapper() {
  return <DesignerDashboard />;
}
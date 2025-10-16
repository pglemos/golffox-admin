'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Importando o painel administrativo anterior completo de forma dinâmica para evitar problemas de SSR
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen w-screen">Carregando...</div>
});

export default function DesignerWrapper() {
  return <AdminPanel />;
}
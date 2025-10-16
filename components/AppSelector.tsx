import React from 'react';
// import type { AppView } from '../types';
// import { APP_VIEWS } from '../constants';

// Tipos temporários
type AppView = string;

// Mock data temporário
const APP_VIEWS = { MANAGEMENT: 'management' };
import Image from 'next/image';

interface AppSelectorProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-full bg-golffox-blue-dark text-white p-2 sm:p-3 flex items-center justify-between shadow-lg z-10">
      <div className="flex items-center">
        {/* FIX: Use Base64 logo to prevent broken image icon. */}
        <Image src="/golffox-logo.svg" alt="Golffox Logo" className="h-6 sm:h-8 mr-2 sm:mr-3" width={32} height={32} />
        <h1 className="text-lg sm:text-xl font-bold">Protótipo Golffox</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 bg-black/20 rounded-lg p-1">
        {/* Mostrar apenas o Painel de Gestão (Golffox) */}
        <button
          onClick={() => setCurrentView(APP_VIEWS.MANAGEMENT)}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
            currentView === APP_VIEWS.MANAGEMENT
              ? 'bg-golffox-orange-primary text-white shadow'
              : 'text-golffox-gray-light hover:bg-white/10'
          }`}
        >
          {APP_VIEWS.MANAGEMENT}
        </button>
      </div>
    </div>
  );
};

export default AppSelector;

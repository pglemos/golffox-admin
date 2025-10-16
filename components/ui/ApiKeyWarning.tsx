'use client';

import { useState, useEffect } from 'react';
import { isGoogleMapsApiKeyConfigured, getApiKeyErrorMessage } from '@/services/maps';

export default function ApiKeyWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(true);

  useEffect(() => {
    // Verificar se a chave da API está configurada
    const apiKeyConfigured = isGoogleMapsApiKeyConfigured();
    setIsApiKeyConfigured(apiKeyConfigured);
    setIsVisible(!apiKeyConfigured);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || isApiKeyConfigured) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {getApiKeyErrorMessage()}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleDismiss}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-primary-600 dark:text-primary-400">
                GolfFox
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}`}
              >
                Início
              </Link>
              
              {user && (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/administrador"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/administrador') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    >
                      Administrador
                    </Link>
                  )}
                  
                  {user.role === 'operator' && (
                    <Link
                      href="/operador"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/operador') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    >
                      Operador
                    </Link>
                  )}
                  
                  {user.role === 'driver' && (
                    <Link
                      href="/motorista"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/motorista') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    >
                      Motorista
                    </Link>
                  )}
                  
                  {user.role === 'passenger' && (
                    <Link
                      href="/passageiro"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/passageiro') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    >
                      Passageiro
                    </Link>
                  )}
                </>
              )}
              
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/about') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}`}
              >
                Sobre
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ThemeToggle />
            <div className="ml-4"></div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                <button
                  onClick={signOut}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Abrir menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
            >
              Início
            </Link>
            
            {user && (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/administrador"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/administrador') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                  >
                    Administrador
                  </Link>
                )}
                
                {user.role === 'operator' && (
                  <Link
                    href="/operador"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/operador') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                  >
                    Operador
                  </Link>
                )}
                
                {user.role === 'driver' && (
                  <Link
                    href="/motorista"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/motorista') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                  >
                    Motorista
                  </Link>
                )}
                
                {user.role === 'passenger' && (
                  <Link
                    href="/passageiro"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/passageiro') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                  >
                    Passageiro
                  </Link>
                )}
              </>
            )}
            
            <Link
              href="/about"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive('/about') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
            >
              Sobre
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={signOut}
                    className="block px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100 w-full text-left"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  href="/login"
                  className="block text-base font-medium text-primary-600 hover:text-primary-800 py-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block text-base font-medium btn-primary text-center"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
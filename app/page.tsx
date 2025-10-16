import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GolfFox - Sistema de Gerenciamento de Transporte Executivo',
  description: 'Plataforma para gerenciamento de transporte executivo com rastreamento em tempo real',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-white dark:bg-gray-900 transition-colors">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">GolfFox</h1>
        <p className="text-xl text-center mb-12 text-gray-700 dark:text-gray-300">
          Sistema de Gerenciamento de Transporte Executivo
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Painel do Motorista</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Acesso para motoristas gerenciarem suas viagens, rotas e disponibilidade.</p>
            <Link 
                href="/motorista" 
                className="btn-primary"
              >
                Acessar Painel
              </Link>
          </div>
          
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Painel do Passageiro</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Solicite viagens, acompanhe em tempo real e gerencie seu histórico.</p>
            <Link 
              href="/passageiro" 
              className="btn-primary"
            >
              Acessar
            </Link>
          </div>
          
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Painel Administrativo</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Controle completo da frota, motoristas, passageiros e análise de dados.</p>
            <Link 
              href="/administrador" 
              className="btn-primary"
            >
              Acessar
            </Link>
          </div>
          
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Painel do Operador</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Gerencie rotas, motoristas e veículos da sua empresa de transporte.</p>
            <Link 
              href="/operador" 
              className="btn-primary"
            >
              Acessar
            </Link>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} GolfFox Management System. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
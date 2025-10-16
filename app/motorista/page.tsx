'use client'

import { useRouter } from 'next/navigation'
import ClientWrapper from '../../components/ClientWrapper'
import ProtectedRoute from '../../components/ProtectedRoute'
import LoginScreen from '../../components/driver/LoginScreen'

export default function MotoristaPage() {
  const router = useRouter()
  return (
    <ClientWrapper>
      <ProtectedRoute
        requiredRole="driver"
        fallback={
          <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
            <LoginScreen onLogin={() => router.push('/motorista')} />
          </div>
        }
      >
        <div className="h-full w-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Área do Motorista</h1>
          </div>
        </div>
      </ProtectedRoute>
    </ClientWrapper>
  )
}
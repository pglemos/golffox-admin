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
          <div className="flex min-h-screen w-screen items-center justify-center bg-golffox-base p-4 text-white">
            <LoginScreen onLogin={() => router.push('/motorista')} />
          </div>
        }
      >
        <div className="h-full w-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold">ÁÁrea do Motorista</h1>
          </div>
        </div>
      </ProtectedRoute>
    </ClientWrapper>
  )
}
'use client'

import { useRouter } from 'next/navigation'
import ClientWrapper from '../../components/ClientWrapper'
import ProtectedRoute from '../../components/ProtectedRoute'
import PassengerLoginScreen from '../../components/passenger/PassengerLoginScreen'
import { useAppContext } from '../providers'

export default function PassageiroPage() {
  const router = useRouter()
  const { employees } = useAppContext()

  return (
    <ClientWrapper>
      <ProtectedRoute
        requiredRole="passenger"
        fallback={
          <div className="flex min-h-screen w-screen items-center justify-center bg-golffox-base p-4 text-white">
            <PassengerLoginScreen employees={employees} onLoginSuccess={() => router.push('/passageiro')} />
          </div>
        }
      >
        <div className="h-full w-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Área do Passageiro</h1>
          </div>
        </div>
      </ProtectedRoute>
    </ClientWrapper>
  )
}
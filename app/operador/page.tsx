'use client'

import { useRouter } from 'next/navigation'
import ClientWrapper from '../../components/ClientWrapper'
import ProtectedRoute from '../../components/ProtectedRoute'
import ClientLoginScreen from '../../components/client/ClientLoginScreen'
import { useAppContext } from '../providers'

export default function OperadorPage() {
  const router = useRouter()
  const { employees, permissionProfiles } = useAppContext()
  
  return (
    <ClientWrapper>
      <ProtectedRoute
        requiredRole="operator"
        fallback={
          <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
            <ClientLoginScreen onLogin={() => router.push('/operador')} employees={employees} permissionProfiles={permissionProfiles} />
          </div>
        }
      >
        <div className="h-full w-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Área do Operador</h1>
          </div>
        </div>
      </ProtectedRoute>
    </ClientWrapper>
  )
}
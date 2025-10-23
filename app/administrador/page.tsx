'use client'

import { useRouter } from 'next/navigation'
import ClientWrapper from '../../components/ClientWrapper'
import ProtectedRoute from '../../components/ProtectedRoute'
import DesignerWrapper from '../../components/DesignerWrapper'
import AdminLogin from '../../components/AdminLogin'

export default function AdministradorPage() {
  const router = useRouter()
  return (
    <ClientWrapper>
      <ProtectedRoute
        requiredRole="admin"
        fallback={
          <div className="flex min-h-screen w-screen items-center justify-center bg-golffox-base p-4 text-white">
            <AdminLogin onLogin={() => router.push('/administrador')} />
          </div>
        }
      >
        <div className="h-full w-full">
          <DesignerWrapper />
        </div>
      </ProtectedRoute>
    </ClientWrapper>
  )
}
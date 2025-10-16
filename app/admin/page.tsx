'use client'

import { useRouter } from 'next/navigation'
import ClientWrapper from '../../components/ClientWrapper'
import ProtectedRoute from '../../components/ProtectedRoute'
import DesignerWrapper from '../../components/DesignerWrapper'
import AdminLogin from '../../components/AdminLogin'

export default function AdminPage() {
  const router = useRouter()
  return (
    <ClientWrapper>
      <ProtectedRoute
        requiredRole="admin"
        fallback={
          <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
            <AdminLogin onLogin={() => router.push('/admin')} />
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
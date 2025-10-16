import { NextRequest, NextResponse } from 'next/server'
// import { supabaseServer } from '@/lib/supabase-server'
import { handleApiError, validateRequestBody } from '../../middleware'
// import type { Database } from '@/lib/supabase'

// type UserInsert = Database['public']['Tables']['users']['Insert']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos campos obrigatórios
    const validation = validateRequestBody(body, ['email', 'password', 'name', 'role'])
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Campos obrigatórios ausentes: ${validation.missingFields?.join(', ')}` },
        { status: 400 }
      )
    }

    const { email, password, name, role, company_id } = body

    // Validação do role
    const allowedRoles = ['admin', 'operator', 'driver', 'passenger']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Role inválido' },
        { status: 400 }
      )
    }

    // Mock temporário - simula criação de usuário
    const userData = {
      id: 'mock-user-id-' + Date.now(),
      email,
      name,
      role,
      company_id: company_id || null
    }
    
    // Mock temporário - simula sucesso no registro
    return NextResponse.json({
      message: 'Usuário registrado com sucesso (mock)',
      user: {
        id: userData.id,
        email,
        name,
        role
      }
    })

  } catch (error) {
    return handleApiError(error)
  }
}
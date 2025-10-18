import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'

export async function POST(req: Request) {
  try {
    const setupToken = process.env.SETUP_ADMIN_TOKEN
    const headerToken = req.headers.get('x-setup-token')

    if (!setupToken || headerToken !== setupToken) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({} as any))
    const email: string = body.email || 'admin@golffox.com'
    const password: string = body.password || 'admin123456'
    const name: string = body.name || 'Administrador Golffox'

    // Verificar se já existe algum usuário admin
    const { data: admins, error: checkError } = await supabaseServer
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (admins && admins.length > 0) {
      return NextResponse.json({ status: 'exists', message: 'Usuário admin já existe' }, { status: 200 })
    }

    // Criar usuário via Auth (service role)
    const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'admin',
      },
    })

    if (authError || !authData?.user?.id) {
      return NextResponse.json({ error: authError?.message || 'Falha ao criar usuário de autenticação' }, { status: 500 })
    }

    const userId = authData.user.id

    // Inserir registro em users
    const { error: insertError } = await supabaseServer
      .from('users')
      .insert({ id: userId, email, name, role: 'admin' })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'created', userId, email }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro inesperado' }, { status: 500 })
  }
}
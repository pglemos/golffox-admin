import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      res.setHeader('Allow', 'GET, POST')
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const setupTokenEnv = (process.env.SETUP_ADMIN_TOKEN || '').trim()
    const headerToken = ((req.headers['x-setup-token'] as string) || (req.headers['X-Setup-Token'] as string) || '').trim()
    const queryTokenRaw = (req.query as any)?.token
    const queryToken = typeof queryTokenRaw === 'string' ? queryTokenRaw.trim() : ''
    const debugFlag = (req.query as any)?.debug === '1'
    const providedToken = (queryToken || headerToken).trim()

    // Diagnostics mode (no secrets exposed)
    if (debugFlag) {
      return res.status(200).json({
        method: req.method,
        diagnostics: {
          hasEnvToken: !!setupTokenEnv,
          envTokenLength: setupTokenEnv.length,
          queryPresent: !!queryToken,
          headerPresent: !!headerToken,
          providedTokenLength: providedToken.length,
          equals: !!setupTokenEnv && !!providedToken && setupTokenEnv === providedToken,
        },
      })
    }

    if (!setupTokenEnv || providedToken !== setupTokenEnv) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE

    if (!supabaseUrl || !serviceRole) {
      return res.status(500).json({ error: 'Missing Supabase envs' })
    }

    // Create a local admin client (avoid importing shared client to prevent env validation crashes)
    const supabaseAdmin = createClient(supabaseUrl, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { 'X-Client-Info': 'golffox-admin-provision' } },
    })

    // GET -> status check
    if (req.method === 'GET') {
      const { data: admins, error: listErr } = await supabaseAdmin
        .from('users')
        .select('id,email,name,role')
        .eq('role', 'admin')
        .limit(1)

      if (listErr) {
        return res.status(500).json({ error: 'Falha ao listar usuários', details: listErr.message })
      }

      const exists = Array.isArray(admins) && admins.length > 0
      const admin = exists ? admins[0] : null
      return res.status(200).json({ exists, admin })
    }

    const bodyRaw = req.body as any
    let body: any = {}
    try {
      body = typeof bodyRaw === 'string' ? JSON.parse(bodyRaw) : (bodyRaw || {})
    } catch {}

    const email: string = body.email || 'admin@golffox.com'
    const password: string = body.password || 'admin123456'
    const name: string = body.name || 'Administrador Golffox'

    // Create user via Supabase Auth Admin API
    const authResp = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRole,
        'Authorization': `Bearer ${serviceRole}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: 'admin' },
      }),
    })

    const authJson: any = await authResp.json().catch(() => ({}))

    // Handle both possible response shapes from Supabase: { user: { id, ... } } or { id, ... }
    let userId: string | null = null
    if (!authResp.ok) {
      if (authJson?.error_code === 'email_exists') {
        // Lookup existing user ID by email via Admin list users
        try {
          const listResp = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=200`, {
            headers: {
              'apikey': serviceRole,
              'Authorization': `Bearer ${serviceRole}`,
            },
          })
          const listJson: any = await listResp.json().catch(() => ({}))
          const list = Array.isArray(listJson) ? listJson : (listJson?.users || [])
          const found = Array.isArray(list) ? list.find((u: any) => u?.email === email) : null
          userId = found?.id || null
        } catch {}
        if (!userId) {
          return res.status(500).json({ error: 'Usuário já existe mas ID não encontrado', details: authJson })
        }
      } else {
        const msg = authJson?.error?.message || authJson?.message || 'Falha ao criar usuário de autenticação'
        return res.status(500).json({ error: msg, details: authJson })
      }
    }

    userId = userId ?? (authJson?.user?.id || authJson?.id)
    if (!userId) {
      return res.status(500).json({ error: 'Falha ao obter ID do usuário criado', details: authJson })
    }

    // Check if admin already exists in public.users
    const { data: admins, error: checkErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkErr) {
      return res.status(500).json({ error: 'Falha ao verificar admin existente', details: checkErr.message })
    }

    if (Array.isArray(admins) && admins.length > 0) {
      return res.status(200).json({ status: 'exists', message: 'Usuário admin já existe' })
    }

    // Insert admin record into public.users table
    const { error: insertErr } = await supabaseAdmin
      .from('users')
      .insert({ id: userId, email, name, role: 'admin' })

    if (insertErr) {
      return res.status(500).json({ error: 'Falha ao inserir usuário', details: insertErr.message })
    }

    return res.status(201).json({ status: 'created', userId, email })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Erro inesperado' })
  }
}
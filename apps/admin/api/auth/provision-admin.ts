import type { VercelRequest, VercelResponse } from '@vercel/node'

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

    // GET -> status check
    if (req.method === 'GET') {
      const checkResp = await fetch(`${supabaseUrl}/rest/v1/users?role=eq.admin&select=id,email,name,role`, {
        headers: {
          'apikey': serviceRole,
          'Authorization': `Bearer ${serviceRole}`,
        },
      })
      const admins = await checkResp.json().catch(() => [])
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

    if (!authResp.ok || !authJson?.user?.id) {
      const msg = authJson?.error?.message || authJson?.message || 'Falha ao criar usuário de autenticação'
      return res.status(500).json({ error: msg, details: authJson })
    }

    const userId: string = authJson.user.id

    // Check if admin already exists in public.users
    const checkResp = await fetch(`${supabaseUrl}/rest/v1/users?role=eq.admin&select=id`, {
      headers: {
        'apikey': serviceRole,
        'Authorization': `Bearer ${serviceRole}`,
      },
    })

    const admins = await checkResp.json().catch(() => [])
    if (Array.isArray(admins) && admins.length > 0) {
      return res.status(200).json({ status: 'exists', message: 'Usuário admin já existe' })
    }

    // Insert admin record into public.users table
    const insertResp = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRole,
        'Authorization': `Bearer ${serviceRole}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ id: userId, email, name, role: 'admin' }),
    })

    if (!insertResp.ok) {
      const insertJson: any = await insertResp.json().catch(() => ({}))
      const msg = insertJson?.error || insertJson?.message || 'Falha ao inserir usuário'
      return res.status(500).json({ error: msg, details: insertJson })
    }

    return res.status(201).json({ status: 'created', userId, email })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Erro inesperado' })
  }
}
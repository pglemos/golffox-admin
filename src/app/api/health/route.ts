import { NextResponse } from 'next/server';
import { env } from '@lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date().toISOString();
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return NextResponse.json({
    ok: true,
    timestamp: now,
    environment: {
      node: process.version,
      supabaseUrl: env.client.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: Boolean(env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasServiceRole,
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'http://localhost:3000',
  'https://golffox-admin.vercel.app',
  'https://golffox-transportadora.vercel.app',
  'https://golffox-motorista.vercel.app',
  'https://golffox-passageiro.vercel.app',
  'https://golffox-operador.vercel.app',
]);

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.has(origin);

  if (req.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    preflight.headers.set('Access-Control-Max-Age', '86400');
    preflight.headers.set('Access-Control-Allow-Origin', isAllowed ? origin : 'http://localhost:3000');
    return preflight;
  }

  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Origin', isAllowed ? origin : 'http://localhost:3000');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
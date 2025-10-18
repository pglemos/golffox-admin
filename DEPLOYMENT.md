# Deploy na Vercel e Supabase

Este projeto é um monorepo com app Next.js (pasta raiz `app/`) e apps Vite em `apps/*`. O deploy principal é do Next.js na Vercel. Os apps Vite podem ser publicados separadamente se necessário.

## Pré-requisitos
- Projeto Supabase criado
- Vercel conectado ao repositório do GitHub

## Variáveis de ambiente
Configure as seguintes variáveis na Vercel (Project Settings → Environment Variables):

Requeridas:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (apenas em `Production` e `Preview`)

Opcionais:
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- GEMINI_API_KEY (ou NEXT_PUBLIC_GEMINI_API_KEY)

Dica: use o arquivo `.env.example` como referência.

## Configuração Vercel
- Arquivo `vercel.json` já incluso com:
  - framework: nextjs
  - install/build com `pnpm`
  - output compatível com Next 15
- `next.config.js` permite imagens de `*.vercel.app` e `*.supabase.co`.

## Build e execução
- Build local: `pnpm install` e `pnpm run build`
- Dev local: `pnpm run dev`

## Supabase
- O schema SQL está em `supabase/`. Você pode aplicar via dashboard (SQL Editor) usando `migrations/0001_core.sql` e `seed/000_seed.sql`.
- Scripts auxiliares (locais):
  - `pnpm run verify-supabase`
  - `pnpm run db:create`
  - `pnpm run db:setup`

## Checklist de Deploy
- [ ] Setar variáveis de ambiente na Vercel
- [ ] Configurar domínio (opcional)
- [ ] Verificar `/api/health` em produção
- [ ] Validar login e rotas principais

# 📚 Documentação Técnica — Golffox Platform

Este documento consolida visão arquitetural, fluxos principais e práticas operacionais da plataforma Golffox após a reengenharia 2025.

## 1. Visão geral

- **Frontend**: Next.js 14 (App Router) + React 18
- **Design System**: Tailwind CSS, CVA, componentes em `src/components/ui`
- **State/Data**: React Query 5, Supabase JS 2
- **Autenticação**: Supabase Auth (email/senha)
- **Banco**: Supabase Postgres (`oulwcijxeklxllufyofb`)
- **Deploy**: Vercel (equipe `SynVolt Projetos`)

### Módulos ativos

| Segmento         | Diretório                       | Descrição |
|------------------|---------------------------------|-----------|
| Landing page     | `src/app/(marketing)`           | Página pública com CTA e diferenciais |
| Autenticação     | `src/app/(auth)` + `src/features/auth` | Formulário de login, contexto e hooks |
| Dashboard        | `src/app/(dashboard)` + `src/features/dashboard` | Métricas e atividades provenientes do Supabase |
| Infraestrutura   | `src/lib`                       | Clientes Supabase, logger, env validator |
| Providers globais| `src/providers`                 | Theme, React Query e AuthProvider |

## 2. Fluxo de autenticação

1. O usuário acessa `/sign-in`.
2. `SignInForm` valida dados com `zod` e chama `signIn` do contexto.
3. `AuthProvider` instancia o cliente Supabase browser (`src/lib/supabase/browser-client.ts`).
4. Em sucesso, a sessão é armazenada no Supabase Auth e replicada no contexto; `ProtectedRoute` garante acesso às rotas em `(dashboard)`.
5. Dados complementares são buscados na tabela `users` (colunas `role`, `company_id`, `avatar_url`).

## 3. Dashboard

- Loader `getDashboardOverview` (server) utiliza `createSupabaseAdminClient` para ler contagens de `vehicles`, `drivers`, `passengers` e `routes`.
- `getRecentActivity` traz as últimas 5 rotas com `driver` e `vehicle` populados.
- Componentes são server-first com `Suspense` e skeletons.

## 4. Estrutura de código

```
src/
├── app/
│   ├── (marketing)/page.tsx
│   ├── (auth)/sign-in/page.tsx
│   ├── (dashboard)/layout.tsx
│   ├── (dashboard)/dashboard/page.tsx
│   └── api/health/route.ts
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   └── dashboard/
├── lib/
│   ├── env.ts
│   └── supabase/
├── providers/
└── utils/
```

Aliases configurados em `tsconfig.json` (`@components/*`, `@features/*`, etc.).

## 5. Banco de dados

- `supabase/schema.sql` recria o schema público com tipos (`user_role`, `route_status`, `vehicle_status`), tabelas (`companies`, `users`, `drivers`, `vehicles`, `routes`, `passengers`), índices e registros de demonstração que alimentam o dashboard imediatamente após a execução.
- `supabase/fixed_rls_policies.sql` recompõe as políticas Row Level Security garantindo leitura por membros da empresa e administração via role `admin`.
- A aplicação consome métricas através do cliente **service role**; componentes client-side leem apenas o próprio perfil (`users`).
- Após importar o schema, crie o usuário `admin@golffox.com` via Supabase Auth e sincronize a tabela `users` utilizando o `User ID` retornado.

## 6. Scripts e comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Next.js (http://localhost:3000) |
| `npm run build` | Build de produção (verifica tipos automaticamente) |
| `npm run start` | Servidor Next.js em modo produção |
| `npm run lint` | ESLint com regras Next.js |
| `npm run test` | Vitest (ambiente jsdom) |
| `npm run typecheck` | TypeScript sem emissão |
| `npm run format` | Prettier + plugin Tailwind |

Husky/lint-staged estão disponíveis; rode `npm run prepare` após instalar dependências se quiser hooks locais.

## 7. Testes

- `tests/unit/env.test.ts` garante que a validação de variáveis falha sem Supabase configurado.
- Utilize o Vitest (`npm run test`) antes de merges.

## 8. Deploy

1. Garantir `.env.local` atualizado com as chaves oficiais.
2. Configurar variáveis na Vercel para `production` e `preview` (ver `SETUP_GUIDE.md`).
3. Executar `vercel --scope team_9kUTSaoIkwnAVxy9nXMcAnej`.
4. Conferir `/api/health` e o dashboard após deploy.

## 9. Contatos

- **Suporte Golffox**: suporte@golffox.com
- **Time responsável**: SynVolt Projetos

Esta documentação deve acompanhar qualquer alteração de arquitetura ou dependências críticas.

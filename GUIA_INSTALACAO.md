# 🚀 Guia de Instalação — Plataforma Golffox

Este guia descreve o processo completo para preparar o ambiente local, configurar o Supabase oficial (`oulwcijxeklxllufyofb`) e realizar deploy na Vercel (equipe `SynVolt Projetos`).

## 📦 Pré-requisitos

- **Node.js 20+** e **npm 10+** (`node --version`, `npm --version`)
- **Git** para clonar o repositório
- Acesso ao projeto Supabase **Golf Fox**
- Permissão na equipe `SynVolt Projetos` dentro da Vercel

## 💻 Instalação local

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/pglemos/golffox-replit.git
   cd golffox-replit
   ```
2. **Instalar dependências**
   ```bash
   npm install
   ```
   > Em ambientes restritos (ex.: alguns sandboxes) a instalação pode falhar por falta de acesso ao npm registry.
3. **Configurar variáveis**
   ```bash
   cp .env.example .env.local
   ```
   Os valores já estão preenchidos com as credenciais oficiais do Supabase.
4. **Iniciar o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   A aplicação responde em `http://localhost:3000`.

## 🗄️ Configuração do Supabase

1. Acesse https://app.supabase.com/project/oulwcijxeklxllufyofb.
2. Abra **SQL Editor** › **New query**.
3. Execute [`supabase/schema.sql`](supabase/schema.sql) — o script remove a estrutura antiga e cria:
   - Tipos `user_role`, `vehicle_status`, `route_status`
   - Tabelas `companies`, `users`, `drivers`, `vehicles`, `routes`, `passengers`
   - Triggers de `updated_at`, índices e registros de demonstração para o dashboard
4. Execute [`supabase/fixed_rls_policies.sql`](supabase/fixed_rls_policies.sql) para recriar as políticas Row Level Security.
5. Em **Authentication › Users**, crie `admin@golffox.com`. Copie o `User ID` e sincronize com a tabela `users` usando o script sugerido em [`supabase/README.md`](supabase/README.md).
6. Ajuste **Auth › Settings**:
   - `Site URL`: `https://golffox.vercel.app`
   - `Redirect URLs`: `https://golffox.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`

Após esses passos, o dashboard `/dashboard` já apresenta métricas (veículos, motoristas, passageiros e rotas) vindas do Supabase.

## ☁️ Deploy na Vercel

1. Autentique-se e selecione a equipe correta:
   ```bash
   vercel login
   vercel switch --scope team_9kUTSaoIkwnAVxy9nXMcAnej
   ```
2. Defina as variáveis de ambiente:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add SUPABASE_JWT_SECRET production

   vercel env add NEXT_PUBLIC_SUPABASE_URL preview
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
   vercel env add SUPABASE_SERVICE_ROLE_KEY preview
   vercel env add SUPABASE_JWT_SECRET preview
   ```
3. Faça o deploy:
   ```bash
   vercel --scope team_9kUTSaoIkwnAVxy9nXMcAnej
   ```

## ▶️ Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Next.js em modo desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Sobe o servidor em modo produção |
| `npm run lint` | Executa ESLint (requer dependências instaladas) |
| `npm run test` | Roda a suíte do Vitest |
| `npm run typecheck` | Valida os tipos com TypeScript |

## 🆘 Troubleshooting

| Problema | Diagnóstico | Solução |
|----------|-------------|---------|
| `npm ERR! 403 Forbidden` | Ambiente sem acesso ao npm registry | Utilize uma máquina local ou CI com acesso liberado |
| Dashboard vazio | Falta de dados nas tabelas | Reaplique `schema.sql` ou insira registros manualmente |
| Login falha | Usuário não sincronizado em `users` | Garanta que o `User ID` do Supabase Auth está presente na tabela `users` |
| Build falha no Vercel | Variáveis ausentes | Revise `vercel env ls` e repita a configuração |

Com isso o projeto fica pronto para desenvolvimento local e deploy contínuo.

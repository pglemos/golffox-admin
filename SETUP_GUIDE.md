# 🚀 Guia de Configuração — Plataforma Golffox

Este passo a passo garante que o projeto esteja operando com o Supabase oficial (`oulwcijxeklxllufyofb`) e pronto para deploy contínuo na Vercel (equipe `SynVolt Projetos`).

## 📋 Pré-requisitos

- Node.js 20+
- npm 10+
- Conta Supabase com acesso ao projeto **Golf Fox**
- Acesso à equipe `SynVolt Projetos` na Vercel

## ⚙️ Configuração rápida

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Os valores já estão preenchidos com as chaves oficiais fornecidas pelo time. Caso gere novas chaves no Supabase, atualize o arquivo.

3. **Suba o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   A aplicação responde em `http://localhost:3000`.

## 🗄️ Banco de dados Supabase

### 1. Selecionar o projeto
- URL: https://app.supabase.com/project/oulwcijxeklxllufyofb
- API URL: `https://oulwcijxeklxllufyofb.supabase.co`

### 2. Importar o schema oficial
1. Abra **SQL Editor** › **New query**.
2. Cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e execute.
3. Em seguida, aplique as políticas de segurança executando [`supabase/fixed_rls_policies.sql`](supabase/fixed_rls_policies.sql).

> ✅ O schema é recriado do zero (DROP + CREATE) e inclui registros de exemplo para que o dashboard exiba dados imediatamente.

### 3. Configurações adicionais
- **Auth › Settings**
  - `Site URL`: `https://golffox.vercel.app`
  - `Redirect URLs`: `https://golffox.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`
- **Authentication › Providers**: habilite e-mail/senha.
- **Authentication › Users**: cadastre `admin@golffox.com` no Supabase Auth e associe o `User ID` à tabela `users` conforme descrito em [`supabase/README.md`](supabase/README.md).
- **Storage** (opcional): crie o bucket `uploads` para avatares.

## ☁️ Deploy na Vercel

1. Autentique-se e selecione a equipe:
   ```bash
   vercel login
   vercel switch --scope team_9kUTSaoIkwnAVxy9nXMcAnej
   ```
2. Defina variáveis de ambiente (produção e preview):
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
3. Execute o deploy:
   ```bash
   vercel --scope team_9kUTSaoIkwnAVxy9nXMcAnej
   ```

> Dica: use `vercel env pull .env` para sincronizar variáveis localmente antes de builds.

## 🧪 Checks obrigatórios

Antes de subir alterações execute:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## 🆘 Troubleshooting

| Problema | Diagnóstico | Solução |
|----------|-------------|---------|
| `Invalid API key` | Supabase bloqueou a requisição | Verifique `.env.local` e as variáveis na Vercel |
| Dashboard vazio | Falta de dados nas tabelas | Insira registros em `vehicles`, `drivers`, `routes` e `passengers` |
| Redirect inválido na autenticação | URLs não configuradas no Supabase | Atualize **Auth › Settings** com as URLs acima |
| Build falhou no Vercel | Variáveis não configuradas no scope correto | Execute novamente o passo de `vercel env add` para `production` e `preview` |

Com esses passos o ambiente fica alinhado para desenvolvimento local, staging e produção.

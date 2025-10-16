# Configuração do Supabase — Golffox

Este diretório concentra os artefatos oficiais para manter o projeto Supabase **Golf Fox** (`oulwcijxeklxllufyofb`) alinhado com a nova arquitetura Next.js 14.

## 📋 Informações do Projeto

- **Nome**: Golf Fox
- **Project ID**: `oulwcijxeklxllufyofb`
- **URL**: https://oulwcijxeklxllufyofb.supabase.co
- **Chaves**:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bHdjaWp4ZWtseGxsdWZ5b2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTIzOTMsImV4cCI6MjA3NTk2ODM5M30.J_I1nU3JfZ6GoDWCIwOD4zSK041YwtkdVCjOBRYv1Q4`
  - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bHdjaWp4ZWtseGxsdWZ5b2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM5MjM5MywiZXhwIjoyMDc1OTY4MzkzfQ.SDOXBPWV2DTCb8mQGm-ScGCtr4recU9a6GQdjO7hx9g`
  - `SUPABASE_JWT_SECRET`: `cB94dthDvtYPfXyZLthr4ZyNbWwuAB9RUTUMJNY2J/PBylawMGNuY74H+jwm9jBG9n/2Btn9JNAmrDCREM3D+A==`

> ⚠️ Execute uma rotação de chaves em **Settings › API** sempre que promover ambientes ou suspeitar de vazamento.

## 📁 Arquivos

| Arquivo | Função |
|---------|--------|
| `schema.sql` | Redefine todo o schema público (tabelas, tipos, índices e seed para o dashboard) |
| `fixed_rls_policies.sql` | Recria as políticas de RLS compatíveis com a aplicação atual |

## 🚀 Passo a passo de provisionamento

1. Acesse https://app.supabase.com/project/oulwcijxeklxllufyofb.
2. Abra **SQL Editor** › **New query**.
3. Execute `schema.sql` para recriar as tabelas `companies`, `users`, `drivers`, `vehicles`, `routes` e `passengers`.
   - O script é destrutivo: remove a estrutura antiga antes de criar a nova.
   - Registros de exemplo são inseridos automaticamente para alimentar o dashboard (contagem de frota, rotas e passageiros).
4. Execute `fixed_rls_policies.sql` para aplicar as políticas de acesso.

### Configurações adicionais

- **Auth › Settings**
  - `Site URL`: `https://golffox.vercel.app`
  - `Redirect URLs`: `https://golffox.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`
- **Auth › Providers**: mantenha e-mail/senha habilitado.
- **Storage** (opcional): bucket `avatars` para fotos de motoristas/usuários.

### Criando o administrador

1. Em **Authentication › Users**, clique em **Add user** e cadastre `admin@golffox.com` com a senha desejada.
2. Anote o `User ID` gerado.
3. Insira um registro correspondente na tabela `users` via SQL ou Table Editor:
   ```sql
   INSERT INTO users (id, email, name, role, company_id)
   VALUES ('<USER_ID>', 'admin@golffox.com', 'Administrador Golffox', 'admin', 'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10')
   ON CONFLICT (id) DO UPDATE
     SET role = EXCLUDED.role,
         company_id = EXCLUDED.company_id,
         name = EXCLUDED.name;
   ```
4. Faça login na aplicação usando `/sign-in` para validar o fluxo.

## 🧪 Verificações rápidas

Execute a rota `/api/health` após configurar o ambiente. A resposta deve retornar `ok: true` e `hasServiceRole: true` quando a chave de serviço estiver presente.

```bash
curl https://golffox.vercel.app/api/health
```

## 🔒 Boas práticas

- Sincronize `.env.example` sempre que rotacionar credenciais.
- Limite o acesso às tabelas diretamente pelo Supabase Studio usando os papéis `admin`/`operator` definidos nas políticas.
- Utilize chaves separadas para ambientes `preview` e `production` na Vercel (`vercel env add`).

Com esses scripts o Supabase fica alinhado à nova base de código e fornece os dados necessários para o dashboard em produção.

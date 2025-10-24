# Seeds do Supabase (`supabase/seed`)

Este diretório agrupa os dados iniciais aplicados após o schema base. Os seeds são
carregados automaticamente pelos utilitários `runSetup()` (presentes em `api/src/dbSetup.ts`
e `scripts/setup-project.js`).

## Arquivos

- `000_seed.sql` – Cria perfis padrão, empresa demo, veículos, motoristas e rotas de exemplo.

## Como executar manualmente

1. Aplique o schema principal (`supabase/schema.sql`).
2. Rode as políticas (`supabase/rls_policies.sql`).
3. Execute o seed:
   ```sql
   -- No SQL Editor do Supabase
   \i supabase/seed/000_seed.sql
   ```

## Personalizando dados

- Duplique `000_seed.sql` e adicione novos blocos de `INSERT` para cenários específicos.
- Em pipelines, defina a variável `SUPABASE_SCRIPTS_DIR` para apontar para uma pasta
  alternativa contendo os seeds customizados.

Manter seeds versionados garante que os dashboards da App Router e dos microfrontends
fiquem imediatamente utilizáveis após o provisionamento do banco.

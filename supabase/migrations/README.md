# Migrações do Supabase (`supabase/migrations`)

As migrações aqui versionadas complementam os arquivos `schema.sql` e `rls_policies.sql`.
Use-as quando precisar aplicar alterações incrementais sem reprovisionar o banco inteiro.

## Inventário

| Arquivo | Descrição |
| --- | --- |
| `0001_core.sql` | Primeira versão pública do schema (tabelas base, policies iniciais e seeds mínimos). |
| `20250125_golffox_core.sql` | Estrutura consolidada com veículos, rotas, viagens, métricas e RLS revisada. |
| `20250208_admin_entity_extensions.sql` | Amplia entidades administrativas (perfis de permissão, relacionamentos de empresas e auditoria). |

## Como aplicar

1. Garanta que o schema atual esteja sincronizado (`schema.sql` + `rls_policies.sql`).
2. No SQL Editor do Supabase, execute o arquivo desejado.
3. Verifique logs e políticas para confirmar que a migração não entrou em conflito com o que já existe.

> ℹ️ Para pipelines automatizados, referencie o arquivo diretamente usando `psql -f supabase/migrations/<arquivo>.sql`
> ou utilize `pnpm run setup -C api` para aplicar a combinação padrão (schema + RLS + seed).

Manter um histórico claro de migrações facilita auditorias e rollback durante investigações
ou quando múltiplos ambientes precisam ser atualizados em tempos diferentes.

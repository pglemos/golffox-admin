# Guia de Automação, API e Scripts Operacionais

Este guia cobre o diretório `api/` e os scripts de automação localizados em `scripts/` e `src/scripts/`.

## API administrativa (`api/`)
- Consulte [`api/README.md`](../../api/README.md) para instruções completas de execução e variáveis obrigatórias.
- `api/src/index.ts` inicializa um servidor Hono com endpoints de health-check, provisionamento Supabase (`/admin/setup`) e consultas administrativas (`/admin/trips`) usando a service role.【F:api/src/index.ts†L1-L64】

## Scripts JavaScript (`scripts/`)
- `setup-project.js` guia a configuração inicial do Supabase, cria tabelas básicas (`profiles`, `vehicles`, `trips`) e políticas RLS interativamente.【F:scripts/setup-project.js†L1-L182】
- `verify-supabase.js` roda checagens completas de conexão, tabelas, políticas e extensões antes de liberar deploys.【F:scripts/verify-supabase.js†L1-L86】
- `check-db-schema.js` e `check-user-auth.js` validam se a estrutura do banco e as regras de autenticação estão saudáveis após seeds ou migrações.【F:scripts/check-db-schema.js†L1-L109】【F:scripts/check-user-auth.js†L1-L105】
- `debug-data.js`, `create-test-user.js` e `update-user-company.js` apoiam auditorias e suporte, permitindo inspecionar métricas, gerar usuários de homologação e ajustar vínculos com transportadoras.【F:scripts/debug-data.js†L1-L93】【F:scripts/create-test-user.js†L1-L63】【F:scripts/update-user-company.js†L1-L67】

## Scripts TypeScript modernos (`src/scripts/`)
- `src/scripts/verify-supabase.ts` executa uma bateria de testes: conexão, existência de tabelas, políticas RLS, operações CRUD e extensões, emitindo logs human-friendly para cada etapa.【F:src/scripts/verify-supabase.ts†L1-L332】
- `src/scripts/setup-project.ts` automatiza a criação de roles, tabelas e políticas com validação passo a passo e logs ricos.【F:src/scripts/setup-project.ts†L1-L342】
- `src/scripts/create-database.ts` provisiona esquemas e extensões compartilhando helpers com o frontend e demais scripts.【F:src/scripts/create-database.ts†L1-L112】

## Recomendações
1. Migrar gradualmente scripts de `scripts/` para `src/scripts/` usando TypeScript + tsx para padronizar tooling.
2. Automatizar o endpoint `/admin/setup` em pipelines CI/CD para garantir que o schema esteja atualizado antes de deploys.
3. Publicar scripts críticos (`check-db-schema`, `verify-supabase`, `debug-data`) em jobs agendados para detectar regressões em ambientes compartilhados.
4. Adicionar documentação de variáveis de ambiente obrigatórias em um `.env.template` específico para API e scripts.

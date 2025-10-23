# Guia de Automação, API e Scripts Operacionais

Este guia cobre o diretório `api/` e os scripts de automação localizados em `scripts/` e `src/scripts/`.

## API administrativa (`api/`)
- Consulte [`api/README.md`](../../api/README.md) para instruções completas de execução e variáveis obrigatórias.
- `api/src/index.ts` inicializa um servidor Hono com endpoints de health-check, provisionamento Supabase (`/admin/setup`) e consultas administrativas (`/admin/trips`) usando a service role.【F:api/src/index.ts†L1-L64】

## Scripts JavaScript legados (`scripts/`)
- `scripts/setup-project.js` guia a configuração inicial do Supabase, cria tabelas básicas (`profiles`, `vehicles`, `trips`) e políticas RLS interativamente.【F:scripts/setup-project.js†L1-L108】

## Scripts TypeScript modernos (`src/scripts/`)
- `src/scripts/verify-supabase.ts` executa uma bateria de testes: conexão, existência de tabelas, políticas RLS, operações CRUD e extensões, emitindo logs human-friendly para cada etapa.【F:src/scripts/verify-supabase.ts†L1-L110】

## Recomendações
1. Migrar gradualmente scripts de `scripts/` para `src/scripts/` usando TypeScript + tsx para padronizar tooling.
2. Automatizar o endpoint `/admin/setup` em pipelines CI/CD para garantir que o schema esteja atualizado antes de deploys.
3. Adicionar documentação de variáveis de ambiente obrigatórias em um `.env.template` específico para API e scripts.

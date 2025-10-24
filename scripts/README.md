# Scripts de Automação (`scripts/`)

Este diretório mantém utilidades em JavaScript usadas para provisionamento rápido do ambiente e tarefas administrativas. Versões equivalentes em TypeScript vivem em `src/scripts/`.

## Scripts principais
- `setup-project.js` orienta a configuração do Supabase (tabelas, políticas RLS e seeds) através de prompts interativos.【F:scripts/setup-project.js†L1-L182】
- `verify-supabase.js` executa verificações automatizadas da conexão, checando tabelas e políticas antes de liberar o deploy.【F:scripts/verify-supabase.js†L1-L86】
- `build-workspace.js` e `push-to-github.sh` auxiliam pipelines locais para build e publicação do monorepo.【F:scripts/build-workspace.js†L1-L31】【F:scripts/push-to-github.sh†L1-L20】

## Auditoria e suporte operacional
- `check-db-schema.js` garante que tabelas críticas (`permission_profiles`, `users`, `companies`) existam e estejam populadas antes de liberar o ambiente.【F:scripts/check-db-schema.js†L1-L109】
- `check-user-auth.js` valida regras de autenticação do Supabase testando credenciais, perfis e políticas RLS aplicadas a usuários de teste.【F:scripts/check-user-auth.js†L1-L105】
- `debug-data.js` imprime contagens de entidades e relacionamentos para auditorias rápidas de integridade do banco.【F:scripts/debug-data.js†L1-L93】
- `create-test-user.js` cria um usuário administrador completo (empresa, perfil de permissão e senha temporária) para cenários de homologação.【F:scripts/create-test-user.js†L1-L63】
- `update-user-company.js` realoca um usuário para uma nova transportadora, útil em casos de suporte e auditorias de dados.【F:scripts/update-user-company.js†L1-L67】

## Scripts modernos (`src/scripts/`)
- `verify-supabase.ts` reimplementa as checagens com tipagens estáticas e logs amigáveis, servindo como referência para novas automações.【F:src/scripts/verify-supabase.ts†L1-L332】
- `setup-project.ts` e `create-database.ts` mostram como consumir o client Supabase tipado compartilhando lógica com o frontend.【F:src/scripts/setup-project.ts†L1-L342】【F:src/scripts/create-database.ts†L1-L112】

## Execução rápida via `package.json`
Scripts npm/PNPM expõem os utilitários principais:

```bash
# Provisionamento e verificações
pnpm setup-project
pnpm verify-supabase

# Auditoria e suporte
pnpm db:inspect
pnpm auth:check
pnpm db:debug-data
pnpm db:create-test-user
pnpm user:update-company
```

## Convenções
1. Prefira TypeScript para novos scripts e exporte funções puras para facilitar testes unitários.
2. Documente variáveis de ambiente necessárias no cabeçalho do arquivo ou no `README` relevante.
3. Ao migrar um script de `scripts/` para `src/scripts/`, mantenha ambos até completar a paridade funcional.

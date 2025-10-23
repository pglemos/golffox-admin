# Scripts de Automação (`scripts/`)

Este diretório mantém utilidades em JavaScript usadas para provisionamento rápido do ambiente e tarefas administrativas. Versões equivalentes em TypeScript vivem em `src/scripts/`.

## Scripts principais
- `setup-project.js` orienta a configuração do Supabase (tabelas, políticas RLS e seeds) através de prompts interativos.【F:scripts/setup-project.js†L1-L120】
- `verify-supabase.js` executa verificações automatizadas da conexão, checando tabelas e políticas antes de liberar o deploy.【F:scripts/verify-supabase.js†L1-L85】
- `build-workspace.js` e `push-to-github.sh` auxiliam pipelines locais para build e publicação do monorepo.【F:scripts/build-workspace.js†L1-L31】【F:scripts/push-to-github.sh†L1-L20】

## Scripts modernos (`src/scripts/`)
- `verify-supabase.ts` reimplementa as checagens com tipagens estáticas e logs amigáveis, servindo como referência para novas automações.【F:src/scripts/verify-supabase.ts†L1-L99】
- `setup-project.ts` e `create-database.ts` mostram como consumir o client Supabase tipado compartilhando lógica com o frontend.【F:src/scripts/setup-project.ts†L1-L160】【F:src/scripts/create-database.ts†L1-L111】

## Convenções
1. Prefira TypeScript para novos scripts e exporte funções puras para facilitar testes unitários.
2. Documente variáveis de ambiente necessárias no cabeçalho do arquivo ou no `README` relevante.
3. Ao migrar um script de `scripts/` para `src/scripts/`, mantenha ambos até completar a paridade funcional.

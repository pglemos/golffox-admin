# Diagnóstico Técnico Inicial

## Visão Geral
O repositório apresenta uma mistura de código legado, mocks de dados e integrações incompletas com Supabase. A base atual utiliza versões experimentais do ecossistema React/Next.js, não possui validação de variáveis de ambiente, carece de padronização de código e mantém rotas/API que retornam respostas estáticas. A seguir listamos os principais pontos levantados na análise inicial.

## Problemas por Severidade

### Críticos
- **Stack instável e dependências não suportadas** – O `package.json` referencia `next@^15.5.4`, `react@^19.1.1` e `tailwindcss@^4.1.14`, versões ainda não lançadas oficialmente, impedindo builds reprodutíveis. 【F:package.json†L6-L34】
- **Falha de execução por validação de ambiente em tempo de import** – Serviços Supabase lançam exceção assim que o módulo é importado quando variáveis não estão definidas (`services/supabase.ts`, `lib/supabase.ts`, `lib/supabase-server.ts`), quebrando build e testes. 【F:services/supabase.ts†L1-L59】【F:lib/supabase.ts†L1-L73】【F:lib/supabase-server.ts†L1-L35】
- **APIs críticas com respostas mockadas** – Rotas como `app/api/auth/login` e middlewares associados retornam dados simulados, sem autenticação real ou acesso ao banco. 【F:app/api/auth/login/route.ts†L1-L63】【F:app/api/middleware.ts†L1-L92】
- **Contexto global sem tipagem e com dados vazios** – `app/providers.tsx` utiliza `any`, mocks vazios e não injeta dados reais para as telas, bloqueando funcionalidades centrais. 【F:app/providers.tsx†L1-L59】

### Altos
- **Configuração Next.js expõe segredos e ignora validações** – `next.config.js` injeta chaves não públicas no bundle, mantém `ignoreDuringBuilds` e `ignoreBuildErrors`, mascarando erros críticos. 【F:next.config.js†L1-L36】
- **Bypass de autenticação inseguro** – `useAuth` permite login `admin/admin` sem validação, além de não tratar erros de forma robusta. 【F:app/hooks/useAuth.tsx†L1-L107】
- **Ausência de fluxo real de autorização** – `ProtectedRoute` confia apenas no contexto local, sem verificação de sessão ou redirecionamento seguro. 【F:components/ProtectedRoute.tsx†L1-L37】
- **Artefatos de build versionados** – Diretório `dist/` permanece no repositório, aumentando ruído e risco de conflitos. 【F:dist/index.html†L1-L45】
- **Documentação divergente da implementação atual** – Arquivos como `DIAGNOSTICO.md` e `PLANO_DE_ACAO.md` descrevem problemas antigos (ex. projeto duplicado) que não refletem o estado atual, gerando confusão.

### Médios
- **Estrutura de pastas inconsistente** – Convivem `app/`, `components/`, `src/`, `views/`, `services/` e `lib/` com responsabilidades sobrepostas, dificultando manutenção.
- **Configuração TypeScript permissiva** – `tsconfig.json` está com `strict: false`, `allowJs: true` e `skipLibCheck`, reduzindo qualidade. 【F:tsconfig.json†L1-L36】
- **Falta de padronização de lint/format** – Apenas ESLint básico é configurado; não há Prettier, lint-staged ou convenções.
- **Testes desconectados da stack** – Scripts de teste em `src/test/unit` usam Node puro e mocks manuais, sem integração com Jest/Vitest.
- **Sem `.env.example` e sanitização** – Não existe template de variáveis nem biblioteca de validação, dificultando setup seguro.

## Áreas que Exigem Reescrita/Refatoração Completa
- **Autenticação e autorização** – Implementar fluxo real com Supabase (ou provedor equivalente) e proteger rotas server/client.
- **Camada de dados e serviços** – Reescrever serviços Supabase com validação de ambiente, separação browser/server e tratamento de erros.
- **API Routes** – Substituir handlers mockados por rotas que validem entrada (ex. Zod) e interajam com o banco.
- **Provider global e hooks** – Criar contexto tipado, providers (React Query, Theme, Auth) e remover `any`/mocks.
- **Configuração do build** – Atualizar Next/React/Tailwind para versões estáveis, ajustar `tsconfig`, ESLint, Prettier e scripts npm.

## Dependências Obsoletas ou Problemáticas
- Stack Next.js/React/Tailwind em versões pré-lançamento (`next@15.x`, `react@19.x`, `tailwindcss@4.x`).
- Ausência de libs modernas para validação (`zod`), gerenciamento de dados (`@tanstack/react-query`) e utilitários essenciais (`clsx`, `date-fns`).

## Recomendações Arquiteturais
- Adotar estrutura modular em `src/` com camadas `app`, `features`, `components`, `lib`, `server` e `tests`.
- Implementar validação de ambiente com Zod (`env.ts`) e separar clientes Supabase (browser/server/admin) com cache e tratativa de cookies.
- Incluir providers globais (Theme, QueryClient, Auth) no layout raiz e preferir componentes server-first no App Router.
- Criar design system básico (botões, cards, tabelas responsivas) e migrar páginas para componentes reutilizáveis.
- Configurar pipelines de qualidade (ESLint strict, Prettier, Husky/lint-staged) e suíte de testes com Vitest + Testing Library.

---
Este diagnóstico servirá como guia para a reengenharia completa descrita nas próximas etapas.

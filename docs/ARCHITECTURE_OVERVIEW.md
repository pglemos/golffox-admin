# Visão Geral da Arquitetura

Este documento descreve a organização do repositório `golffox-admin`, destacando onde cada parte da plataforma vive e como os módulos se relacionam. Use-o como mapa inicial antes de mergulhar em áreas específicas.

## Mapa de Diretórios Principais

| Caminho | Responsabilidade | Notas |
| --- | --- | --- |
| `app/` | Aplicação Next.js (App Router) que centraliza a experiência unificada da plataforma. | Subpastas segmentam dashboards por persona como administradores, motoristas e operadores. |
| `components/` | Biblioteca de componentes compartilhados (auth, motorista, passageiro etc.) usada pelas rotas da App Router. | Concentrada em fluxos de login e blocos de UI reusáveis. |
| `lib/` | Clientes e utilitários globais (Supabase, React Query e IA Gemini). | Fornece os singletons usados no frontend e scripts. |
| `services/` | Serviços de domínio e integrações (Supabase, mapas, telemetria e mocks). | Úteis para simular dados em ambientes locais. |
| `packages/shared/` | Pacote compartilhado do design system, AI helpers e client Supabase para microfrontends. | Consumido pelos apps Vite e pela App Router. |
| `apps/` | Microfrontends Vite dedicados (admin, carrier, driver, operator, passenger). | Mantidos para demonstrações isoladas. |
| `api/` | API Hono + Supabase utilities para setup e endpoints administrativos. | Pode ser executada separadamente para tarefas de infraestrutura. |
| `scripts/` & `src/scripts/` | Automação de setup, deploy e verificação de banco. | Mistura scripts JS legados e versões modernas em TypeScript. |
| `supabase/` | Scripts SQL, seeds e documentação de configuração do banco. | Base única da camada de dados. |
| `static-site/`, `static-solution/`, `dist/`, `golffox-admin-new/` | Builds estáticos e protótipos anteriores. | Úteis como referência histórica. |

## Aplicação Next.js (`app/`)

A App Router é o núcleo atual da plataforma. O `RootLayout` carrega fontes, provedores globais e efeitos visuais enquanto envolve todas as rotas.【F:app/layout.tsx†L1-L45】 Cada persona possui um módulo dedicado, como o dashboard administrativo em `app/admin/page.tsx` com KPIs, navegação contextual e gráficos animados.【F:app/admin/page.tsx†L1-L80】 Fluxos protegidos para motoristas reaproveitam wrappers de autenticação compartilhados e exibem experiências específicas, como em `app/motorista/page.tsx` que exige a role `driver` antes de liberar o conteúdo.【F:app/motorista/page.tsx†L1-L27】

### Componentes Compartilhados

A pasta `components/` agrupa blocos reutilizáveis por domínio — por exemplo, `components/driver/LoginScreen.tsx` fornece o fluxo completo de login responsivo dos motoristas, incluindo assets e interações padrão.【F:components/driver/LoginScreen.tsx†L1-L49】 Esses componentes são consumidos diretamente pelas rotas da App Router, garantindo consistência visual.

### Constantes e Tipagens

Mocks e tipagens centrais residem em `constants.ts`, onde são definidos os enumeradores de views, perfis de permissão, empresas, funcionários e dados de rotas que alimentam dashboards e simulações.【F:constants.ts†L1-L152】 As tipagens detalhadas vivem em `src/types`, servindo tanto para a App Router quanto para serviços legados.

## Serviços e Integrações (`lib/` e `services/`)

O diretório `lib/` concentra clientes globais. `lib/supabase.ts` valida variáveis de ambiente, instancia clientes público e administrativo e exporta helpers para escolher o cliente correto conforme o contexto de execução.【F:lib/supabase.ts†L1-L66】 O wrapper de IA Gemini em `lib/ai-client.ts` expõe operações de sugestão de rotas e análises com fallbacks determinísticos quando a chave não está configurada.【F:lib/ai-client.ts†L1-L117】 Para chamadas lado servidor, `lib/supabase-server.ts` e `lib/react-query.ts` mantêm provedores compartilhados.

A camada `services/` agrega integrações de negócio e mocks realistas. Há serviços de analytics com geração de métricas sintéticas,【F:services/mockAnalyticsService.ts†L1-L80】 rastreamento veicular em tempo real com eventos simulados,【F:services/mockVehicleTrackingService.ts†L1-L158】 wrappers de mapas e notificações, além de um cliente Supabase pronto para CRUD completo com schemas tipados.【F:services/supabase.ts†L1-L160】 Esses módulos facilitam demos sem depender de infraestrutura externa.

## Pacotes Compartilhados (`packages/shared/`)

O monorepo expõe um design system completo em `packages/shared/ui`, com exportações de temas, componentes e animações a partir de um único entrypoint.【F:packages/shared/ui/index.ts†L1-L3】 O `ThemeProvider` centraliza alternância claro/escuro e sincroniza tokens CSS com o `localStorage` para consumo em qualquer aplicação que importe o pacote.【F:packages/shared/ui/theme/ThemeProvider.tsx†L1-L44】 Há também um wrapper de IA focado nos microfrontends Vite, entregando fallbacks quando a API não está disponível.【F:packages/shared/ai/aiClient.ts†L1-L39】

## Microfrontends e Protótipos (`apps/`, `golffox-admin-new/`, `static-*`, `dist/`)

Além da App Router principal, o repositório mantém microfrontends construídos com Vite e React em `apps/`. Cada subdiretório possui sua própria configuração (`vite.config.ts`) com alias para reutilizar o pacote `packages/shared`.【F:apps/admin/vite.config.ts†L1-L18】 Esses apps funcionam como sandboxes para testar experiências segmentadas.

Protótipos e builds estáticos residem em `static-site/`, `static-solution/` e `dist/`, enquanto `golffox-admin-new/` guarda uma iteração alternativa da aplicação Next.js. Eles servem como referência de UI e fallback em demonstrações.

## Backend e Automação (`api/`, `scripts/`, `src/scripts/`)

O diretório `api/` expõe um servidor Hono com endpoints de health-check, setup de banco e integração com Supabase e Gemini. Consulte [`api/README.md`](../api/README.md) para scripts, variáveis de ambiente e instruções de execução. A rota `/admin/setup` executa `runSetup` para provisionar o banco, enquanto `/admin/trips` consulta a tabela `trips` usando a service role.【F:api/src/index.ts†L1-L75】

Scripts de automação vivem tanto em `scripts/` (JavaScript) quanto em `src/scripts/` (TypeScript). `scripts/setup-project.js` guia a criação de tabelas Supabase e políticas RLS diretamente pela CLI interativa.【F:scripts/setup-project.js†L1-L160】 A versão moderna `src/scripts/verify-supabase.ts` verifica conexão, existência de tabelas e RLS, emitindo relatórios claros para quem está montando o ambiente.【F:src/scripts/verify-supabase.ts†L1-L99】

## Banco de Dados (`supabase/`)

Toda a infraestrutura SQL está documentada em `supabase/README.md`, incluindo instruções para aplicar `schema.sql`, políticas RLS e checklists de verificação.【F:supabase/README.md†L1-L88】 O diretório ainda inclui scripts complementares (`fixed_rls_policies.sql`, `missing_tables.sql`) e seeds iniciais.

## Middleware e Segurança

A camada de middleware Next.js centraliza regras de CORS em `middleware.ts`, autorizando origens conhecidas e ajustando respostas preflight para todas as rotas API.【F:middleware.ts†L1-L34】 Isso evita vazamento de endpoints administrativos durante integrações externas.

## Próximos Passos Recomendados

1. **Atualize ou remova protótipos herdados** quando eles não forem mais necessários, reduzindo ruído no repositório.
2. **Unifique scripts duplicados** migrando gradualmente de `scripts/` (JS) para `src/scripts/` (TS) para manter um único padrão.
3. **Documente fluxos específicos** (ex.: onboarding de operadores) diretamente no diretório da persona (`app/operador`) seguindo o mesmo formato.

Com este mapa em mãos, um novo engenheiro consegue identificar rapidamente onde evoluir a UI, conectar serviços ou ajustar a infraestrutura.

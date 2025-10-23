# Guia da App Router

Este guia apresenta a estrutura da aplicação Next.js em `app/`, descrevendo layouts, provedores e como os dashboards por persona são organizados.

## Layout raiz e provedores globais
- O `RootLayout` importa estilos globais, registra a fonte Plus Jakarta e aplica camadas visuais e provedores compartilhados que englobam todas as rotas.【F:app/layout.tsx†L1-L42】
- O `AppProvider` mantém contexto compartilhado (auth, rotas, empresas, perfis) para qualquer componente client-side que consuma dados simulados ou reais.【F:app/providers.tsx†L1-L58】

## Regras de acesso e wrappers compartilhados
- A maioria das páginas protegidas utiliza `components/ProtectedRoute` para verificar papéis e permissões antes de renderizar o conteúdo.【F:components/ProtectedRoute.tsx†L1-L40】
- Fluxos autenticados incluem fallback de login responsivo, como em `components/driver/LoginScreen.tsx`, que fornece uma tela padronizada para motoristas bloqueados.【F:components/driver/LoginScreen.tsx†L1-L45】

## Principais rotas por persona
- **Admin (`app/admin/page.tsx`)** — Dashboard com KPIs, navegação lateral e gráficos via Chart.js; serve de referência para o layout de métricas corporativas.【F:app/admin/page.tsx†L1-L79】
- **Motorista (`app/motorista/page.tsx`)** — Encapsula o conteúdo em `ClientWrapper` + `ProtectedRoute` e reaproveita o login compartilhado, exigindo o papel `driver` para liberar a área autenticada.【F:app/motorista/page.tsx†L1-L25】
- **Operador (`app/operador/page.tsx`)** — Painel dedicado ao time de operações com autenticação via `ClientLoginScreen` e bloqueio por papel `operator`.【F:app/operador/page.tsx†L1-L26】
- **APIs internas (`app/api/*`)** — Rotas HTTP servidas diretamente pelo App Router; por exemplo, `app/api/vehicles/route.ts` expõe handlers `GET` e `POST` com mocks e validações de payload.【F:app/api/vehicles/route.ts†L1-L85】

## Convenções de diretório
- Pastas adicionais (`app/map`, `app/administrador`, `app/golffox`) são protótipos UI mantidos para demonstrações. Documente qualquer novo módulo adicionando um `README.md` local com requisitos de dados e dependências.
- Ao criar páginas, priorize componentes server por padrão e converta para `use client` somente quando precisar de estado ou hooks específicos.

## Próximos passos sugeridos
1. Revisar módulos duplicados (`app/administrador` vs `app/admin`) e consolidar nomenclaturas.
2. Adicionar testes de navegação para fluxos críticos (admin e motorista) usando Playwright ou Cypress.
3. Inserir comentários inline nos layouts críticos destacando provedores obrigatórios (Auth, React Query, Theme).

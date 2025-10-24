# App Router da GolfFox

Este diretório contém a aplicação Next.js moderna que unifica os dashboards do GolfFox. Use este documento como mapa rápido das rotas, provedores e convenções.

## Layout e provedores globais
- `layout.tsx` importa estilos, registra a fonte Plus Jakarta Sans e aplica camadas visuais compartilhadas antes de renderizar as páginas.【F:app/layout.tsx†L1-L44】
- `providers.tsx` expõe `AppProvider`, que injeta o contexto de dados mockados (rotas, empresas, colaboradores e perfis) e envolve o `AuthProvider` compartilhado para qualquer componente client-side.【F:app/providers.tsx†L1-L58】

## Dashboards por persona
- `admin/page.tsx` renderiza o painel executivo com KPIs, gráficos Chart.js e ações concierge, servindo de referência visual para novos módulos corporativos.【F:app/admin/page.tsx†L1-L129】
- `motorista/page.tsx`, `operador/page.tsx` e demais páginas protegidas montam o conteúdo dentro de `ClientWrapper` + `ProtectedRoute`, exigindo papéis específicos antes de liberar cada experiência.【F:app/motorista/page.tsx†L1-L25】【F:app/operador/page.tsx†L1-L26】
- Protótipos legados (`administrador/`, `golffox/`, `map/`) permanecem como referências históricas. Registre um `README.md` local sempre que um protótipo ganhar dependências exclusivas.

## Rotas de API
- `api/` organiza handlers REST para veículos, motoristas, empresas e estatísticas. Cada handler aplica `withAuth`/`withRoleAuth` para validar tokens mockados antes de processar a requisição.【F:app/api/vehicles/route.ts†L1-L102】【F:app/api/middleware.ts†L1-L80】
- O middleware comum (`api/middleware.ts`) centraliza autenticação, autorização e respostas de erro com mensagens padronizadas para ser reutilizado pelos novos endpoints.【F:app/api/middleware.ts†L1-L112】

## Convenções recomendadas
1. Crie páginas server components por padrão e aplique `'use client'` apenas onde houver hooks ou estado.
2. Centralize autenticação ou regras compartilhadas em `components/` para que novas rotas só importem wrappers já prontos.
3. Documente novas áreas com um `README.md` dentro da pasta da rota descrevendo dependências, mocks e fluxos esperados.

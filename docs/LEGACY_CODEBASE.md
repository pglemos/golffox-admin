# Guia de Código Legado e Protótipos Históricos

Embora a App Router (`app/`) seja a base atual, o repositório mantém versões anteriores e protótipos úteis para referência. Este documento aponta onde cada parte vive e como ela se relaciona com a stack moderna.

## Diretório `src/`
- Contém a implementação original em Next.js (Pages Router) com componentes, serviços e utilitários ainda utilizados por Storybooks, microfrontends Vite e ferramentas internas.【F:src/components/ui/Sidebar.tsx†L1-L160】【F:src/services/auth/authService.ts†L1-L120】
- Consulte [`src/README.md`](../src/README.md) para visão completa das subpastas, fluxo de migração e scripts úteis para manutenção.
- Os testes unitários legados residem em `src/test`, enquanto `src/scripts` guarda reescritas modernas dos scripts JavaScript históricos.

## Protótipos em `views/`
- `views/ManagementPanel.tsx`, `DriverApp.tsx`, `PassengerApp.tsx` e `ClientPortal.tsx` apresentam versões independentes das experiências principais, consumindo mocks de `constants.ts`. Eles são úteis para apresentações rápidas ou para testar componentes fora da App Router.【F:views/ManagementPanel.tsx†L1-L120】【F:views/DriverApp.tsx†L1-L80】
- Utilize [`views/README.md`](../views/README.md) para entender o objetivo de cada protótipo antes de portar funcionalidades.

## Rotas alternativas em `app/administrador` e `app/golffox`
- `app/administrador` mantém uma versão anterior do painel administrativo usando `DesignerWrapper` para exibir componentes experimentais protegidos pelo `ProtectedRoute` compartilhado.【F:app/administrador/page.tsx†L1-L24】
- `app/golffox` replica o mesmo wrapper protegido e redireciona para `/golffox` após login, servindo como ponto de entrada alternativo para demos internas do Designer.【F:app/golffox/page.tsx†L1-L22】

## Builds estáticos
- `static-site/`, `static-solution/` e `dist/` armazenam builds exportados ou alternativas geradas durante hackathons. Consulte-os quando precisar recuperar assets, CSS ou exemplos prontos para apresentações offline.
- Cada diretório possui um README (`static-site/README.md`, `static-solution/README.md`, `dist/README.md`) com contexto de uso e boas práticas de manutenção.

## Como trabalhar com o legado
1. Documente qualquer dependência entre o código legado e a App Router atual antes de remover arquivos (ex.: hooks compartilhados ou serviços comuns).
2. Ao migrar funcionalidades de `src/` para `app/`, registre o status nesta página para que futuros engenheiros saibam o que já foi portado.
3. Arquive protótipos obsoletos em branches específicos ou releases para manter a raiz do repositório mais enxuta.

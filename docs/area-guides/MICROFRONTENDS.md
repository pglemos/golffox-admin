# Guia de Microfrontends e Design System Compartilhado

Os diretórios `apps/` e `packages/shared/` formam o ecossistema de microfrontends Vite que consomem o mesmo design system utilizado pela App Router.

## Estrutura dos apps Vite (`apps/`)
- Cada subdiretório (`admin`, `driver`, `operator`, etc.) possui seu `vite.config.ts` configurado para resolver `@` para a raiz do monorepo, permitindo reutilizar código compartilhado facilmente.【F:apps/admin/vite.config.ts†L1-L18】
- Os apps funcionam como sandboxes independentes. Ao atualizar o design system, rode `pnpm install` na raiz e reinicie o servidor local de cada app para sincronizar dependências.

## Pacote compartilhado (`packages/shared/`)
- `packages/shared/ui/index.ts` exporta tema, componentes e animações a partir de um único entrypoint consumido por Next.js e Vite.【F:packages/shared/ui/index.ts†L1-L3】
- O `ThemeProvider` aplica tokens CSS dinâmicos, sincroniza preferência no `localStorage` e alterna `classList` global para suportar modo escuro/claro.【F:packages/shared/ui/theme/ThemeProvider.tsx†L1-L44】

## Boas práticas de colaboração
1. Publique alterações em `packages/shared` usando versionamento semântico (ex.: `pnpm changeset`) antes de atualizar os microfrontends.
2. Mantenha exemplos de uso dentro de cada app (ex.: `apps/admin/src/pages`) apontando para componentes reais do pacote para evitar divergência visual.
3. Documente breaking changes no design system em `packages/shared/CHANGELOG.md` e atualize rapidamente os apps dependentes.

# Pacote Compartilhado (`packages/shared`)

Este pacote concentra recursos reutilizados pelos microfrontends Vite e pela App Router. Ele é publicado localmente via workspaces do pnpm.

## Estrutura
- `ui/` expõe o design system com tema, componentes e animações disponibilizados a partir de um único entrypoint.【F:packages/shared/ui/index.ts†L1-L3】
- `ai/aiClient.ts` encapsula chamadas ao Google Gemini com fallbacks determinísticos quando a chave não estiver disponível.【F:packages/shared/ai/aiClient.ts†L1-L38】
- `supabaseClient.ts` cria clientes browser (anon) e administrativos (service role) compartilháveis em ambientes Vite ou Node.【F:packages/shared/supabaseClient.ts†L1-L20】

## Design system (`ui/`)
- `components/` reúne botões, cards, tabelas, modais e badges com exports centralizados em `components/index.ts`.【F:packages/shared/ui/components/index.ts†L1-L9】
- `theme/ThemeProvider.tsx` aplica tokens de cor, tipografia e persistência de tema claro/escuro através de contextos React.【F:packages/shared/ui/theme/ThemeProvider.tsx†L1-L44】
- `animations/` contém presets padrão para transições de entrada, listas e estados vazios usados pelos dashboards.【F:packages/shared/ui/animations/presets.ts†L1-L22】

## Boas práticas
1. Versione alterações usando Changesets antes de publicar artefatos compartilhados.
2. Sincronize componentes migrados da pasta `components/` adicionando notas de breaking change no `CHANGELOG.md` do pacote.
3. Ao introduzir novas dependências, atualize o `package.json` do pacote e evite acoplá-las diretamente nos apps que o consomem.

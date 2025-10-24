# Protótipo "golffox-admin-new"

Este projeto é um experimento isolado criado com `create-next-app` para validar a migração completa do painel administrativo para o App Router moderno. Ele não é utilizado em produção, mas serve como playground para testar conceitos antes de trazê-los para `app/`.

## Como Executar

```bash
pnpm install
pnpm dev
```

> 💡 Você pode usar `npm` ou `yarn` caso prefira outro gerenciador de pacotes.

A aplicação será servida em [http://localhost:3000](http://localhost:3000).

## Estrutura Principal

- `app/` — Páginas e rotas experimentais do painel.
- `src/` — Componentes e hooks específicos deste protótipo.
- `public/` — Assets estáticos utilizados nas telas.

## Quando Usar Este Protótipo

- Validar novas experiências de UI/UX antes de migrá-las para o monorepo principal.
- Testar configurações de build e lint sem impactar o projeto oficial.

## Próximos Passos Sugeridos

1. Portar os experimentos relevantes para `app/` ou `packages/shared/ui`.
2. Avaliar a remoção deste diretório após concluir a migração.
3. Registrar mudanças significativas em [`docs/LEGACY_CODEBASE.md`](../docs/LEGACY_CODEBASE.md).

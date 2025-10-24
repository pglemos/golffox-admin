# Microfrontends Vite (`apps/`)

Os diretórios dentro de `apps/` hospedam sandboxes independentes para cada persona. Eles reutilizam o pacote `packages/shared` e servem para validação visual rápida.

## Estrutura
- Cada app possui `vite.config.ts` com plugin React e porta dedicada para evitar conflitos ao subir múltiplas instâncias simultâneas.【F:apps/admin/vite.config.ts†L1-L19】【F:apps/carrier/vite.config.ts†L1-L9】
- `admin/src/main.tsx` (e equivalentes) montam a aplicação dentro de `React.StrictMode`, exibindo mensagens claras caso o elemento raiz não seja encontrado.【F:apps/admin/src/main.tsx†L1-L20】
- Assets, estilos e componentes específicos ficam em `src/`, permitindo experimentar variações sem afetar a App Router.

## Como executar
```bash
pnpm --filter apps/admin dev    # Admin sandbox
pnpm --filter apps/carrier dev  # Painel da transportadora
pnpm --filter apps/driver dev   # App do motorista
pnpm --filter apps/operator dev # Portal do operador
pnpm --filter apps/passenger dev # Experiência do passageiro
```

## Boas práticas
1. Sincronize dependências rodando `pnpm install` na raiz antes de iniciar qualquer sandbox.
2. Quando migrar um fluxo para a App Router, atualize este README indicando o status (ativo, legado, arquivado).
3. Utilize o design system de `packages/shared/ui` para evitar divergências visuais entre os microfrontends e a aplicação principal.

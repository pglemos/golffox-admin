# Código Legado (`src/`)

> 📦 Este diretório guarda a base da aplicação antes da migração para o App Router em `app/`. Ele permanece como referência histórica e como fonte de componentes que ainda não foram portados. Evite adicionar novas features aqui; priorize migrações para a estrutura moderna.

## Visão Geral das Pastas

| Caminho | Responsabilidade | Observações |
| --- | --- | --- |
| `components/` | Biblioteca antiga de componentes React (autenticação e UI genérica). | Alguns widgets são consumidos por `views/` e protótipos. |
| `services/` | Serviços de domínio (Supabase, mapas, relatórios, notificações). | Útil para migrar lógica de negócio para `lib/` e `services/`. |
| `scripts/` | Scripts utilitários legados (migrações, seeds, testes manuais). | Verifique antes de duplicar lógica em `scripts/` na raiz. |
| `test/` | Casos de teste isolados para APIs e hooks da estrutura antiga. | Rode apenas ao depurar regressões no código legado. |
| `types/` | Tipagens compartilhadas entre componentes e serviços antigos. | Compare com `packages/shared/types` ao migrar. |
| `utils/` | Funções auxiliares usadas pelos componentes e serviços legados. | Considere consolidar com helpers modernos em `lib/`. |
| `theme.js` | Configuração de tema antiga para Tailwind/Emotion. | Substituída pelo Design System em `packages/shared/ui`. |

## Fluxo de Migração Recomendado

1. **Mapeie dependências** com `rg "from 'src"` para identificar chamadas ativas.
2. **Avalie duplicidade**: se já existir equivalente em `app/`, remova ou marque para arquivamento.
3. **Extraia utilitários** relevantes para `lib/` ou `packages/shared/`.
4. **Atualize a documentação** em [`docs/LEGACY_CODEBASE.md`](../docs/LEGACY_CODEBASE.md) após cada limpeza.

## Scripts Úteis

- `pnpm --filter src/test test` &mdash; Executa os testes do código legado (quando configurados).
- `pnpm lint --filter src` &mdash; Verifica pendências específicas nos módulos antigos.

## Contatos / Status

- **Responsável anterior**: prototipagem inicial (2023).
- **Status atual**: apenas leitura. Use como referência até concluir a migração para `app/`.

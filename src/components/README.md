# Componentes Legados (`src/components`)

Esta pasta contém a biblioteca de componentes utilizada na versão original baseada em `pages/`. Muitos desses componentes ainda são úteis como referência visual ou base para migração, mas não devem receber novas funcionalidades.

## Estrutura

| Caminho | Descrição | Dependências principais |
| --- | --- | --- |
| `auth/` | Componentes de login, recuperação de senha e guardas de rota. | `src/services/auth`, contextos locais. |
| `ui/` | Elementos de interface genéricos (cards, tabelas, inputs) com estilização clássica. | `theme.js`, utilitários de `src/utils`. |

## Boas Práticas de Migração

1. **Conferir equivalentes modernos** em `packages/shared/ui` antes de copiar código.
2. **Isolar regras de negócio** em `services/` ou `lib/` ao portar componentes.
3. **Atualizar histórias** ou documentação relevante nos diretórios modernos (`components/`, `app/`).

## Status Atual

- Uso direto na aplicação principal: **não recomendado**.
- Uso sugerido: referência histórica, migração parcial para o design system novo.

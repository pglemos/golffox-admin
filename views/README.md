# Protótipos de Telas (`views/`)

Os arquivos deste diretório representam protótipos em React que antecederam a migração para o App Router. Eles são úteis para consultar fluxos completos antes de reproduzi-los em `app/` ou nos microfrontends de `apps/`.

## Arquivos Disponíveis

| Arquivo | Persona / Fluxo | Observações |
| --- | --- | --- |
| `ClientPortal.tsx` | Portal do cliente corporativo com visão geral da frota. | Contém exemplos de gráficos e KPIs não migrados. |
| `DriverApp.tsx` | Aplicativo simplificado para motorista. | Usa hooks antigos (`src/hooks`) e dados mockados. |
| `ManagementPanel.tsx` | Painel administrativo centralizado. | Referência para a jornada de operadores/admins. |
| `PassengerApp.tsx` | Jornada do passageiro para solicitação de viagens. | Interface baseada em componentes legados de UI. |

## Como Utilizar

1. **Leitura**: abra os arquivos para extrair fluxos ou componentes ainda não migrados.
2. **Experimentação**: copie trechos relevantes para rotas em `app/` e adapte ao design system atual.
3. **Documentação**: ao migrar um fluxo, atualize [`docs/LEGACY_CODEBASE.md`](../docs/LEGACY_CODEBASE.md) indicando que o protótipo foi substituído.

## Status

- **Produção**: não utilizado diretamente.
- **Uso recomendado**: referência e suporte a migrações.

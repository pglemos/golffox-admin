# Artefatos de Build (`dist/`)

Reúne builds estáticos gerados durante experimentos com Vite/React para o painel administrativo.

## Estrutura

- `index.html` — Entrada do build.
- `assets/` — Bundle JavaScript, CSS e imagens geradas pelo build.

## Boas Práticas

- **Não editar manualmente**: gere novamente executando o comando de build correspondente.
- **Versão de origem**: conferir o projeto que originou o bundle (geralmente `apps/admin` ou `golffox-admin-new`).
- **Limpeza**: antes de commitar novos builds, garanta que não haja arquivos obsoletos.

## Status

- Uso atual: apenas referência ou deploy estático temporário.
- Futuro: migrar pipelines definitivos para CI e remover builds manuais do repositório.

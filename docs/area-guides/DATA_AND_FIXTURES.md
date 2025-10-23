# Guia de Dados Mockados e Fontes de Conteúdo

Este guia reúne os arquivos que alimentam dashboards, tabelas e protótipos com dados fictícios. Consulte-o para localizar rapidamente seeds, constantes e scripts que sincronizam o Supabase.

## Constantes globais (`constants.ts`)
- Define empresas, passageiros, rotas, veículos e perfis de permissão usados pelos dashboards da App Router e pelos protótipos legados.【F:constants.ts†L1-L120】
- Exporta enumeradores de views (`APP_VIEWS`, `VIEWS`) e listas como `ALL_ACCESS_AREAS`, garantindo consistência entre modais e filtros.【F:constants.ts†L7-L44】

## Seeds e verificações Supabase
- `debug-data.js` conecta-se ao projeto Supabase via service role e imprime contagens de usuários, empresas, motoristas, veículos e passageiros — útil para auditorias rápidas em ambientes de homologação.【F:debug-data.js†L1-L71】
- O diretório `supabase/` contém scripts SQL (`schema.sql`, `migrations/*`) e um guia completo de configuração em `supabase/README.md` para provisionar tabelas, políticas RLS e dados iniciais.【F:supabase/README.md†L1-L88】

## Metadados da aplicação
- `metadata.json` descreve o painel (nome, descrição e permissões de geolocalização) e é consumido pela App Router e builds estáticos para preencher tags `<head>` padrão.【F:metadata.json†L1-L8】

## Dados para protótipos e microfrontends
- Os componentes em `views/` renderizam variações independentes (admin, motorista, passageiro, cliente) e normalmente consomem os mocks definidos em `constants.ts` para exibir KPIs e rotas sem depender do backend.【F:views/ManagementPanel.tsx†L1-L160】
- Serviços mockados em `services/` (ex.: `mockAnalyticsService.ts`, `mockVehicleTrackingService.ts`) geram métricas e eventos determinísticos que alimentam tanto a App Router quanto os apps Vite e Storybooks internos.【F:services/mockAnalyticsService.ts†L1-L80】【F:services/mockVehicleTrackingService.ts†L1-L160】

## Recomendações
1. Sempre sincronize alterações de schema entre `constants.ts`, `services/*` e os scripts Supabase para evitar divergências entre mocks e dados reais.
2. Registre novos arquivos de seed ou scripts utilitários neste guia e no índice `docs/README.md`.
3. Prefira organizar novos dados fictícios por domínio (ex.: `data/routes.ts`) e importá-los em `constants.ts` para manter um único ponto de entrada.

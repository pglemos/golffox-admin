# Hooks Compartilhados do GolfFox

Esta pasta concentra hooks React reutilizados por múltiplas rotas e protótipos. A tabela abaixo resume responsabilidades e dependências principais.

| Hook | Responsabilidade | Dependências | Consumidores típicos |
| --- | --- | --- | --- |
| `useAuth` | Gerencia sessão Supabase, bypass local `admin/admin`, atualização de perfil e listeners de autenticação. | `src/services/auth/authService.ts`, `@supabase/supabase-js` | Layout raiz via `AppProvider`, páginas protegidas e protótipos em `views/`.【F:hooks/useAuth.ts†L1-L118】【F:app/providers.tsx†L31-L82】 |
| `useVehicleTracking` | Mantém estado em tempo real da frota (posições, eventos, métricas). | `services/mockVehicleTrackingService.ts` | Dashboards de frota, mapas ao vivo e relatórios de operações.【F:hooks/useVehicleTracking.ts†L1-L120】【F:services/mockVehicleTrackingService.ts†L1-L160】 |
| `useAdvancedFilters` | Orquestra filtros avançados com memorização e integração ao serviço de rotas. | `services/mockRouteOptimizationService.ts` | Painel administrativo (`app/admin`), listagens de rotas e microfrontends Vite.【F:hooks/useAdvancedFilters.ts†L1-L118】【F:app/admin/page.tsx†L1-L80】 |
| `useRouteOptimization` | Solicita otimizações de trajeto e expõe status da requisição. | `services/mockRouteOptimizationService.ts` | Ferramentas de planejamento de rotas e scripts de automação. 【F:hooks/useRouteOptimization.ts†L1-L116】 |
| `useGeocoding` | Resolve endereços e coordenadas com fallback mockado. | `services/mockGeocodingService.ts` | Fluxos de cadastro/edição de rotas e painéis de mapa.【F:hooks/useGeocoding.ts†L1-L115】【F:services/mockGeocodingService.ts†L1-L120】 |
| `useNotifications` | Centraliza assinatura de alertas e broadcast de eventos do serviço de notificações. | `services/notificationService.ts` | Barras de alerta globais, toasts e dashboards de incidentes.【F:hooks/useNotifications.ts†L1-L120】【F:services/notificationService.ts†L1-L120】 |
| `useToastNotifications` | Wrapper simplificado para exibir toasts persistentes com tema unificado. | `services/notificationService.ts` | Componentes client-side que precisam disparar feedback rápido.【F:hooks/useToastNotifications.ts†L1-L120】 |
| `useAnalytics` | Recupera métricas agregadas e insights calculados pelos mocks de analytics. | `services/mockAnalyticsService.ts` | Painéis executivos e widgets de tendências.【F:hooks/useAnalytics.ts†L1-L120】【F:services/mockAnalyticsService.ts†L1-L80】 |
| `useReportExport` | Gera exportações CSV/PDF a partir dos dados atuais da UI, sinalizando progresso e erros. | `services/optimizedMapsService.ts`, `services/travelTimeService.ts` | Botões de exportação nos relatórios administrativos.【F:hooks/useReportExport.ts†L1-L116】 |
| `useTravelTime` | Calcula tempo estimado de viagem combinando dados mockados e históricos. | `services/travelTimeService.ts`, `services/mockTravelTimeService.ts` | Planejamento operacional e recomendações para motoristas.【F:hooks/useTravelTime.ts†L1-L120】【F:services/travelTimeService.ts†L1-L160】 |
| `useUserSettings` | Persiste preferências do usuário (tema, notificações, idioma) em storage local sincronizado com Supabase. | `services/supabase.ts` | Controles de preferências no painel administrativo e apps Vite.【F:hooks/useUserSettings.ts†L1-L120】【F:services/supabase.ts†L1-L160】 |

> Atualize a tabela sempre que novos hooks forem criados ou desativados. Inclua também observações sobre feature flags ou dependências externas relevantes.

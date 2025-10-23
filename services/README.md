# Serviços e Integrações do Domínio

A pasta `services/` agrupa integrações de negócios, wrappers Supabase e mocks usados em demonstrações. Consulte este arquivo antes de adicionar novos serviços.

## Mocks analíticos e telemetria
- `mockAnalyticsService.ts` gera métricas sintéticas (KPIs, tendências mensais e alertas) através de um singleton `MockAnalyticsService` reutilizado pelos dashboards.【F:services/mockAnalyticsService.ts†L1-L120】
- `mockVehicleTrackingService.ts` simula rastreamento em tempo real, armazenando localizações, emitindo eventos e controlando intervalos de atualização por veículo.【F:services/mockVehicleTrackingService.ts†L1-L110】
- `mockRouteOptimizationService.ts` e `mockTravelTimeService.ts` oferecem estimativas determinísticas para rotas e tempos de viagem, ideais para ambientes offline.【F:services/mockRouteOptimizationService.ts†L1-L80】【F:services/mockTravelTimeService.ts†L1-L80】

## Integrações externas
- `supabase.ts` instancia o cliente público com validação de variáveis de ambiente e expõe helpers CRUD para usuários, veículos e rotas com tipagens fortes.【F:services/supabase.ts†L1-L96】
- `maps.ts` centraliza chamadas à API do Google Maps, incluindo geração de polilinhas e cálculo de rotas com fallback caso a chave não esteja configurada.【F:services/maps.ts†L1-L120】
- `notificationService.ts` abstrai disparos de notificações push/tempo real e pode ser adaptado para serviços externos (Firebase, OneSignal).【F:services/notificationService.ts†L1-L120】

## Convenções de manutenção
1. Prefira mocks determinísticos (valores previsíveis) para facilitar testes automatizados e demos.
2. Exporte tipos associados ao serviço no mesmo arquivo (`VehicleLocation`, `TrackingEvent`) para padronizar consumo entre App Router e microfrontends.【F:services/mockVehicleTrackingService.ts†L1-L56】
3. Documente dependências externas (chaves, endpoints) no topo do arquivo usando comentários antes de abrir PRs.

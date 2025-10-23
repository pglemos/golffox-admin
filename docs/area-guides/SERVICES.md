# Guia de Serviços, Integrações e Mocks

Este guia apresenta a camada `lib/` (clientes globais) e `services/` (regras de domínio, integrações externas e mocks) para facilitar manutenções.

## Clientes globais (`lib/`)
- `lib/supabase.ts` valida variáveis de ambiente, instancia clientes público e administrativo e expõe helpers como `getSupabaseClient` com tipagens de tabelas compartilhadas.【F:lib/supabase.ts†L1-L86】
- `lib/ai-client.ts` encapsula chamadas ao Google Gemini, retornando fallbacks determinísticos quando a chave não está configurada e expondo helpers para rotas, eficiência e relatórios.【F:lib/ai-client.ts†L1-L120】

## Serviços de domínio (`services/`)
- `services/mockAnalyticsService.ts` gera métricas sintéticas (rotas otimizadas, tendências, alertas) para dashboards sem depender do backend.【F:services/mockAnalyticsService.ts†L1-L94】
- `services/mockVehicleTrackingService.ts` simula rastreamento veicular em tempo real com eventos, estados de frota e listeners por veículo.【F:services/mockVehicleTrackingService.ts†L1-L80】
- `services/supabase.ts` oferece CRUD tipado para usuários, veículos, rotas e passageiros reutilizado em microfrontends e automações.【F:services/supabase.ts†L1-L96】

## Boas práticas
1. Centralize chamadas externas em `services/` e mantenha `lib/` reservado para singletons/configurações globais.
2. Sempre exporte interfaces e tipos utilizados externamente (ex.: `VehicleLocation`) para evitar duplicação.
3. Ao criar mocks novos, forneça métodos determinísticos e comentários descrevendo suposições para ambientes de demonstração.

# Serviços Legados (`src/services`)

Este diretório concentra a lógica de domínio criada antes da reestruturação atual. Utilize-o como base para migrar funcionalidades para os novos módulos em `services/` (raiz) ou `lib/`.

## Índice Rápido

| Pasta / Arquivo | Responsabilidade | Observações |
| --- | --- | --- |
| `ai/` | Integrações experimentais com provedores de IA (Gemini, OpenAI). | Muitas funções foram substituídas por `lib/ai-client.ts`. |
| `analytics/` | Cálculos de métricas de viagem, custo e desempenho. | Verifique duplicidade com `services/reports`. |
| `auth/` | Fluxo de autenticação customizado (Supabase + guards). | Compare com hooks modernos em `hooks/useAuth`. |
| `core/` | Serviços compartilhados (Supabase client, storage). | Migrando gradualmente para `lib/supabase`. |
| `drivers/` | CRUD e rastreamento de motoristas. | Depende de `tracking/` e `maps/`. |
| `maps/` & `geocodingService.ts` | Consumo da Google Maps API para rotas e geocodificação. | Use como referência ao ampliar `services/maps`. |
| `notifications/` | Envio de emails/SMS mockados. | Considere portar para `services/notifications`. |
| `passengers/` | Cadastro e acompanhamento de passageiros. | Sincronizar com `app/(passenger)` durante a migração. |
| `reports/` & `reportExportService.ts` | Geração de relatórios e exportação CSV/PDF. | Boa base para o módulo moderno em `services/reports`. |
| `routes/` | Planejamento e histórico de rotas. | Depende de `utils` e `maps`. |
| `tracking/` | Atualização de localização em tempo real. | Combine com Realtime em `services/tracking`. |
| `transportadora/` | Funcionalidades específicas para operadora de transporte. | Avalie relevância antes de portar. |
| `vehicles/` | Cadastro e status de veículos. | Revisar integrações com Supabase antes de migrar. |

## Boas Práticas

1. **Isolar dependências**: ao migrar, mova clientes externos para `lib/` e mantenha as funções puras nos novos `services/`.
2. **Adicionar testes** em `services/__tests__` (raiz) sempre que portar lógica crítica.
3. **Atualizar a documentação** em [`docs/area-guides/SERVICES.md`](../../docs/area-guides/SERVICES.md) após mover funcionalidades.

## Status

- **Uso atual**: referências pontuais em protótipos.
- **Prioridade**: alta para migração gradual e remoção quando não houver mais dependências.

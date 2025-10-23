# Guia de Estado Global e Hooks Compartilhados

Este guia ajuda a localizar os hooks React e provedores de estado que conectam a App Router, serviços Supabase e fluxos legados. Use-o quando precisar entender onde buscar dados em memória ou como compartilhar contexto entre páginas.

## Provedores centrais (`app/providers.tsx`)
- O `AppProvider` combina autenticação, dados de empresas, rotas e preferências de UI em um único wrapper aplicado ao layout raiz da App Router.【F:app/providers.tsx†L1-L82】
- Internamente ele injeta `QueryClientProvider`, `ThemeProvider` e o `AuthProvider` definido em `hooks/useAuth.ts`, garantindo caches e sessões consistentes em toda a aplicação.【F:app/providers.tsx†L31-L82】

## Hooks reativos em `hooks/`
- `useAuth` expõe estado de usuário, sessão e operações de login/logout baseadas em Supabase ou no bypass local `admin/admin`, servindo como fonte única de verdade para a UI autenticada.【F:hooks/useAuth.ts†L1-L118】
- `useVehicleTracking` encapsula o fluxo de rastreamento em tempo real consumindo o serviço de telemetria e emitindo atualizações para dashboards de frota.【F:hooks/useVehicleTracking.ts†L1-L120】
- `useAdvancedFilters`, `useRouteOptimization` e `useGeocoding` fazem ponte com serviços de otimização e mapas (`services/*`), mantendo loading states e resultados memorizados prontos para reuso em múltiplas páginas.【F:hooks/useAdvancedFilters.ts†L1-L118】【F:hooks/useRouteOptimization.ts†L1-L116】【F:hooks/useGeocoding.ts†L1-L115】
- `useNotifications` e `useToastNotifications` centralizam alertas em tempo real, permitindo que qualquer rota dispare toasts ou registre listeners sem replicar lógica de sockets.【F:hooks/useNotifications.ts†L1-L120】【F:hooks/useToastNotifications.ts†L1-L120】

## Estado legado em `src/`
- O `AuthService` em `src/services/auth/authService.ts` continua responsável por sincronizar sessões Supabase, carregar perfis e notificar listeners em tempo real para hooks e microfrontends legados.【F:src/services/auth/authService.ts†L1-L120】
- Hooks que vivem em `src/components` e `src/utils` ainda consomem esse serviço via `useAuth` para manter compatibilidade com as versões anteriores do painel.

## Boas práticas
1. Prefira importar hooks diretamente de `hooks/` ao criar novas rotas na App Router. Eles já tratam caches, erros e estado de carregamento.
2. Quando adicionar um hook novo, atualize este arquivo e o `hooks/README.md` para registrar intenções, dependências externas e cenários de uso.
3. Antes de migrar código legado em `src/`, verifique se o `AuthService` oferece os mesmos métodos ou se é necessário criar adaptadores temporários.

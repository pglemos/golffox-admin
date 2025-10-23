# Biblioteca de Componentes Compartilhados

A pasta `components/` concentra blocos React reutilizados pela App Router e pelos protótipos legados. Utilize esta visão geral para localizar rapidamente wrappers, telas por persona e utilidades de UI.

## Camada de autenticação e wrappers
- `ProtectedRoute.tsx` consulta `useAuth` para bloquear acesso por papel e oferece fallbacks quando o usuário não atende aos requisitos.【F:components/ProtectedRoute.tsx†L1-L37】
- `ClientWrapper.tsx` garante que componentes client-side só sejam montados após a hidratação, exibindo um loader padrão enquanto isso.【F:components/ClientWrapper.tsx†L1-L20】

## Telas específicas por persona
- `driver/LoginScreen.tsx` entrega o fluxo de login responsivo do motorista com validação visual, CTA animado e assets corporativos.【F:components/driver/LoginScreen.tsx†L1-L45】
- `client/ClientLoginScreen.tsx` valida credenciais mockadas de operadores e exibe feedback de carregamento/erros antes de liberar o painel.【F:components/client/ClientLoginScreen.tsx†L1-L86】
- A subpasta `passenger/` mantém experiências focadas em embarque, enquanto `client/` hospeda dashboards e navegação para o time de operações.【F:components/passenger/PassengerHome.tsx†L1-L120】【F:components/client/ClientDashboard.tsx†L1-L160】

## Utilidades de UI
- `ui/Navbar.tsx` combina alternância de tema, rotas condicionais por papel e menu mobile controlado por estado local.【F:components/ui/Navbar.tsx†L1-L120】
- `ui/ThemeToggle.tsx` e `icons/` expõem elementos visuais compartilhados entre App Router e microfrontends.【F:components/ui/ThemeToggle.tsx†L1-L80】

## Convenções de manutenção
1. Cada nova subpasta deve vir com um `README.md` explicando dependências externas (APIs, hooks, assets). Use este arquivo como modelo.
2. Prefira exports nomeados por domínio (ex.: `components/auth/index.ts`) para facilitar importação seletiva.
3. Ao migrar componentes para `packages/shared/ui`, atualize esta página e remova duplicações do diretório legado.

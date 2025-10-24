# Guia da Biblioteca de Componentes

A pasta `components/` concentra blocos reutilizáveis compartilhados entre as rotas da App Router e protótipos legados. Use este guia para localizar rapidamente componentes críticos.

## Núcleo de autenticação e wrappers
- `components/ProtectedRoute.tsx` restringe o acesso por papel/permissão e provê fallbacks customizados para fluxos sem sessão.【F:components/ProtectedRoute.tsx†L1-L40】
- `components/ClientWrapper.tsx` garante montagem apenas após a hidratação no cliente, exibindo fallback enquanto o React monta; reutilize-o ao criar fluxos client-side.【F:components/ClientWrapper.tsx†L1-L20】

## Telas de login por persona
- **Motorista** — `components/driver/LoginScreen.tsx` exibe inputs responsivos e CTA animado para desbloquear a área do motorista.【F:components/driver/LoginScreen.tsx†L1-L45】
- **Operador** — `components/client/ClientLoginScreen.tsx` realiza validação de credenciais simulada com feedback de loading e erros para operadores.【F:components/client/ClientLoginScreen.tsx†L1-L86】

## Navegação global
- `components/ui/Navbar.tsx` oferece menu adaptativo com toggler mobile, integração com `useAuth` e troca de tema, servindo de referência para futuros cabeçalhos.【F:components/ui/Navbar.tsx†L1-L120】

## Convenções de extensão
- Mantenha componentes com estado em arquivos `*.tsx` e prefira nomear pastas por domínio (`driver`, `passenger`, `auth`).
- Cada subpasta deve conter um `README.md` descrevendo dependências específicas (ex.: assets ou hooks externos). Caso inexistente, inclua-o ao adicionar novos componentes.

## Ações sugeridas
1. Extrair tipagens inline de `ClientLoginScreen` para `src/types` e substituir `any` por interfaces fortes.
2. Consolidar variações de login em um diretório `components/auth/` com exports centralizados.
3. Adicionar storybooks ou docs MDX na pasta `components/docs` para facilitar QA visual.

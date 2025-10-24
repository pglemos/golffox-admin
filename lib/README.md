# Clientes Compartilhados (`lib/`)

A camada `lib/` centraliza singletons e utilidades globais utilizados pela App Router, scripts e microfrontends.

## Supabase
- `supabase.ts` valida as variáveis de ambiente, cria clientes público e administrativo e expõe `getSupabaseClient` para escolher o contexto correto em tempo de execução.【F:lib/supabase.ts†L1-L54】
- `supabase-server.ts` instancia um client exclusivo para uso server-side com a service role e headers padronizados (útil em rotas API).【F:lib/supabase-server.ts†L1-L40】

## React Query
- `react-query.ts` define chaves (`queryKeys`) e opções padrão (`queryOptions`) para mapas e veículos, evitando duplicação entre hooks.【F:lib/react-query.ts†L1-L20】

## Integração com Gemini
- `ai-client.ts` abstrai as chamadas ao Google Generative AI, mantendo fallbacks para sugestões de rota, análises de eficiência e relatórios quando a chave não estiver presente.【F:lib/ai-client.ts†L1-L84】【F:lib/ai-client.ts†L85-L140】

## Convenções
1. Sempre importe estes clientes a partir de `lib/` em vez de duplicar configurações dentro de componentes.
2. Para novos serviços externos, siga o padrão de expor fallbacks determinísticos e validação de ambiente logo no início do arquivo.
3. Documente qualquer função helper pública adicionando comentários JSDoc para facilitar o consumo por scripts e microfrontends.

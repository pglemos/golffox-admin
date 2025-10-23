# API Administrativa (`api/`)

A pasta `api/` concentra um serviço Hono/Node voltado para tarefas administrativas:
provisionamento do banco Supabase, execução de scripts SQL e exposições pontuais de
endpoints protegidos. Utilize este pacote quando precisar interagir com o banco fora da
aplicação Next.js ou automatizar rotinas de infraestrutura.

## 📦 Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/index.ts` | Define o servidor Hono, middlewares padrão, health-checks e rotas administrativas (`/admin/setup`, `/admin/trips`, `/ai/suggest`). |
| `src/dbSetup.ts` | Utilitários para executar `schema.sql`, políticas RLS e seeds diretamente no banco Supabase usando credenciais de serviço. |
| `src/setup-runner.ts` | Entrypoint auxiliar que permite rodar `runSetup()` via CLI ou em pipelines.
| `package.json` | Scripts dedicados (`dev`, `start`, `setup`) e dependências Node isoladas do front-end. |

## ▶️ Executando Localmente

```bash
cd api
pnpm install # ou npm install
pnpm dev     # inicia em modo watch na porta 8787
```

Variáveis de ambiente esperadas:

- `PORT` – porta de escuta (padrão: `8787`).
- `SETUP_TOKEN` – token obrigatório para chamar `/admin/setup` em ambientes compartilhados.
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE` – necessários para ler dados via `/admin/trips`.
- `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT`, `SUPABASE_DB_NAME`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD` – usados por `dbSetup.ts` para executar SQL direto no banco.
- `VITE_GEMINI_API_KEY` ou `GEMINI_API_KEY` – habilita respostas reais em `/ai/suggest`.

Dica: copie o `.env.example` da raiz, renomeie para `api/.env`, e acrescente o `SETUP_TOKEN` e as credenciais de serviço.

## 🔌 Endpoints Disponíveis

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Banner com metadados do serviço e endpoints publicados. |
| `GET` | `/health` | Health-check simples (retorna `{ ok: true }`). |
| `POST` | `/admin/setup` | Executa `runSetup()` aplicando schema, políticas RLS e seed (requer `x-setup-token`). |
| `GET` | `/admin/trips` | Consulta a tabela `trips` usando a chave `service_role` do Supabase. |
| `POST` | `/ai/suggest` | Endpoint experimental de IA (mockado se nenhuma chave Gemini estiver configurada). |

> 💡 Em pipelines CI/CD, exporte `AUTO_DB_SETUP=true` para que `runSetup()` seja executado automaticamente na inicialização do servidor.

## 🤝 Integração com a App Router

- O middleware Next.js (`middleware.ts`) já trata CORS para permitir chamadas da App Router.
- Serviços em `lib/supabase.ts` e `services/supabase.ts` compartilham as mesmas variáveis de ambiente, garantindo consistência entre API e frontend.
- Scripts em [`scripts/`](../scripts/README.md) reutilizam os helpers de `api/src/dbSetup.ts` para manter uma única fonte de verdade sobre o provisionamento do banco.

Mantendo este guia atualizado, engenheiros conseguem levantar o serviço rapidamente, depurar chamadas administrativas e ajustar o provisionamento do Supabase sem expor segredos sensíveis.

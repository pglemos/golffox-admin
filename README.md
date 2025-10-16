# Golffox Platform

Plataforma SaaS para gestão de transporte executivo construída com Next.js 14, Supabase e uma arquitetura modular orientada a recursos. Esta versão consolida o código legado em uma base moderna, com validação rígida de ambiente, autenticação real via Supabase, UI responsiva com Tailwind e pipelines de qualidade prontos para produção.

## ✨ Principais capacidades

- **Autenticação segura** via Supabase Auth com gerenciamento de sessão e controle de acesso por perfil.
- **Dashboard executivo** com KPIs em tempo real, telemetria de rotas e visão das atividades recentes.
- **Landing page institucional** otimizada para conversão, destacando diferenciais do produto.
- **Estrutura modular** em `src/` com separação clara entre `app`, `features`, `components`, `lib` e `providers`.
- **Observabilidade pronta** com logger estruturado e validação de variáveis de ambiente usando Zod.
- **Qualidade automatizada**: ESLint estrito, Prettier com ordenação Tailwind, Vitest e lint-staged.

## 🗂️ Estrutura de pastas

```
src/
├── app/                    # App Router (marketing, auth e dashboard)
│   ├── (marketing)/         # Landing page e layout público
│   ├── (auth)/              # Fluxo de autenticação
│   ├── (dashboard)/         # Rotas protegidas por autenticação
│   └── api/                 # Route Handlers (ex.: /api/health)
├── components/             # Design system reutilizável
├── features/               # Módulos de domínio (auth, dashboard, ...)
├── lib/                    # Infraestrutura (env, supabase, logging)
├── providers/              # Providers globais (Theme, Query, Auth)
├── utils/                  # Funções utilitárias compartilhadas
└── tests/                  # Testes automatizados (Vitest)
```

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js 20+
- npm 10+
- Conta Supabase com as tabelas `users`, `vehicles`, `drivers`, `passengers` e `routes`

### Passos

1. **Instale dependências**
   ```bash
   npm install
   ```

2. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Preencha NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Execute em modo desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Rodando lint, testes e build**
   ```bash
   npm run lint
   npm run test
   npm run build && npm start
   ```

> ⚠️ Em ambientes restritos (ex.: sandboxes sem acesso ao npm registry) a instalação de pacotes pode falhar. Nesse caso, utilize uma máquina local ou CI com acesso liberado.

## 🔐 Variáveis de ambiente

As chaves abaixo já estão preenchidas em `.env.example` com os valores oficiais do projeto **Golf Fox** configurado no Supabase (ID `oulwcijxeklxllufyofb`).

| Chave                              | Tipo     | Descrição                                                |
|------------------------------------|----------|----------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`         | Pública  | URL do projeto Supabase                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | Pública  | Chave anônima para chamadas client-side                  |
| `SUPABASE_SERVICE_ROLE_KEY`        | Servidor | Chave de serviço utilizada nos loaders do dashboard      |
| `SUPABASE_JWT_SECRET`              | Servidor | Segredo JWT legado para integrações que validam tokens   |

Todos os valores são validados automaticamente em runtime por `src/lib/env.ts`. Builds quebram caso alguma chave obrigatória esteja ausente.

> ℹ️ Chaves adicionais compartilhadas pelo time
>
> - `sb_publishable_KuhGZHumWxcfJsyiho1t0w_nxWcQFZk` (publishable)
> - `sb_secret_7ZE4rVymjC79NLgWHcnbew_iWecDlKR` (secret)
>
> Configure-as diretamente no painel do Supabase apenas se for utilizar integrações de billing.

### Configurando no Vercel

1. No terminal, autentique a conta que possui acesso à equipe **SynVolt Projetos**:
   ```bash
   vercel login
   vercel switch --scope team_9kUTSaoIkwnAVxy9nXMcAnej
   ```
2. Dentro do diretório do projeto, execute:
   ```bash
   vercel env pull .env
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add SUPABASE_JWT_SECRET production
   ```
   Utilize os valores presentes em `.env.example` ao responder os prompts.
3. Repita os mesmos comandos para o ambiente `preview` caso utilize PRs.
4. Finalize o deploy com `vercel --scope team_9kUTSaoIkwnAVxy9nXMcAnej`.

## 🗄️ Banco de dados oficial

- Execute `supabase/schema.sql` no projeto `oulwcijxeklxllufyofb` para recriar o schema público com os enums atualizados (`user_role`, `vehicle_status`, `route_status`), as tabelas esperadas pelo dashboard e registros de demonstração.
- Em seguida aplique `supabase/fixed_rls_policies.sql` para restabelecer as políticas Row Level Security (acesso por empresa, operadores e administradores).
- Crie o usuário `admin@golffox.com` pelo Supabase Auth e sincronize a tabela `users` com o `User ID` retornado para liberar o login administrativo.

## 🧪 Testes

- `npm run test` — executa a suíte do Vitest
- `npm run lint` — verifica padrões com ESLint
- `npm run format` — aplica Prettier

Os commits são protegidos por lint-staged (via `npm run prepare`) garantindo código formatado e sem erros antes de subir para o repositório.

## 📦 Scripts úteis

| Script          | Ação                                                                              |
|-----------------|-----------------------------------------------------------------------------------|
| `npm run dev`   | Next.js em modo desenvolvimento com Turbo                                       |
| `npm run build` | Build otimizado para produção                                                     |
| `npm run start` | Servidor Next.js em modo produção                                                 |
| `npm run lint`  | ESLint com regras estritas                                                        |
| `npm run test`  | Testes unitários com Vitest                                                       |
| `npm run format`| Formata código com Prettier                                                       |
| `npm run typecheck` | Valida tipos com TypeScript                                                   |

## 🤝 Contribuição

1. Crie uma branch a partir de `main`.
2. Execute `npm run lint && npm run test` antes do commit.
3. Abra um Pull Request descrevendo contexto, validações e screenshots (quando aplicável).

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para o fluxo completo.

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).

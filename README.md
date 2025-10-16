# GolfFox - Sistema de Gerenciamento de Transporte Executivo

O GolfFox é uma plataforma web desenvolvida com Next.js e TypeScript para gerenciamento de transporte executivo, oferecendo interfaces específicas para motoristas, passageiros, operadores, transportadoras e administradores, com recursos de rastreamento em tempo real, agendamento de viagens, checklist digital e análise inteligente de dados.

## 🚀 Funcionalidades

### Painel do Motorista
- Visualização de viagens agendadas
- Navegação em tempo real com Google Maps
- Atualização de status de viagens
- Histórico de viagens realizadas

### Painel do Passageiro
- Solicitação de viagens
- Acompanhamento em tempo real
- Histórico de viagens
- Avaliação de motoristas

### Painel do Operador
- Gerenciamento de rotas
- Alocação de motoristas
- Monitoramento de viagens em tempo real
- Atendimento a solicitações de passageiros

### Painel Administrativo
- Gerenciamento de usuários (motoristas, passageiros e operadores)
- Controle de frota
- Análise de dados e relatórios
- Configurações do sistema e orquestração das políticas de acesso

### Painel da Transportadora (Carrier)
- Visão consolidada da frota e do status dos veículos
- Painel de eficiência com indicadores alimentados pela IA Gemini
- Acompanhamento dos motoristas em campo com atualizações Realtime

## 🛠️ Tecnologias

- **Frontend**: Next.js 15 (compatível com 13+), React 19, TypeScript
- **Estilização**: Tailwind CSS 4, Framer Motion e Design System unificado em [`packages/shared/ui`](./packages/shared/ui)
- **Autenticação**: Supabase Auth com RLS ativado
- **Banco de Dados**: Supabase (PostgreSQL) com migrações em [`supabase/migrations`](./supabase/migrations)
- **Mapas e Geolocalização**: Google Maps API com suporte a temas dinâmicos
- **IA Generativa**: Google Gemini via [`lib/ai-client.ts`](./lib/ai-client.ts) com fallback automático
- **State Management**: Zustand/Context API por módulo
- **Testes**: Vitest + React Testing Library

## 📋 Pré-requisitos

- Node.js 20.x ou superior (18.x suportado)
- pnpm 9.x **ou** npm 10.x
- Conta no Supabase com o projeto já configurado
- Chave de API do Google Maps (Maps JavaScript API, Geocoding API e Directions API habilitadas)

Para habilitar os módulos premium (Gemini, mapas avançados e realtime multi-painel) copie o arquivo [.env.example](./.env.example) e preencha as chaves indicadas.

## 🔧 Instalação e Configuração

### Instalação Local

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/golffox.git
cd golffox
```

2. Instale as dependências (escolha seu gerenciador preferido)
```bash
# pnpm
pnpm install

# npm
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais
```

4. Execute o projeto em modo de desenvolvimento
```bash
# pnpm
pnpm run dev

# npm
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Configuração no Replit

1. Importe o projeto para o Replit
2. Configure os Secrets no painel do Replit:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave de API do Google Maps
3. Execute o projeto clicando no botão "Run"

## 🗄️ Estrutura do Projeto

```
/
├── app/                  # Código da aplicação Next.js
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página inicial
│   └── providers.tsx     # Provedores de contexto globais
├── components/           # Componentes React legados
├── packages/
│   └── shared/ui/        # Design System premium compartilhado (tokens, temas e componentes)
├── hooks/                # Hooks personalizados
├── services/             # Serviços e APIs externos
├── public/               # Arquivos estáticos
├── supabase/             # Migrações, seeds e scripts auxiliares
├── scripts/              # Automação (deploy, push, etc.)
├── .env.example          # Exemplo de variáveis de ambiente
├── package.json          # Dependências e scripts
└── README.md             # Documentação principal
```

## 🎨 Design System Premium

O design system está centralizado em [`packages/shared/ui`](./packages/shared/ui) e fornece:

- Tokens de cor, tipografia, sombras e raios configurados em [`theme`](./packages/shared/ui/theme)
- Provedor de tema com detecção automática de claro/escuro
- Componentes animados (botões, cards, tabelas com skeleton, sidebars responsivas, modais, badges de status) prontos para reutilização
- Animações reutilizáveis em [`animations`](./packages/shared/ui/animations)

## 🗄️ Migrações do Supabase

O diretório [`supabase/migrations`](./supabase/migrations) contém scripts SQL prontos para serem executados no projeto Supabase oficial. O arquivo [`20250125_golffox_core.sql`](./supabase/migrations/20250125_golffox_core.sql) cria as tabelas principais (companies, carriers, drivers, passengers, vehicles, routes, trips, driver_positions e checklists), ativa o RLS com políticas baseadas em papéis, ativa Realtime e adiciona seeds iniciais.

> 💡 Dica rápida: abra o SQL Editor do Supabase, cole o conteúdo do arquivo de migração e execute-o no banco de dados `postgres`. Em seguida, verifique as publicações Realtime no menu Database > Replication.

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev
npm run dev

# Build para produção
pnpm build
npm run build

# Iniciar em modo produção
pnpm start
npm run start

# Verificar e corrigir problemas de código
pnpm lint
npm run lint

# Verificar conexão com Supabase
pnpm verify-supabase
npm run verify-supabase
pnpm db:status
npm run db:status

# Configurar projeto (scripts utilitários)
pnpm setup-project
npm run setup-project
pnpm db:setup
npm run db:setup

# Criar banco de dados (verifica dependências)
pnpm db:create
npm run db:create
```

## 🔄 Publicando no GitHub

Para replicar este código no repositório oficial do GitHub (`https://github.com/pglemos/golffox-replit`), utilize o script auxiliar incluído em [`scripts/push-to-github.sh`](./scripts/push-to-github.sh):

1. Gere um token pessoal do GitHub com permissão `repo` e autentique-se com `gh auth login` (ou configure o `git` com `git config --global user.name` e `git config --global user.email`).
2. Do diretório raiz do projeto, execute:

   ```bash
   ./scripts/push-to-github.sh https://github.com/pglemos/golffox-replit.git
   ```

O script garante que o `remote` `origin` aponte para o repositório informado e executa `git push -u origin HEAD`, publicando o branch atual diretamente no GitHub.

## 🤝 Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para obter informações sobre como contribuir para o projeto.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

## 📞 Suporte

Para suporte, envie um email para support@golffox.com ou abra uma issue no repositório.

# GolfFox - Sistema de Gerenciamento de Transporte Executivo

O GolfFox é uma plataforma web desenvolvida com Next.js e TypeScript para gerenciamento de transporte executivo, oferecendo interfaces específicas para motoristas, passageiros, operadores e administradores, com recursos de rastreamento em tempo real, agendamento de viagens e análise de dados.

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
- Configurações do sistema

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4, Framer Motion, Design System unificado em [`packages/shared/ui`](./packages/shared/ui)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Mapas e Geolocalização**: Google Maps API
- **IA Generativa**: Google Gemini via [`lib/ai-client.ts`](./lib/ai-client.ts) com fallback automático
- **Gráficos**: Chart.js

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- pnpm 9.x ou npm 10.x
- Conta no Supabase
- Chave de API do Google Maps (com Maps JavaScript API, Geocoding API e Directions API habilitadas)

Para habilitar os módulos premium (Gemini e realtime multi-painel) copie o arquivo [.env.example](./.env.example) e preencha as chaves indicadas.

## 🔧 Instalação e Configuração

### Instalação Local

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/golffox.git
cd golffox
```

2. Instale as dependências
```bash
pnpm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais
```

4. Execute o projeto em modo de desenvolvimento
```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000`

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
│   └── providers.tsx     # Provedores de contexto
├── components/           # Componentes React legados
├── packages/
│   └── shared/ui/        # Design System premium compartilhado (tokens, temas e componentes)
├── hooks/                # Hooks personalizados
├── services/             # Serviços e APIs
├── public/               # Arquivos estáticos
├── .env.example          # Exemplo de variáveis de ambiente
├── .replit               # Configuração do Replit
├── package.json          # Dependências e scripts
└── README.md             # Documentação principal
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar em modo produção
pnpm start

# Verificar e corrigir problemas de código
pnpm lint

# Verificar conexão com Supabase
pnpm verify-supabase
pnpm db:status

# Configurar projeto (scripts utilitários)
pnpm setup-project
pnpm db:setup

# Criar banco de dados (verifica dependências)
pnpm db:create
```

## 🗄️ Migrações do Supabase

O diretório [`supabase/migrations`](./supabase/migrations) contém scripts SQL prontos para serem executados no projeto Supabase oficial. O arquivo [`20250125_golffox_core.sql`](./supabase/migrations/20250125_golffox_core.sql) cria as tabelas principais (companies, carriers, drivers, passengers, vehicles, routes, trips, driver_positions e checklists), ativa o RLS com políticas baseadas em papéis e adiciona as tabelas de realtime à publicação padrão.

> 💡 Dica rápida: abra o SQL Editor do Supabase, cole o conteúdo do arquivo de migração e execute-o no banco de dados `postgres`. Em seguida, verifique as publicações realtime no menu Database > Replication.

## 🤝 Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para obter informações sobre como contribuir para o projeto.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

## 📞 Suporte

Para suporte, envie um email para support@golffox.com ou abra uma issue no repositório.
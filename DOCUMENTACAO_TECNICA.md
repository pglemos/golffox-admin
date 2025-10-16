# 📚 Documentação Técnica - GolfFox

Este documento consolida toda a documentação técnica do sistema GolfFox, incluindo guias de instalação, configuração, APIs e estrutura do projeto.

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [APIs e Serviços](#apis-e-serviços)
5. [Banco de Dados](#banco-de-dados)
6. [Scripts Disponíveis](#scripts-disponíveis)
7. [Testes](#testes)
8. [Deploy](#deploy)
9. [Suporte e Contato](#suporte-e-contato)

## 🌐 Visão Geral do Sistema

O GolfFox é uma plataforma web desenvolvida com Next.js e TypeScript para gerenciamento de transporte executivo, oferecendo interfaces específicas para motoristas, passageiros, operadores e administradores, com recursos de rastreamento em tempo real, agendamento de viagens e análise de dados.

### Módulos Principais

#### Painel do Motorista
- Visualização de viagens agendadas
- Navegação em tempo real com Google Maps
- Atualização de status de viagens
- Histórico de viagens realizadas
- Sistema de checklist pré-viagem
- Geolocalização em tempo real

#### Painel do Passageiro
- Solicitação de viagens
- Acompanhamento em tempo real
- Histórico de viagens
- Avaliação de motoristas
- Gestão de endereços favoritos
- Contato direto com motorista

#### Painel do Operador
- Gerenciamento de rotas
- Alocação de motoristas
- Monitoramento de viagens em tempo real
- Atendimento a solicitações de passageiros

#### Painel Administrativo
- Gerenciamento de usuários (motoristas, passageiros e operadores)
- Controle de frota
- Análise de dados e relatórios
- Configurações do sistema

### Tecnologias Utilizadas

- **Frontend**: Next.js 13, React 18, TypeScript
- **Estilização**: Tailwind CSS, Framer Motion
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Mapas e Geolocalização**: Google Maps API
- **Gráficos**: Chart.js

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior
- Conta no Supabase
- Chave de API do Google Maps (com Maps JavaScript API, Geocoding API e Directions API habilitadas)

### Instalação Local

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/golffox.git
cd golffox
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais
```

4. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Configuração no Replit

1. Importe o projeto para o Replit

2. Configure os Secrets no painel do Replit:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave de API do Google Maps

3. Execute o projeto clicando no botão "Run"

### Configuração do Banco de Dados Supabase

#### Opção A: Configuração Automática (Recomendada)

Execute o script de verificação para testar a conexão:
```bash
npm run verify-supabase
```

Se houver problemas, siga para a **Opção B**.

#### Opção B: Configuração Manual

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione o projeto **Golffox** (ou crie um novo)
3. Vá para **SQL Editor**
4. Execute os scripts na seguinte ordem:

**Primeiro - Schema do Banco:**
```sql
-- Copie e cole todo o conteúdo de: supabase/schema.sql
```

**Segundo - Políticas de Segurança:**
```sql
-- Copie e cole todo o conteúdo de: supabase/rls_policies.sql
```

### Configuração de Dados Iniciais

Execute o script de configuração do projeto:
```bash
npm run setup-project
```

Este script irá:
- ✅ Verificar se o Supabase está configurado
- ✅ Criar usuário administrador de teste
- ✅ Inserir dados de exemplo (motorista, veículo, rota, passageiro)

### Credenciais de Acesso

Após executar o `setup-project`, você terá:

**Usuário Administrador:**
- Email: `admin@golffox.com`
- Senha: `admin123456`

## 📁 Estrutura do Projeto

```
/
├── app/                  # Código da aplicação Next.js
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página inicial
│   └── providers.tsx     # Provedores de contexto
├── components/           # Componentes React
├── hooks/                # Hooks personalizados
├── services/             # Serviços e APIs
├── public/               # Arquivos estáticos
├── .env.example          # Exemplo de variáveis de ambiente
├── .replit               # Configuração do Replit
├── package.json          # Dependências e scripts
└── README.md             # Documentação principal
```

### Estrutura de Diretórios Detalhada

#### `/app`
Contém a estrutura de roteamento do Next.js 13 com App Router:

- `/admin` - Interface administrativa
- `/motorista` - Interface do motorista
- `/passageiro` - Interface do passageiro
- `/operador` - Interface do operador
- `/transportadora` - Interface da transportadora

#### `/components`
Componentes React reutilizáveis organizados por funcionalidade:

- `/auth` - Componentes de autenticação
- `/maps` - Componentes relacionados a mapas
- `/ui` - Componentes de interface genéricos
- `/forms` - Formulários reutilizáveis

#### `/hooks`
Hooks personalizados para lógica reutilizável:

- `useAuth.ts` - Gerenciamento de autenticação
- `useGeocoding.ts` - Serviços de geocodificação
- `useRouteOptimization.ts` - Otimização de rotas
- `useTravelTime.ts` - Cálculo de tempo de viagem

#### `/services`
Serviços e integrações com APIs externas:

- `supabase.ts` - Cliente Supabase
- `maps.ts` - Integração com Google Maps

## 🌐 APIs e Serviços

### Autenticação

Todas as APIs protegidas requerem autenticação via JWT token no header:

```http
Authorization: Bearer <jwt_token>
```

### Obter Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "role": "admin"
  },
  "session": {
    "access_token": "jwt_token_aqui",
    "refresh_token": "refresh_token_aqui",
    "expires_at": 1234567890
  }
}
```

### API do Painel Administrativo

#### GET /api/admin
**Acesso:** `admin`  
**Descrição:** Obter dados do dashboard administrativo

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "companies": { "total": 10, "active": 8, "inactive": 2 },
      "drivers": { "total": 50, "active": 45, "inactive": 5 },
      "vehicles": { "total": 30, "active": 25, "maintenance": 3, "garage": 2 },
      "routes": { "total": 20, "onTime": 15, "delayed": 3, "problems": 2 },
      "users": {
        "total": 100,
        "active": 95,
        "byRole": { "admin": 2, "operator": 8, "driver": 50, "passenger": 40 }
      }
    }
  }
}
```

### API do Painel do Operador

#### GET /api/operador
**Acesso:** `operator`, `admin`  
**Descrição:** Obter dados do dashboard do operador

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "employees": { "total": 40, "active": 38, "inactive": 2 },
      "routes": { "total": 5, "onTime": 4, "delayed": 1, "problems": 0 },
      "vehicles": { "total": 8, "active": 6, "stopped": 2, "problems": 0 },
      "drivers": { "total": 10, "active": 9, "inactive": 1 }
    }
  }
}
```

### API de Mapas e Rotas

#### POST /api/maps/optimize-route
**Acesso:** `operator`, `admin`  
**Descrição:** Otimizar rota com múltiplos pontos

**Requisição:**
```json
{
  "waypoints": [
    {"address": "Ponto A", "coordinates": {"lat": -23.5505, "lng": -46.6333}},
    {"address": "Ponto B", "coordinates": {"lat": -23.5600, "lng": -46.6400}}
  ]
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "optimizedRoute": [...],
    "totalDistance": "10.5 km",
    "totalDuration": "25 min",
    "directions": [...]
  }
}
```

## 🗄️ Banco de Dados

### Tabelas Principais
- **companies** - Empresas cadastradas
- **users** - Usuários do sistema
- **drivers** - Motoristas com documentação
- **vehicles** - Veículos da frota
- **passengers** - Passageiros das rotas
- **routes** - Rotas de transporte

### Tabelas de Controle
- **alerts** - Alertas do sistema
- **route_history** - Histórico das rotas
- **vehicle_locations** - Localização em tempo real
- **driver_performance** - Performance dos motoristas
- **cost_control** - Controle de custos
- **permission_profiles** - Perfis de permissão

### Roles de Usuário
- `admin` - Acesso total ao sistema
- `operator` - Gestão de funcionários da empresa
- `driver` - Interface do motorista
- `passenger` - Interface do passageiro

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em modo produção
npm run start

# Verificar e corrigir problemas de código
npm run lint

# Formatar código com Prettier
npm run format

# Verificar conexão com Supabase
npm run verify-supabase
npm run db:status

# Configurar projeto
npm run setup-project
npm run db:setup

# Criar banco de dados
npm run db:create
```

### Scripts Adicionais

```json
{
  "dev": "next dev -p 5000 -H 0.0.0.0",
  "admin": "next dev -p 5001 -H 0.0.0.0",
  "operador": "next dev -p 5002 -H 0.0.0.0",
  "transportadora": "next dev -p 5003 -H 0.0.0.0",
  "motorista": "next dev -p 5004 -H 0.0.0.0",
  "passageiro": "next dev -p 5005 -H 0.0.0.0",
  "dev:all": "concurrently \"npm run admin\" \"npm run operador\" \"npm run transportadora\" \"npm run motorista\" \"npm run passageiro\"",
  "test": "jest"
}
```

## 🧪 Testes

### Usando Jest

```bash
# Testar todas as APIs
npm run test:api

# Testar endpoint específico
npm run test:api -- --grep "admin"

# Testar com coverage
npm run test:api -- --coverage
```

## 🚀 Deploy

### Configurações de Produção
- **CORS**: Configurado para domínios específicos
- **Rate Limiting**: Ativo em todos os endpoints
- **Logging**: Estruturado para monitoramento
- **Cache**: Otimizado para performance

### Monitoramento em Produção
- **Logs**: Centralizados no Supabase
- **Métricas**: Coletadas automaticamente
- **Alertas**: Configurados para erros críticos

## 📞 Suporte e Contato

Para suporte, envie um email para support@golffox.com ou abra uma issue no repositório.

---

**Documentação atualizada em**: Outubro de 2024  
**Versão do Sistema**: 0.1.0  
**Contato**: equipe@golffox.com
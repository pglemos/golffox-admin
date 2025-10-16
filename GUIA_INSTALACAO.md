# 🚀 Guia de Instalação e Configuração - GolfFox

Este guia fornece instruções detalhadas para instalar, configurar e executar o sistema GolfFox em diferentes ambientes.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Local](#instalação-local)
3. [Configuração no Replit](#configuração-no-replit)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Configuração das APIs](#configuração-das-apis)
6. [Execução do Projeto](#execução-do-projeto)
7. [Solução de Problemas](#solução-de-problemas)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: Versão 18.x ou superior
  - [Download Node.js](https://nodejs.org/)
  - Verifique a instalação: `node --version`

- **npm**: Versão 8.x ou superior (geralmente instalado com o Node.js)
  - Verifique a instalação: `npm --version`

- **Git**: Para clonar o repositório
  - [Download Git](https://git-scm.com/downloads)
  - Verifique a instalação: `git --version`

- **Conta no Supabase**: Para o banco de dados
  - [Criar conta no Supabase](https://supabase.com/)

- **Chave de API do Google Maps**: Para funcionalidades de mapas
  - [Console do Google Cloud](https://console.cloud.google.com/)
  - Ative as seguintes APIs:
    - Maps JavaScript API
    - Geocoding API
    - Directions API

## 💻 Instalação Local

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/golffox.git

# Entre no diretório do projeto
cd golffox
```

### 2. Instale as Dependências

```bash
# Usando npm
npm install

# OU usando yarn
yarn install
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas credenciais
```

Edite o arquivo `.env.local` e preencha as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_api_do_google_maps
```

## ☁️ Configuração no Replit

### 1. Importe o Projeto para o Replit

- Acesse [Replit](https://replit.com/)
- Clique em "+ Create Repl"
- Selecione "Import from GitHub"
- Cole a URL do repositório
- Clique em "Import from GitHub"

### 2. Configure os Secrets no Replit

- No painel do Replit, vá para a aba "Secrets"
- Adicione os seguintes secrets:
  - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave de API do Google Maps

### 3. Execute o Projeto no Replit

- Clique no botão "Run" no topo da página
- O Replit executará automaticamente o comando definido no arquivo `.replit`

## 🗄️ Configuração do Banco de Dados

### Opção A: Configuração Automática (Recomendada)

O projeto inclui scripts para configurar automaticamente o banco de dados:

```bash
# Verificar conexão com o Supabase
npm run verify-supabase

# Configurar o banco de dados e dados iniciais
npm run setup-project
```

### Opção B: Configuração Manual

Se preferir configurar manualmente ou se a configuração automática falhar:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto (ou crie um novo)
3. Vá para a seção "SQL Editor"
4. Execute os scripts na seguinte ordem:

#### 1. Criar Tabelas (Schema)

Copie e cole o conteúdo do arquivo `supabase/schema.sql` no editor SQL e execute.

#### 2. Configurar Políticas de Segurança (RLS)

Copie e cole o conteúdo do arquivo `supabase/rls_policies.sql` no editor SQL e execute.

#### 3. Adicionar Tabelas Adicionais (se necessário)

Copie e cole o conteúdo do arquivo `supabase/missing_tables.sql` no editor SQL e execute.

## 🔑 Configuração das APIs

### Google Maps API

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Library"
4. Ative as seguintes APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
5. Vá para "APIs & Services" > "Credentials"
6. Crie uma chave de API
7. Restrinja a chave para os domínios que você usará (opcional, mas recomendado)
8. Copie a chave e adicione ao seu arquivo `.env.local`

## ▶️ Execução do Projeto

### Ambiente de Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Executar Interfaces Específicas

O projeto suporta a execução de interfaces específicas em portas diferentes:

```bash
# Interface administrativa (porta 5001)
npm run admin

# Interface do operador (porta 5002)
npm run operador

# Interface da transportadora (porta 5003)
npm run transportadora

# Interface do motorista (porta 5004)
npm run motorista

# Interface do passageiro (porta 5005)
npm run passageiro

# Executar todas as interfaces simultaneamente
npm run dev:all
```

### Ambiente de Produção

```bash
# Gerar build de produção
npm run build

# Iniciar servidor de produção
npm run start
```

## 🔐 Credenciais de Acesso

Após executar o script `setup-project`, você terá acesso às seguintes credenciais:

**Usuário Administrador:**
- Email: `admin@golffox.com`
- Senha: `admin123456`

## ⚠️ Solução de Problemas

### Problemas com o Supabase

1. **Erro de conexão**
   - Verifique se as variáveis de ambiente estão configuradas corretamente
   - Execute `npm run verify-supabase` para diagnosticar problemas

2. **Erro de autenticação**
   - Verifique se a chave anônima do Supabase está correta
   - Certifique-se de que o serviço de autenticação está ativado no Supabase

### Problemas com o Google Maps

1. **Mapa não carrega**
   - Verifique se a chave de API do Google Maps está correta
   - Certifique-se de que as APIs necessárias estão ativadas
   - Verifique se há restrições de domínio na chave de API

2. **Erro "For development purposes only"**
   - Sua chave de API pode não ter faturamento ativado
   - Configure o faturamento no Console do Google Cloud

### Problemas de Instalação

1. **Erro de dependências**
   - Tente limpar o cache do npm: `npm cache clean --force`
   - Reinstale as dependências: `rm -rf node_modules && npm install`

2. **Erro de build**
   - Verifique se você está usando a versão correta do Node.js
   - Execute `npm run lint` para verificar problemas no código

## 📞 Suporte

Se encontrar problemas não cobertos neste guia:

- Envie um email para support@golffox.com
- Abra uma issue no repositório do GitHub
- Consulte a [Documentação Técnica](DOCUMENTACAO_TECNICA.md) para informações adicionais

---

**Guia atualizado em**: Outubro de 2024  
**Versão do Sistema**: 0.1.0
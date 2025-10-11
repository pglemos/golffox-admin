# Golffox Management Panel - Replit

## 📋 Visão Geral

Sistema de gerenciamento de transporte Golffox migrado do Vercel para Replit.
- **Framework**: Next.js 15.5.4
- **Linguagem**: TypeScript
- **Banco de Dados**: Supabase
- **Deploy**: Configurado para Autoscale

## 🔄 Status da Migração

### ✅ Concluído
- Configuração de porta 5000 e host 0.0.0.0 para Replit
- Instalação de dependências
- Correção do Google Maps para não carregar com chaves inválidas
- Configuração de deployment para produção
- Sincronização de arquivos atualizados

### ⚠️ Ação Requerida

**CRÍTICO - Segurança:**
As credenciais do Supabase foram removidas do projeto por segurança. Você precisa:

1. **Rotacionar as chaves do Supabase** (as antigas foram expostas):
   - Acesse https://app.supabase.com/project/afnlsvaswsokofldoqsf/settings/api
   - Gere novas chaves (ANON KEY e SERVICE_ROLE KEY)

2. **Configurar as credenciais no Replit Secrets**:
   - Clique em "Tools" > "Secrets" no painel do Replit
   - Adicione as seguintes secrets:
     - `NEXT_PUBLIC_SUPABASE_URL`: https://afnlsvaswsokofldoqsf.supabase.co
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [sua nova chave anon]
     - `SUPABASE_SERVICE_ROLE_KEY`: [sua nova chave service role]

3. **APIs Opcionais** (configure se precisar dos recursos):
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave do Google Maps para mapas e rotas
   - `GEMINI_API_KEY`: Chave da API Gemini para recursos de IA

## 🏗️ Arquitetura

### Estrutura Principal
```
app/               # Páginas Next.js (App Router)
  ├── admin/       # Painel administrativo
  ├── api/         # API Routes
  ├── motorista/   # App do motorista
  ├── operador/    # App do operador
  ├── painel/      # Painel de gerenciamento
  └── passageiro/  # App do passageiro

components/        # Componentes React
hooks/            # Custom React Hooks
services/         # Serviços de negócio
lib/              # Utilitários e clientes (Supabase)
```

### Configurações Importantes

**next.config.js:**
- Configurado para Replit com `allowedDevOrigins`
- Suporte a imagens do domínio Replit
- Webpack alias configurado para '@'

**Scripts npm:**
- `dev`: Servidor de desenvolvimento (porta 5000)
- `build`: Build de produção
- `start`: Servidor de produção (porta 5000)

## 🚨 Limitações Conhecidas

1. **Google Maps**: Recursos de mapa e otimização de rotas estarão desabilitados até configurar uma chave válida do Google Maps API. O sistema funciona em modo degradado quando a API não está configurada.

## 🔐 Segurança

- Nunca commite arquivos `.env` ou `.env.local`
- Use o sistema de Secrets do Replit para todas as credenciais
- As chaves de API antigas foram removidas e devem ser rotacionadas

## 📝 Alterações Recentes

### 11/10/2024 - Migração Vercel → Replit
- Adaptação do projeto para ambiente Replit
- Configuração de porta 5000 e host 0.0.0.0
- Correção do GoogleMapsLoader para detectar placeholders
- Configuração de deployment autoscale
- Remoção de credenciais expostas (.env, .env.local)

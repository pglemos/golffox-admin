# 📡 Documentação das APIs - Golffox

## 🎯 Visão Geral

Esta documentação descreve todas as APIs REST disponíveis no sistema Golffox, organizadas por módulo e funcionalidade.

## 🔐 Autenticação

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

## 🏢 API do Painel Administrativo

### GET /api/admin
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
    },
    "companies": [...],
    "drivers": [...],
    "vehicles": [...],
    "routes": [...],
    "users": [...]
  },
  "timestamp": "2024-10-12T00:00:00.000Z"
}
```

### POST /api/admin
**Acesso:** `admin`  
**Descrição:** Executar ações administrativas

**Ações Disponíveis:**

#### Criar Usuário
```json
{
  "action": "create_user",
  "data": {
    "email": "novo@usuario.com",
    "name": "Novo Usuário",
    "role": "operator",
    "company_id": "uuid"
  }
}
```

#### Alterar Status de Usuário
```json
{
  "action": "toggle_user_status",
  "data": {
    "user_id": "uuid",
    "is_active": false
  }
}
```

## 🧑‍💼 API do Painel do Operador

### GET /api/operador
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
    },
    "employees": [...],
    "routes": [...],
    "vehicles": [...],
    "drivers": [...]
  }
}
```

### POST /api/operador
**Acesso:** `operator`, `admin`  
**Descrição:** Executar ações do operador

**Ações Disponíveis:**

#### Cadastrar Funcionário
```json
{
  "action": "register_employee",
  "data": {
    "email": "funcionario@empresa.com",
    "name": "Nome do Funcionário"
  }
}
```

#### Rastrear Rota
```json
{
  "action": "track_route",
  "data": {
    "route_id": "uuid"
  }
}
```

## 🚚 API do Painel da Transportadora

### GET /api/transportadora?transportadora_id=uuid
**Acesso:** `admin`  
**Descrição:** Obter dados da transportadora específica

### POST /api/transportadora
**Acesso:** `admin`  
**Descrição:** Executar ações da transportadora

**Ações Disponíveis:**

#### Cadastrar Motorista
```json
{
  "action": "register_driver",
  "transportadora_id": "uuid",
  "data": {
    "name": "Nome do Motorista",
    "cpf": "12345678901",
    "cnh": "12345678901",
    "cnh_validity": "2025-12-31",
    "cnh_category": "D",
    "phone": "(11) 99999-9999",
    "email": "motorista@transportadora.com"
  }
}
```

#### Atribuir Rota
```json
{
  "action": "assign_route",
  "transportadora_id": "uuid",
  "data": {
    "route_id": "uuid",
    "driver_id": "uuid",
    "vehicle_id": "uuid"
  }
}
```

## 🧍‍♂️ API do App do Motorista

### GET /api/motorista
**Acesso:** `driver`, `admin`  
**Descrição:** Obter dados do motorista

**Resposta:**
```json
{
  "success": true,
  "data": {
    "driver": { "id": "uuid", "name": "Nome", "status": "Ativo" },
    "routes": [...],
    "vehicle": { "id": "uuid", "plate": "ABC-1234", "model": "Mercedes" },
    "checklist": null,
    "stats": {
      "routesToday": 2,
      "completedRoutes": 1,
      "pendingRoutes": 1
    }
  }
}
```

### POST /api/motorista
**Acesso:** `driver`, `admin`  
**Descrição:** Executar ações do motorista

**Ações Disponíveis:**

#### Completar Checklist
```json
{
  "action": "complete_checklist",
  "data": {
    "vehicle_id": "uuid",
    "items": {
      "combustivel": true,
      "pneus": true,
      "freios": true,
      "limpeza": false
    },
    "observations": "Veículo precisa de limpeza",
    "all_ok": false
  }
}
```

#### Iniciar Rota
```json
{
  "action": "start_route",
  "data": {
    "route_id": "uuid"
  }
}
```

#### Atualizar Localização
```json
{
  "action": "update_location",
  "data": {
    "position": {
      "lat": -23.5505,
      "lng": -46.6333
    }
  }
}
```

## 🚏 API do App do Passageiro

### GET /api/passageiro
**Acesso:** `passenger`, `admin`  
**Descrição:** Obter dados do passageiro

### POST /api/passageiro
**Acesso:** `passenger`, `admin`  
**Descrição:** Executar ações do passageiro

**Ações Disponíveis:**

#### Solicitar Viagem
```json
{
  "action": "request_ride",
  "data": {
    "pickup_address": "Rua A, 123",
    "pickup_coordinates": { "lat": -23.5505, "lng": -46.6333 },
    "destination_address": "Rua B, 456",
    "destination_coordinates": { "lat": -23.5600, "lng": -46.6400 },
    "requested_time": "2024-10-12T08:00:00Z"
  }
}
```

#### Avaliar Viagem
```json
{
  "action": "rate_trip",
  "data": {
    "route_id": "uuid",
    "driver_id": "uuid",
    "rating": 5,
    "comment": "Excelente motorista!",
    "categories": {
      "pontualidade": 5,
      "direcao": 5,
      "veiculo": 4,
      "atendimento": 5
    }
  }
}
```

## 🗺️ APIs de Mapas e Geolocalização

### POST /api/maps/geocode
**Acesso:** Autenticado  
**Descrição:** Geocodificar endereço

```json
{
  "address": "Av. Paulista, 1000, São Paulo, SP"
}
```

### POST /api/maps/optimize-route
**Acesso:** `admin`, `operator`  
**Descrição:** Otimizar rota com IA

```json
{
  "waypoints": [
    {
      "address": "Ponto A",
      "coordinates": { "lat": -23.5505, "lng": -46.6333 },
      "type": "pickup"
    },
    {
      "address": "Ponto B", 
      "coordinates": { "lat": -23.5600, "lng": -46.6400 },
      "type": "dropoff"
    }
  ]
}
```

## 🤖 APIs de Inteligência Artificial

### POST /api/ai/generate-report
**Acesso:** `admin`, `operator`  
**Descrição:** Gerar relatório com IA

```json
{
  "prompt": "Analise a performance dos motoristas esta semana",
  "contextData": {
    "drivers": [...],
    "routes": [...],
    "period": "2024-10-05 to 2024-10-12"
  }
}
```

### POST /api/ai/analyze-performance
**Acesso:** `admin`, `operator`  
**Descrição:** Analisar performance de motorista

```json
{
  "driver_id": "uuid",
  "period": "last_30_days"
}
```

## 📊 Rate Limiting

Todas as APIs possuem rate limiting configurado:

| Endpoint | Limite | Janela |
|----------|--------|---------|
| `/api/auth/*` | 5 requests | 15 minutos |
| `/api/*/` (geral) | 100 requests | 15 minutos |
| `/api/*/realtime` | 60 requests | 1 minuto |
| `/api/ai/*` | 50 requests | 1 hora |

**Headers de Rate Limit:**
- `X-RateLimit-Limit`: Limite máximo
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp do reset

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido/ausente |
| 403 | Forbidden - Permissões insuficientes |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Dados duplicados |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro interno |

## 🔍 Exemplos de Uso

### JavaScript/TypeScript
```typescript
// Configurar cliente HTTP
const apiClient = {
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

// Buscar dados do admin
const adminData = await fetch(`${apiClient.baseURL}/admin`, {
  headers: apiClient.headers
}).then(res => res.json());

// Criar usuário
const newUser = await fetch(`${apiClient.baseURL}/admin`, {
  method: 'POST',
  headers: apiClient.headers,
  body: JSON.stringify({
    action: 'create_user',
    data: {
      email: 'novo@usuario.com',
      name: 'Novo Usuário',
      role: 'operator',
      company_id: 'uuid'
    }
  })
}).then(res => res.json());
```

### cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@golffox.com","password":"senha123"}'

# Buscar dados do admin
curl -X GET http://localhost:5000/api/admin \
  -H "Authorization: Bearer jwt_token_aqui"

# Otimizar rota
curl -X POST http://localhost:5000/api/maps/optimize-route \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_aqui" \
  -d '{
    "waypoints": [
      {"address": "Ponto A", "coordinates": {"lat": -23.5505, "lng": -46.6333}},
      {"address": "Ponto B", "coordinates": {"lat": -23.5600, "lng": -46.6400}}
    ]
  }'
```

## 🧪 Testes das APIs

### Usando Jest
```typescript
describe('Admin API', () => {
  it('should return dashboard data', async () => {
    const response = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.stats).toBeDefined();
  });
});
```

### Usando Postman
1. Importe a collection: `docs/postman/golffox-api.json`
2. Configure as variáveis de ambiente
3. Execute os testes automatizados

## 📈 Monitoramento

### Health Check
```http
GET /api/health
```

**Resposta:**
```json
{
  "success": true,
  "message": "API está funcionando",
  "timestamp": "2024-10-12T00:00:00.000Z",
  "environment": {
    "nodeEnv": "development",
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true
  }
}
```

### Métricas
- **Latência média**: < 200ms
- **Disponibilidade**: 99.9%
- **Rate limit**: Configurado por endpoint
- **Cache hit rate**: ~80% (React Query)

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```env
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Opcionais
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_gemini
```

### Scripts de Teste
```bash
# Testar todas as APIs
npm run test:api

# Testar endpoint específico
npm run test:api -- --grep "admin"

# Testar com coverage
npm run test:api -- --coverage
```

## 🚀 Deploy e Produção

### Configurações de Produção
- **CORS**: Configurado para domínios específicos
- **Rate Limiting**: Ativo em todos os endpoints
- **Logging**: Estruturado para monitoramento
- **Cache**: Otimizado para performance

### Monitoramento em Produção
- **Logs**: Centralizados no Supabase
- **Métricas**: Coletadas automaticamente
- **Alertas**: Configurados para erros críticos

---

**Documentação gerada automaticamente em**: 12 de outubro de 2024  
**Versão da API**: 1.0.0  
**Contato**: equipe@golffox.com
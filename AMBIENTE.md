# Ambiente de Execução - GolfFox

## Configuração Local

### Requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior

### Passos para Execução Local

1. **Instalação de Dependências**

```bash
npm install
```

2. **Configuração de Variáveis de Ambiente**

Crie um arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais
```

3. **Execução em Modo de Desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

4. **Build para Produção**

```bash
npm run build
npm run start
```

## Configuração no Replit

### Requisitos

- Conta no Replit
- Projeto importado no Replit

### Passos para Execução no Replit

1. **Configuração de Secrets**

No painel do Replit, acesse a seção "Secrets" e adicione as seguintes variáveis:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave de API do Google Maps

2. **Execução do Projeto**

O arquivo `.replit` já está configurado para executar o comando `npm run dev` ao clicar no botão "Run".

3. **Acesso à Aplicação**

Após a execução, o Replit fornecerá uma URL para acessar a aplicação.

## Estrutura de Arquivos

```
/
├── app/                  # Código da aplicação Next.js
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página inicial
│   └── providers.tsx     # Provedores de contexto
├── components/           # Componentes React
├── hooks/                # Hooks personalizados
├── lib/                  # Bibliotecas e utilitários
├── public/               # Arquivos estáticos
├── .env.example          # Exemplo de variáveis de ambiente
├── .replit               # Configuração do Replit
├── package.json          # Dependências e scripts
└── README.md             # Documentação principal
```

## Serviços Externos

### Supabase

O projeto utiliza Supabase para autenticação e banco de dados. É necessário criar um projeto no Supabase e configurar as variáveis de ambiente correspondentes.

### Google Maps

Para funcionalidades de mapa e geolocalização, é necessário uma chave de API do Google Maps com as seguintes APIs habilitadas:

- Maps JavaScript API
- Geocoding API
- Directions API

## Solução de Problemas

### Erro de Conexão com Supabase

Verifique se as variáveis de ambiente estão configuradas corretamente e se o projeto Supabase está ativo.

### Problemas com Google Maps

Certifique-se de que a chave de API tem as permissões necessárias e que as APIs corretas estão habilitadas.

### Erros no Replit

Se encontrar problemas no Replit, tente:

1. Limpar o cache: `npm cache clean --force`
2. Reinstalar dependências: `npm install`
3. Verificar logs para erros específicos

---

Este documento será atualizado conforme o projeto evolui.
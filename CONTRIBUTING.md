# Guia de Contribuição - GolfFox

Obrigado por considerar contribuir com o GolfFox! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Ao participar deste projeto, você concorda em manter um ambiente respeitoso e colaborativo. Comportamentos inaceitáveis não serão tolerados.

## Como Contribuir

### Reportando Bugs

Bugs são rastreados como issues no GitHub. Ao criar uma issue para um bug, inclua:

- Um título claro e descritivo
- Passos detalhados para reproduzir o problema
- Comportamento esperado vs. comportamento observado
- Screenshots, se aplicável
- Informações do ambiente (navegador, sistema operacional, etc.)

### Sugerindo Melhorias

Melhorias também são rastreadas como issues. Ao sugerir uma melhoria, inclua:

- Um título claro e descritivo
- Descrição detalhada da melhoria proposta
- Justificativa para a melhoria
- Possíveis implementações, se você tiver ideias

### Processo de Pull Request

1. Faça um fork do repositório
2. Clone seu fork localmente
3. Crie uma branch para sua feature ou correção (`git checkout -b feature/amazing-feature`)
4. Faça suas alterações
5. Execute os linters e testes (`npm run lint && npm run test`)
6. Commit suas mudanças seguindo as convenções de commit (veja abaixo)
7. Push para sua branch (`git push origin feature/amazing-feature`)
8. Abra um Pull Request

## Padrões de Código

### Estilo de Código

O projeto usa ESLint e Prettier para garantir a consistência do código. Antes de enviar um PR, certifique-se de que seu código passa nas verificações de linting:

```bash
npm run lint
```

Para formatar automaticamente seu código:

```bash
npm run format
```

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit padronizadas. Cada mensagem de commit deve seguir o formato:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

Tipos comuns incluem:

- **feat**: Uma nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, etc.)
- **refactor**: Alteração de código que não corrige um bug nem adiciona uma funcionalidade
- **perf**: Alteração de código que melhora o desempenho
- **test**: Adição ou correção de testes
- **chore**: Alterações no processo de build ou ferramentas auxiliares

Exemplos:

```
feat(auth): adicionar autenticação com Google
fix(maps): corrigir erro ao carregar mapa em dispositivos iOS
docs(readme): atualizar instruções de instalação
```

### Testes

Novas funcionalidades devem incluir testes. Certifique-se de que todos os testes passam antes de enviar um PR:

```bash
npm run test
```

## Configuração de Desenvolvimento

### Pré-requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior

### Configuração Local

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

4. Configure o banco de dados
```bash
npm run db:setup
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### Hooks de Pre-commit

O projeto usa pre-commit hooks para garantir a qualidade do código. Para instalar os hooks:

```bash
npx husky install
```

## Estrutura do Projeto

Familiarize-se com a estrutura do projeto antes de contribuir:

```
/
├── app/                  # Código da aplicação Next.js
├── components/           # Componentes React reutilizáveis
├── hooks/                # Hooks personalizados
├── lib/                  # Bibliotecas e utilitários
├── services/             # Serviços de API e integração
├── public/               # Arquivos estáticos
└── ...                   # Arquivos de configuração
```

## Dúvidas?

Se você tiver dúvidas sobre como contribuir, abra uma issue ou entre em contato com os mantenedores.

Obrigado por contribuir com o GolfFox!
# Plano de Ação - Projeto GolfFox

## Diagnóstico Inicial

Após análise inicial do repositório, foram identificados os seguintes problemas críticos:

1. **Estrutura duplicada**: Existe uma pasta `golffox-replit` dentro do diretório principal, criando uma estrutura aninhada desnecessária.
2. **Inconsistência de dependências**: Existem dois arquivos `package.json` com versões diferentes de dependências.
3. **Conflito tecnológico**: O README menciona React com Vite, mas o projeto está configurado com Next.js.
4. **Versões incompatíveis**: O projeto aninhado utiliza versões muito recentes e potencialmente incompatíveis (React 19, Next.js 15).

## Plano de Consolidação (ID: PLANO-CONSOLIDACAO-001)

### Fase 1: Consolidação de Estrutura

| Ação | Prioridade | Esforço | Risco | Dependências |
|------|------------|---------|-------|---------------|
| Mover arquivos relevantes da pasta aninhada para a raiz | Alta | Médio | Médio | Nenhuma |
| Consolidar arquivos de configuração (.env, .gitignore, etc.) | Alta | Baixo | Baixo | Mover arquivos |
| Remover estrutura duplicada | Alta | Baixo | Médio | Consolidar arquivos |

### Fase 2: Normalização de Dependências

| Ação | Prioridade | Esforço | Risco | Dependências |
|------|------------|---------|-------|---------------|
| Consolidar package.json com versões estáveis | Alta | Médio | Alto | Consolidar estrutura |
| Atualizar dependências para versões compatíveis | Média | Médio | Médio | Consolidar package.json |
| Verificar compatibilidade entre bibliotecas | Média | Alto | Médio | Atualizar dependências |

### Fase 3: Configuração de Ambiente

| Ação | Prioridade | Esforço | Risco | Dependências |
|------|------------|---------|-------|---------------|
| Configurar ambiente Replit corretamente | Alta | Médio | Baixo | Normalizar dependências |
| Implementar linters e formatadores | Média | Baixo | Baixo | Configurar ambiente |
| Configurar scripts de build e execução | Alta | Baixo | Médio | Configurar ambiente |

### Fase 4: Documentação e Qualidade

| Ação | Prioridade | Esforço | Risco | Dependências |
|------|------------|---------|-------|---------------|
| Atualizar README com informações corretas | Média | Baixo | Baixo | Todas as fases anteriores |
| Criar documentação de setup e execução | Média | Médio | Baixo | Atualizar README |
| Implementar testes básicos | Baixa | Alto | Médio | Normalizar dependências |

## Critérios de Aceite

- Estrutura de pastas organizada e sem duplicações
- Aplicação executando corretamente no ambiente Replit
- Dependências atualizadas e compatíveis
- Documentação clara e atualizada
- Linters e formatadores configurados e funcionando

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|------------|
| Perda de funcionalidades durante consolidação | Média | Alto | Criar backup antes de cada alteração significativa |
| Incompatibilidade entre bibliotecas | Alta | Alto | Testar cada alteração incrementalmente |
| Problemas de execução no Replit | Média | Alto | Configurar e testar ambiente Replit em paralelo |

## Próximos Passos

1. Obter aprovação para execução do plano
2. Criar backup do estado atual
3. Iniciar Fase 1: Consolidação de Estrutura

---

Para aprovar este plano, responda com: `CONFIRMAR: PLANO-CONSOLIDACAO-001`
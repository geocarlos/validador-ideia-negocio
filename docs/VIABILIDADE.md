# Análise de Viabilidade Técnica

## 1. Objetivo

Avaliar a viabilidade técnica da plataforma Validador de Ideia de Negócio, com foco em arquitetura, confiabilidade, escalabilidade, segurança, custo operacional e risco de implementação.

## 2. Visão Geral da Solução Atual

O produto está implementado como uma aplicação full-stack com:

- Frontend em React (Vite + Tailwind)
- Backend em Node.js + Express
- Orquestração multiagente para análise (Mercado, Técnico, Financeiro)
- Integração com OpenAI por serviço centralizado, com timeout, retry e validação de schema
- Persistência com Prisma + SQLite
- Autenticação JWT para rotas protegidas
- Testes automatizados com Jest e Supertest

## 3. Por que a IA é Tecnicamente Necessária

O valor central do produto depende de raciocínio estruturado e contextual sobre entradas textuais não estruturadas. Lógica tradicional baseada em regras não substitui de forma confiável:

- Raciocínio de mercado com contexto qualitativo
- Análise de trade-offs técnicos a partir de restrições da ideia
- Estimativa de viabilidade financeira em cenário de incerteza inicial

Conclusão: a IA não é um complemento opcional; ela é o motor principal de execução do produto.

## 4. Viabilidade da Arquitetura

### 4.1 Padrão multiagente

O uso de três agentes especializados em paralelo é tecnicamente viável e alinhado com requisitos de tempo de resposta.

Pontos fortes:
- Melhor especialização por domínio
- Menor acoplamento entre frentes de análise
- Evolução independente de prompts por agente
- Tolerância a falhas parciais por agente

Trade-offs:
- Maior número de chamadas de API por requisição
- Maior consumo de tokens em comparação com abordagem de agente único
- Necessidade de validação rigorosa de formato de resposta

### 4.2 Serviço OpenAI centralizado

A camada compartilhada de serviço é uma decisão forte de design para manutenibilidade e resiliência.

Controles implementados:
- Timeout de requisição com AbortController
- Retry com backoff exponencial e jitter para erros transientes
- Logging estruturado
- Extração e parse robusto de JSON
- Validação de resposta por schema Zod em cada agente
- Hierarquia de erros tipados para falhas mais precisas

Isso reduz de forma significativa o risco operacional de respostas malformadas e instabilidades transitórias do provedor.

## 5. Viabilidade de Dados e Persistência

SQLite com Prisma é viável para MVP e uso em escala de sala/projeto inicial:

- Desenvolvimento local rápido, com baixo custo de setup
- Bom encaixe para volume pequeno a moderado de leitura e escrita
- Caminho claro de migração para PostgreSQL em caso de crescimento de concorrência

Recomendação de gatilho de migração:
- Migrar para PostgreSQL quando usuários simultâneos e volume de histórico gerarem contenção de lock ou latência acima do aceitável.

## 6. Performance e Latência

### 6.1 Comportamento esperado

Execução paralela dos agentes com Promise.all está alinhada com metas de tempo para UX interativa.

Principais fatores de latência:
- Tempo de resposta do provedor LLM
- Modelo selecionado
- Volume de tokens de entrada e saída

### 6.2 Mitigações técnicas já presentes

- Timeout por chamada com limite de tentativas
- Comportamento de resposta parcial quando um ou mais agentes falham
- Tratamento consolidado de erros

Risco residual:
- A latência ponta a ponta ainda pode aumentar sob congestionamento do provedor ou limitação de quota.

## 7. Confiabilidade e Tratamento de Erros

O desenho atual do backend é tecnicamente robusto para MVP:

- Falha parcial de agente não interrompe a requisição completa
- Erros de parse de entrada são tratados com mensagem explícita para cliente
- Erros de validação retornam detalhes acionáveis
- Erros não transientes da OpenAI não são retentados sem necessidade

Esse comportamento está alinhado com práticas de hardening para produção.

## 8. Postura de Segurança e Conformidade

A postura atual é adequada para MVP não regulado, com oportunidades claras de evolução.

Pontos fortes:
- Controle de acesso com JWT em rotas protegidas
- Configuração de segredos via variáveis de ambiente
- Arquivos locais de segredo ignorados pelo Git

Riscos a gerenciar continuamente:
- Exposição de segredo em testes manuais e logs
- Ausência de branch protection e checks obrigatórios no remoto
- Falta de controles avançados de abuso (rate limiting, detecção de anomalia)

Próximos controles recomendados:
- Política de rotação de segredos
- Branch protection em main e develop
- Checks obrigatórios de CI antes de merge
- Rate limiting e trilha de auditoria

## 9. Viabilidade de Custos

O custo é a principal restrição operacional, pois cada validação dispara três chamadas LLM.

Direcionadores de custo:
- Número de validações por dia
- Tamanho médio de tokens de entrada e saída
- Modelo utilizado por agente

Alavancas de mitigação:
- Manter modelo padrão em faixa de melhor custo-benefício
- Reduzir verbosidade de prompt sem perder qualidade
- Definir limite de max tokens por perfil de agente
- Adicionar telemetria de consumo por requisição e por usuário

Conclusão: financeiramente viável para MVP com monitoramento de uso e disciplina de tokens.

## 10. Testabilidade e Manutenibilidade

O projeto apresenta boas características de manutenibilidade técnica:

- Fronteiras modulares claras (agents, orchestrator, services)
- Lógica de integração LLM centralizada
- Testes unitários e de integração para fluxos críticos
- Contratos de resposta orientados a schema

Evoluções recomendadas:
- Testes de contrato para envelope de resposta da API
- Linha de base de teste de carga para endpoint do orquestrador
- Pipeline de CI com gates de lint, teste e cobertura

## 11. Matriz de Riscos e Mitigação

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Indisponibilidade da OpenAI ou latência degradada | Alto | Médio | Timeout, retry, resposta parcial graciosa |
| Crescimento de custo por tokens | Alto | Médio | Telemetria de uso, limite de tokens, ajuste de modelo |
| Saída LLM em formato inválido | Médio | Médio | Validação Zod e fallback robusto de parse |
| Exposição de segredo | Alto | Médio | Rotação de segredo, governança de env e checks em PR |
| Limite de escala do SQLite | Médio | Baixo/Médio | Plano de migração para PostgreSQL |

## 12. Parecer Técnico Final

Status: viável para MVP e evolução incremental rumo a produção.

Recomendação Go/No-Go: Go.

Justificativa:
- Arquitetura central já implementada e coerente
- Controles críticos de resiliência para integração LLM estão presentes
- Riscos principais são conhecidos e mitigáveis incrementalmente
- Caminhos de evolução para banco e maturidade operacional estão definidos

## 13. Próximos Marcos Técnicos

1. Habilitar branch protection e checks obrigatórios de CI no repositório remoto.
2. Adicionar rate limiting e IDs de correlação por requisição.
3. Implementar dashboard de uso/custo por validação e por usuário.
4. Formalizar plano de migração para PostgreSQL com gatilhos de capacidade.
5. Adicionar testes de carga no endpoint de validação e metas de SLO.

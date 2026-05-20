# Documento de Requisitos do Produto (PRD)
## Validador de Ideia de Negócio - Versão 3 Avançado

**Versão:** 1.0  
**Data:** 2026-05-19  
**Status:** Pronto para Implementação (Fase 0)  
**Lançamento Alvo:** Final da Fase 7  

---

## 1. Visão e Declaração do Problema

### Problema
Empreendedores e fundadores de startups gastam tempo e dinheiro significativos buscando feedback para suas ideias de negócio. A validação em estágio inicial costuma ser lenta (consultorias levam semanas), cara (US$ 500-2000 por consultoria) e enviesada (perspectivas limitadas). Sem uma análise estruturada em múltiplas dimensões (mercado, técnica e financeira), os fundadores correm o risco de seguir ideias inviáveis ou ignorar restrições críticas.

### Solução
Um sistema de IA multiagente que fornece **análise instantânea e estruturada** de ideias de negócio em três dimensões especializadas:
- **Análise de Mercado:** problema a resolver, público-alvo, tamanho de mercado, concorrência e diferenciação
- **Viabilidade Técnica:** requisitos de stack, nível de complexidade, pontos de integração com IA, limitações técnicas e cronograma de MVP
- **Viabilidade Financeira:** modelo de receita, custos operacionais (especialmente de IA), score de viabilidade financeira e próximos passos de validação

### Por que a IA é Essencial
O produto **não existe sem IA**. O valor central é:
1. **Velocidade:** análise em 10 segundos versus semanas de consultoria
2. **Amplitude:** três agentes especializados analisam em paralelo, cada um por um ângulo diferente
3. **Acessibilidade:** o fundador recebe análise em nível profissional a custo zero
4. **Consistência:** os mesmos critérios são aplicados a toda ideia; sem viés subjetivo de consultor

---

## 2. Usuários-Alvo e Casos de Uso

### Persona Principal
- **Nome:** Sofia (Empreendedora/Fundadora)
- **Idade:** 25-45
- **Contexto:** fundadora em estágio inicial, em transição de carreira ou validando projeto paralelo
- **Dor Principal:** precisa de feedback rápido antes de investir tempo/dinheiro; não pode pagar consultorias
- **Objetivo:** validar ideia de negócio em < 5 minutos e comparar variações de ideia

### Casos de Uso

**UC1: Primeira Validação**
- Sofia tem uma ideia de negócio inicial
- Ela faz login e descreve a ideia em 200+ palavras
- O sistema retorna análise nas dimensões de mercado, técnica e financeira
- Ela lê o relatório, identifica os riscos mais críticos e decide pivotar ou seguir adiante

**UC2: Comparação de Ideias**
- Sofia tem 3 ideias concorrentes
- Ela valida cada uma separadamente
- Ela revisa o histórico comparando scores e recomendações
- Ela compartilha a análise com um cofundador (melhoria futura: exportar PDF)

**UC3: Ciclo de Feedback**
- Sofia recebe a análise inicial, incorpora feedback e refina a ideia
- Ela revalida a ideia atualizada semanas depois
- Ela compara as duas análises para verificar melhora nos scores de viabilidade

---

## 3. Funcionalidades Principais e Critérios de Aceite

### Funcionalidade 1: Autenticação de Usuário
**Descrição:** Usuários podem fazer login com endereço de e-mail para acessar a plataforma e proteger seu histórico de análises.

**Critérios de Aceite:**
- [ ] Usuário consegue inserir e-mail na tela de login
- [ ] Token JWT válido é gerado e armazenado no localStorage
- [ ] Token expira após 7 dias de inatividade
- [ ] Usuários não autenticados não acessam `/dashboard` (redirecionamento para login)
- [ ] Endpoints da API rejeitam requisições sem token válido (401 Unauthorized)

**User Story:** Como usuário, quero acessar com segurança meu histórico de ideias para que minhas análises permaneçam privadas e persistentes.

---

### Funcionalidade 2: Envio de Ideia e Análise Multiagente
**Descrição:** Usuários autenticados enviam uma ideia de negócio. Três agentes especializados (Mercado, Técnico e Financeiro) analisam em paralelo e retornam respostas JSON estruturadas.

**Critérios de Aceite:**
- [ ] Formulário do frontend aceita descrição da ideia (mín. 100 caracteres)
- [ ] Formulário valida entrada e mostra mensagens de erro claras
- [ ] `POST /api/validar` aceita JSON com `{ ideia: string }`
- [ ] Orquestrador de backend dispara 3 agentes em paralelo usando Promise.all()
- [ ] Cada agente chama a API da OpenAI com prompt especializado (Mercado, Técnico e Financeiro)
- [ ] API consolida respostas em um único objeto JSON em até 15 segundos
- [ ] Se 1-2 agentes falharem, a resposta retorna 200 com resultado parcial + campo de erro
- [ ] Resposta inclui timestamp, userId, ideaHash e análise consolidada
- [ ] Frontend exibe resultados em dashboard com hierarquia visual clara

**User Story:** Como fundadora, quero enviar minha ideia e receber análise nas dimensões de mercado, técnica e financeira para tomar uma decisão informada sobre viabilidade.

---

### Funcionalidade 3: Exibição no Dashboard
**Descrição:** Os resultados de análise são exibidos em um dashboard organizado, visualmente claro, com scores, principais achados e recomendações.

**Critérios de Aceite:**
- [ ] Dashboard exibe as análises dos três agentes lado a lado
- [ ] Cada seção de agente mostra campos JSON em formato legível
- [ ] Código de cores indica scores de viabilidade (verde=alta, amarelo=media, vermelho=baixa)
- [ ] Usuário consegue ver recomendações-chave de cada agente
- [ ] Exibição é responsiva (mobile, tablet, desktop)
- [ ] Usuário pode expandir/recolher resposta completa de cada agente
- [ ] Indicador de loading é exibido enquanto agentes processam (máx. 15 segundos)

**User Story:** Como usuário, quero ver os resultados da análise em formato claro e organizado para entender rapidamente os principais achados e próximos passos.

---

### Funcionalidade 4: Histórico e Persistência
**Descrição:** Todas as validações são persistidas em SQLite e exibidas em uma visualização de histórico, permitindo comparar e revisitar análises anteriores.

**Critérios de Aceite:**
- [ ] Cada validação é armazenada no banco com userId, ideaText, timestamp e respostas de todos os agentes
- [ ] Histórico lista todas as validações anteriores, da mais nova para a mais antiga
- [ ] Usuário pode clicar para ver análise completa de qualquer validação passada
- [ ] Usuário pode excluir validações individuais
- [ ] Usuário pode limpar todo o histórico com diálogo de confirmação
- [ ] Busca/filtro por texto da ideia (substring case-insensitive)
- [ ] Histórico persiste entre sessões e múltiplos dispositivos (mesmo e-mail)

**User Story:** Como usuário recorrente, quero acessar meu histórico de análises para comparar ideias, acompanhar evolução e revisitar recomendações.

---

### Funcionalidade 5: Tratamento de Erros e Resiliência
**Descrição:** Tratamento elegante para falhas de API, timeouts e respostas inválidas.

**Critérios de Aceite:**
- [ ] Timeout de rede mostra mensagem amigável ao usuário (não dump de JSON)
- [ ] Resposta inválida da API OpenAI (não-JSON, malformada) mostra campo de erro na consolidação
- [ ] Se 3/3 agentes falharem, API retorna 200 com estado de erro (não 500)
- [ ] Rate limit (quota OpenAI excedida) mostra mensagem clara com sugestão de espera
- [ ] Erros de banco são registrados, mas não bloqueiam resposta (retorna 200 com warning)
- [ ] Todo erro inclui recomendação de próximo passo (tentar novamente, suporte etc.)

**User Story:** Como usuário, quero que o app trate erros com clareza para que eu entenda o que aconteceu e o que fazer a seguir.

---

## 4. Requisitos Não Funcionais

### Performance
- Tempo de resposta da API: < 15 segundos (3 agentes em paralelo)
- Tempo de carregamento do frontend: < 2 segundos (bundle otimizado com Vite)
- Consultas ao banco: < 100ms (SQLite com indexação adequada)
- Busca/filtro: resposta em tempo real para < 1000 validações

### Escalabilidade
- Suportar 1000+ usuários na Fase 7 sem grande refatoração
- Banco suporta 10.000+ validações (SQLite adequado; migrar para PostgreSQL se necessário após Fase 7)
- Custos de IA monitorados por usuário e agregados para planejamento financeiro

### Segurança
- Tokens JWT: expiração em 7 dias, assinatura HS256
- Segredos de API (chave OpenAI, segredo JWT): armazenados em `.env`, nunca no código
- Validação de entrada: todos os inputs de usuário sanitizados no servidor
- CORS configurado para permitir apenas origens aprovadas
- Nenhum dado sensível registrado em console em produção

### Confiabilidade
- Meta de uptime de 99,5% (SLA da Fase 7)
- Monitoramento automatizado de erros (opcional: integração com Sentry na Fase 6+)
- Backups de banco: diários (manual nas Fases 1-4, automatizado na Fase 5+)
- Endpoint de health check: `GET /health` retorna 200 se todos os sistemas estiverem OK

### Acessibilidade
- Conformidade WCAG 2.1 AA (navegação por teclado, contraste de cores, texto alternativo)
- Design responsivo mobile-first (testado em iOS 14+ e Android 10+)
- Compatível com leitores de tela (HTML semântico, labels ARIA)

---

## 5. Abordagem Técnica e Arquitetura

### Padrão de Orquestração Multiagente
```
Entrada do Usuário
    ↓
[Orquestrador do Backend]
    ↓ (paralelo)
┌────────────────┬────────────────┬──────────────────┐
│ Agente Mercado │ Agente Técnico │ Agente Financeiro│
│ (problema,     │ (stack,        │ (modelo de       │
│  público,      │  complexidade, │  receita, custos,│
│  concorrentes) │  cronograma)   │  viabilidade)    │
└────────────────┴────────────────┴──────────────────┘
    ↓ (consolidação)
[Consolidação de Resposta]
    ↓
Retorna 200 com JSON
(ou 200 parcial se 1-2 agentes falharem)
```

### Justificativa Tecnológica
- **Node.js + Express:** leve, I/O não bloqueante, ideal para chamadas paralelas de agentes
- **Prisma + SQLite:** ORM simples, SQLite adequado para fase MVP; migrações Prisma facilitam evolução
- **React + Vite:** stack moderna de frontend; Vite acelera desenvolvimento e reduz bundle
- **OpenAI gpt-4o-mini (dev), gpt-4o (produção):** melhor equilíbrio entre velocidade e custo na família gpt-4
- **JWT (baseado em e-mail):** autenticação stateless, sem sessão no servidor; simples para MVP (somente e-mail, sem senha)
- **TailwindCSS:** desenvolvimento de UI rápido; abordagem utility-first; menor manutenção de CSS

---

## 6. User Stories (Detalhadas)

### User Story 1: Fundadora Valida Ideia de Negócio
**Como** fundadora com uma ideia inicial de negócio  
**Quero** enviar minha ideia para um sistema de IA e receber análise estruturada nas dimensões de mercado, técnica e financeira  
**Para** tomar uma decisão informada sobre seguir ou pivotar

**Critérios de Aceite:**
- [ ] Tela de login aceita e-mail e gera token JWT
- [ ] Formulário de ideia possui textarea com contador de caracteres (mín. 100, máx. 5000)
- [ ] Botão de envio fica desabilitado até atingir tamanho mínimo
- [ ] Spinner de carregamento exibido por até 15 segundos
- [ ] Dashboard exibe resultados dos três agentes em até 15 segundos
- [ ] Resultados incluem score de "viabilidade" (baixa/media/alta) do agente financeiro
- [ ] Usuário visualiza recomendações específicas de cada agente
- [ ] Se algum agente falhar, resultados parciais ainda são exibidos com mensagem de erro

**Critérios de Aceite Vinculados (do PRD):**
- Funcionalidade 1: Autenticação de Usuário (login obrigatório)
- Funcionalidade 2: Envio de Ideia e Análise Multiagente (funcionalidade central)
- Funcionalidade 3: Exibição no Dashboard (apresentação de resultados)
- Funcionalidade 5: Tratamento de Erros (falhas parciais)

---

### User Story 2: Usuário Recorrente Acompanha Evolução da Ideia
**Como** usuário que já validou ideias anteriormente  
**Quero** acessar o histórico de todas as minhas análises passadas e compará-las  
**Para** acompanhar evolução das minhas ideias e comparar cenários lado a lado

**Critérios de Aceite:**
- [ ] Visualização de histórico lista todas as validações, da mais nova para a mais antiga
- [ ] Cada item da lista mostra: resumo da ideia (primeiros 50 chars), data e score de "viabilidade" financeira
- [ ] Clique em item do histórico abre análise completa (igual à validação recém-gerada)
- [ ] Barra de busca filtra por texto da ideia (case-insensitive)
- [ ] Paginação ou infinite scroll para > 10 itens
- [ ] Botão de excluir em cada item (com confirmação)
- [ ] Botão para limpar todo histórico (com confirmação)
- [ ] Histórico persiste entre logout/login (mesmo e-mail)

**Critérios de Aceite Vinculados (do PRD):**
- Funcionalidade 1: Autenticação de Usuário (login obrigatório)
- Funcionalidade 4: Histórico e Persistência (funcionalidade central)
- Funcionalidade 3: Exibição no Dashboard (visualização de análises passadas)

---

### User Story 3: Desenvolvedor Mantém Arquitetura de Agentes Testável
**Como** desenvolvedor deste projeto  
**Quero** que cada agente (Mercado, Técnico, Financeiro) seja testável e mantido de forma independente  
**Para** corrigir bugs, atualizar prompts e adicionar novos agentes sem quebrar os existentes

**Critérios de Aceite:**
- [ ] Cada agente fica em arquivo/módulo separado (agents/mercadoAgent.js etc.)
- [ ] Cada agente exporta uma função: `async agent(ideaText) => JSON`
- [ ] Cada agente pode ser testado isoladamente com testes unitários
- [ ] Schema de resposta do agente é validado (zod ou similar)
- [ ] Orquestrador usa Promise.all() para chamar agentes em paralelo
- [ ] Orquestrador trata falhas de agentes com resiliência (falha de um agente não derruba os demais)
- [ ] Versionamento de prompts documentado em docs/prompts.md
- [ ] Adicionar um 4o agente (ex.: Risco) exige apenas novo arquivo + atualização no orquestrador

**Critérios de Aceite Vinculados (do PRD):**
- Arquitetura: Padrão de Orquestração Multiagente
- Funcionalidade 2: Testabilidade da lógica de negócio central
- Funcionalidade central: Extensibilidade para melhorias futuras

---

## 7. Dependências e Serviços Externos

### API OpenAI
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Modelos:** `gpt-4o-mini` (dev), `gpt-4o` (produção)
- **Rate Limits:** compartilhados entre todos os usuários; monitorar custo diariamente
- **Fallback:** se quota exceder, retornar 200 com estado de erro ao frontend
- **Estimativa de custo:** ~US$ 0,02-0,05 por análise com 3 agentes x gpt-4o-mini

### GitHub (Infraestrutura)
- Hospedagem do repositório e colaboração
- Template de PR e proteções de branch
- GitHub Project para acompanhamento de tarefas em estilo kanban
- GitHub Actions para CI/CD futuro (após Fase 6)

### Sem Outras Dependências Externas
- Sem processador de pagamento (MVP: plano gratuito)
- Sem serviço de e-mail (apenas JWT; sem reset de senha no MVP)
- Sem plataforma de analytics (pode ser adicionada na Fase 6+)

---

## 8. Fora de Escopo (Melhorias Futuras)

- [ ] **Exportação em PDF:** exportar análise como PDF baixável (Fase 7+)
- [ ] **Integração com Dados Reais:** Crunchbase, Google Trends, APIs de mercado (Fase 7+)
- [ ] **Funcionalidades Colaborativas:** compartilhar análise com cofundadores (Fase 7+)
- [ ] **Ferramenta de Comparação de Ideias:** comparação visual lado a lado de múltiplas ideias (Fase 7+)
- [ ] **Pagamentos e Monetização:** planos freemium e recursos avançados (Fase 8+)
- [ ] **Apps Mobile:** aplicativos nativos iOS/Android (Fase 8+)
- [ ] **Multilíngue:** suporte i18n além de português (Fase 8+)
- [ ] **Prompts Personalizados:** permitir usuários definirem agentes customizados (Fase 7+)
- [ ] **Integrações:** Slack, Notion, notificações por e-mail (Fase 8+)

---

## 9. Métricas de Sucesso (Avaliação da Fase 7)

| Métrica | Meta | Justificativa |
|--------|--------|-----------|
| **Cobertura de Código** | >= 30% | Demonstra desenvolvimento orientado a testes nos módulos principais |
| **Commits Semânticos** | 100% dos dois contribuidores | Evidencia disciplina em versionamento e contribuição do time |
| **Cenários BDD** | >= 3 por user story (9 no total) | Rastreabilidade entre requisitos de negócio e casos de teste |
| **Tempo de Resposta da API** | < 15 s para 3 agentes | Indicador de performance e experiência do usuário |
| **Tratamento de Erros** | Zero exceções não tratadas em logs | Confiabilidade e degradação elegante |
| **Completude da Documentação** | 8 docs listados no PRD concluídos | Comunicação clara de decisões, arquitetura e uso |

---

## 10. Definition of Ready (DoR) das Tarefas

Antes de uma tarefa entrar em desenvolvimento:
- [ ] Cenário BDD escrito (arquivo Gherkin .feature)
- [ ] Critérios de aceite documentados (vinculados à user story)
- [ ] Contrato de API definido (se tarefa de backend)
- [ ] Mockups de componentes aprovados (se tarefa de frontend)
- [ ] Dependências com outras tarefas identificadas
- [ ] Responsável definido (contribuidor principal)

---

## 11. Cronograma e Marcos por Fase

| Fase | Gate | Responsável | Duração |
|-------|------|-------|----------|
| Fase 0 | Contratos finalizados, variáveis de ambiente definidas, baseline de CI/CD | Backend Lead | 1 dia |
| Fase 1 | Auth + schema concluídos, sem regressões | Backend Lead | 2 dias |
| Fase 2 | 3 agentes testados, prompts versionados | Backend Lead | 3 dias |
| Fase 3 | Orquestrador + contrato de API validados | Backend Lead | 2 dias |
| Fase 4 | Suite de testes + relatório de cobertura | Backend Lead | 2 dias |
| Fase 5 | Frontend concluído, integração testada | Frontend Lead | 4 dias |
| Fase 6 | Docs, UML, README, PRD, VIABILIDADE | Frontend Lead | 2 dias |
| Fase 7 | Hardening, revisão final, pronto para entrega | Backend Lead | 2 dias |

---

## Apêndice: Contrato de API (Referência)

Veja a seção "API Contract (frozen Phase 0)" em `.copilot-instructions.md` para schemas completos de request/response e códigos de erro.

**Principais Endpoints:**
- `POST /auth/login` -> token JWT
- `POST /api/validar` -> análise consolidada de 3 agentes
- `GET /api/validacoes` -> histórico do usuário
- `DELETE /api/validacoes/:id` -> remove uma validação
- `GET /health` -> status do sistema

---

**Versão do Documento:** 1.0  
**Última Atualização:** 2026-05-19  
**Próxima Revisão:** Final da Fase 0 (antes do início da Fase 1)

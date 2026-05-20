## Plan: Versao 3 Avancado Backend-First

Implementar a Versao 3 com arquitetura multiagente em fases curtas, priorizando backend, contratos de dados e testes antes do frontend completo. A abordagem reduz retrabalho, controla custo com gpt-4o-mini no desenvolvimento e garante criterio avaliativo (auth, persistencia, testes, documentacao e governanca) desde o inicio.

**Steps**
1. Fase 0 - Contratos e baseline de repositorio
1.1 Definir contrato canônico de resposta consolidada (mercado, tecnico, financeiro, metadados e erros por agente) e contrato de erro HTTP para 400/401/500 usando o documento-base como referencia.
1.2 Criar estrutura do projeto avancado (backend, frontend, docs, .github) e configurar scripts padrao de desenvolvimento, teste e coverage.
1.3 Definir variaveis de ambiente e arquivo de exemplo para OpenAI, JWT e SQLite.

2. Fase 1 - Backend foundation (bloqueia fase 2)
2.1 Inicializar backend com Express, camada de rotas e middleware de erro padronizado.
2.2 Configurar Prisma com SQLite e modelo minimo para usuario e validacao, incluindo campos para resultados por agente e consolidado.
2.3 Implementar autenticacao JWT simples (MVP com email) com middleware de protecao.

3. Fase 2 - OpenAI service + agentes (paralelo interno, depende da fase 1)
3.1 Implementar servico OpenAI unico com timeout, retries leves e parse robusto de JSON.
3.2 Implementar agente de mercado com prompt dedicado e validacao do payload retornado.
3.3 Implementar agente tecnico com validacao de enum de complexidade (baixa/media/alta).
3.4 Implementar agente financeiro com schema minimo obrigatorio.
3.5 Padronizar adaptadores para erro por agente, sem derrubar a requisicao inteira.

4. Fase 3 - Orquestracao e API principal (depende da fase 2)
4.1 Implementar orquestrador com execucao paralela dos 3 agentes e consolidacao deterministica.
4.2 Em falha parcial, retornar resposta parcial com campo de erro por agente (decisao aprovada).
4.3 Implementar POST /api/validar (protegido), persistindo resultado consolidado e resultados individuais.
4.4 Implementar endpoints de historico autenticados (listar, detalhar, remover) para suporte ao dashboard.

5. Fase 4 - Testes backend e qualidade (paralelo com fase 5 apos endpoints estaveis)
5.1 Criar testes unitarios para cada agente (contrato de campos obrigatorios).
5.2 Criar teste do orquestrador cobrindo sucesso total e falha parcial.
5.3 Criar testes de rota para auth e /api/validar (401 sem token, 200 com token).
5.4 Criar teste de persistencia para confirmar escrita em banco no fluxo de validacao.
5.5 Executar coverage e reportar baseline >=30% como meta observada inicialmente (sem gate bloqueante neste primeiro ciclo).

6. Fase 5 - Frontend inicial (depende da fase 3; paralelo com doc de prompts)
6.1 Configurar app React + Tailwind com servico API e armazenamento de token.
6.2 Implementar fluxo de login simples e protecao de chamadas.
6.3 Implementar formulario de ideia com validacao e estados de loading/erro.
6.4 Implementar dashboard de resultado consolidado com secoes de mercado, tecnico e financeiro.
6.5 Implementar historico basico com listar e abrir validacoes anteriores.

7. Fase 6 - Documentacao avaliativa e governanca (paralelo com fase 5)
7.1 Atualizar README com arquitetura multiagente, setup, execucao e testes.
7.2 Criar docs/PRD.md com visao do produto, funcionalidades e criterios de aceite.
7.3 Criar docs/VIABILIDADE.md com secoes exigidas (problema, papel da IA, limitacoes, custo-beneficio, escopo, futuro).
7.4 Criar docs/prompts.md com versoes de prompts por agente e decisao final.
7.5 Criar docs/user-stories.md e docs/uml (sequencia e classes em Mermaid).
7.6 Criar .github/pull_request_template.md e .github/CODEOWNERS alinhados a ownership por area.

8. Fase 7 - Hardening e fechamento (depende das fases 4, 5 e 6)
8.1 Revisar seguranca basica (.env, sanitizacao de input e limites de tamanho da ideia).
8.2 Validar UX de estados de erro, timeout e retorno parcial no frontend.
8.3 Ajustar pontos de confiabilidade (logs minimos e mensagens de erro acionaveis).
8.4 Revisar checklist de rubricas para garantir aderencia antes de entrega.

**Operating model for a 5-member team**
1. Membro A - Backend Lead e Integracao
1.1 Dono de arquitetura backend, orchestrator, padrao de erros e contratos de API.
1.2 Faz code review final de PRs backend e coordena releases para main.
1.3 Responsavel por conflitos de merge e decisoes de integracao.

2. Membro B - IA e Agentes
2.1 Implementa servico OpenAI e agentes (mercado, tecnico, financeiro).
2.2 Mantem docs/prompts.md e versionamento de prompt.
2.3 Trabalha com Membro E para cobertura de testes dos agentes.

3. Membro C - Dados e Auth
3.1 Implementa Prisma schema, migracoes e persistencia de validacoes.
3.2 Implementa auth JWT (login por email + middleware).
3.3 Garante seguranca basica de .env e limites de entrada.

4. Membro D - Frontend
4.1 Implementa login, IdeaForm, dashboard e historico.
4.2 Integra com API via contrato fechado (sem quebrar schema combinado).
4.3 Trabalha com Membro A para tratar estados de erro/timeout/falha parcial.

5. Membro E - QA, Docs e Governanca
5.1 Estrutura suite de testes (Jest, Supertest, Testing Library) e coverage.
5.2 Mantem README, PRD, VIABILIDADE, user stories e UML.
5.3 Mantem .github/pull_request_template.md, CODEOWNERS e checklist de rubrica.

**Task split by phase (who leads and who supports)**
1. Fase 0
1.1 Lead: A. Support: C, E.
1.2 Entregas: contrato API v1, estrutura de pastas, scripts, .env.example.

2. Fase 1
2.1 Lead: C. Support: A.
2.2 Entregas: Express base, Prisma schema, JWT middleware.

3. Fase 2
3.1 Lead: B. Support: E.
3.2 Entregas: openai service, 3 agentes, validacao de schema por agente.

4. Fase 3
4.1 Lead: A. Support: B, C.
4.2 Entregas: orchestrator paralelo, POST /api/validar, endpoints de historico.

5. Fase 4
5.1 Lead: E. Support: A, B, C.
5.2 Entregas: testes obrigatorios, relatorio de coverage, cenarios de erro.

6. Fase 5
6.1 Lead: D. Support: A.
6.2 Entregas: login frontend, formulario, dashboard e historico.

7. Fase 6
7.1 Lead: E. Support: todos.
7.2 Entregas: docs completas e alinhadas com implementacao real.

8. Fase 7
8.1 Lead: A. Support: todos.
8.2 Entregas: hardening, bugfix final, checklist de entrega.

**Integration strategy (to combine all solutions)**
1. Branching model
1.1 main protegida.
1.2 develop para integracao continua.
1.3 feature branches por dominio: feature/agents, feature/orchestrator, feature/auth-db, feature/frontend, feature/tests-docs.

2. Pull request rules
2.1 PR pequena e focada em uma entrega.
2.2 Minimo de 1 revisor obrigatorio e dono do modulo aprova.
2.3 Checklist obrigatorio no PR: testes locais, contrato API nao quebrado, docs atualizadas quando aplicavel.

3. Contract-first integration
3.1 Congelar contrato JSON de resposta consolidada na Fase 0.
3.2 Qualquer mudanca no contrato exige PR de compatibilidade + update simultaneo de backend, frontend e testes.
3.3 Manter exemplos de request/response no README e testes de contrato.

4. Cadencia recomendada
4.1 Daily de 15 minutos com bloqueios e plano do dia.
4.2 Integracao em develop pelo menos 1x por dia por membro ativo.
4.3 Demo interna no fim de cada fase com checklist de aceite.

5. Merge windows e cutoffs
5.1 Janela de merge principal: fim do dia.
5.2 24h antes da entrega: apenas bugfix, testes e documentacao.
5.3 Freeze final: sem novas features apos Fase 7 iniciar.

**Definition of Done per task**
1. Codigo implementado e revisado.
2. Testes da area passando.
3. Sem quebrar contrato API e sem regressao visivel.
4. Documentacao da area atualizada.
5. PR aprovada e mergeada em develop/main conforme etapa.

**Relevant files**
- c:/Users/geocarlos/Desktop/Coisas/sc-tech-ia-para-devs/validador-ideia-negocio/projeto_validador_ideias.md - Fonte de requisitos e criterios da Versao 3.
- c:/Users/geocarlos/Desktop/Coisas/sc-tech-ia-para-devs/validador-ideia-negocio/.git - Repositorio atual para bootstrap da nova estrutura.
- c:/Users/geocarlos/Desktop/Coisas/sc-tech-ia-para-devs/validador-ideia-negocio/validador-avancado/ - Raiz planejada para backend, frontend, docs e governanca (a criar).

**Verification**
1. Validar contrato de API manualmente com requests autenticados para auth, validar e historico.
2. Executar suite de testes backend (agentes, orquestrador, rotas, persistencia) e confirmar cenarios obrigatorios da rubrica.
3. Medir cobertura com jest --coverage e registrar resultado >=30% como baseline.
4. Validar fluxo frontend fim-a-fim: login, submissao de ideia, visualizacao de dashboard e consulta de historico.
5. Revisar documentacao obrigatoria (PRD, VIABILIDADE, prompts, UML, user stories, README) contra checklist avaliativo.

**Decisions**
- Modelo inicial: gpt-4o-mini no desenvolvimento, com caminho claro para migracao a gpt-4o.
- Falha parcial: retornar consolidado parcial com erro por agente, sem falhar tudo.
- Auth MVP: JWT com login simples por email.
- Cobertura: >=30% como meta monitorada no inicio, sem bloqueio de merge no primeiro ciclo.
- Ordem de entrega: backend-first, frontend em seguida.

**Further Considerations**
1. Definir formato exato do diagrama de classes Mermaid (entidades e relacionamentos) antes da fase de documentacao UML para evitar retrabalho.
2. Definir regra de CODEOWNERS por area (backend, frontend, docs) para padronizar aprovacoes de PR desde o inicio.
3. Decidir quando promover coverage para gate obrigatorio (ex.: apos primeiro marco estavel).
# UML - Sequencia de Validacao de Ideia

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant F as Frontend
    participant API as API Express (/api/validar)
    participant MW as AuthMiddleware
    participant VS as ValidationService
    participant ORQ as ValidacaoOrchestrator
    participant MA as MercadoAgent
    participant TA as TecnicoAgent
    participant FA as FinanceiroAgent
    participant P as Prisma Client
    participant DB as SQLite

    U->>F: Envia ideia de negocio
    F->>API: POST /api/validar + Bearer token
    API->>MW: Validar JWT

    alt Token ausente/invalido
        MW-->>API: 401 Unauthorized
        API-->>F: 401 Unauthorized
        F-->>U: Solicita novo login
    else Token valido
        MW-->>API: req.user = { id, email }
        API->>VS: validarIdeia(userId, ideia)

        alt Ideia com menos de 20 caracteres
            VS-->>API: Error(statusCode=400)
            API-->>F: 400 Validation error
            F-->>U: Exibe erro de validacao
        else Payload valido
            VS->>ORQ: orquestrarValidacao(ideia)

            par Execucao paralela dos agentes
                ORQ-->>MA: agent(ideia)
                MA-->>ORQ: Resultado mercado
            and
                ORQ-->>TA: agent(ideia)
                TA-->>ORQ: Resultado tecnico ou erro
            and
                ORQ-->>FA: agent(ideia)
                FA-->>ORQ: Resultado financeiro
            end

            ORQ-->>VS: consolidado + metricas
            VS->>P: validacao.create(data)
            P->>DB: INSERT Validacao
            DB-->>P: Registro persistido
            P-->>VS: Validacao criada

            VS-->>API: ValidacaoResponse
            API-->>F: 200 OK (sucesso total ou parcial)
            F-->>U: Exibe dashboard consolidado
        end
    end
```

## Observacao de fluxo alternativo relevante

O orquestrador implementa tolerancia a falha parcial: se um agente falhar, a chave do agente recebe `{ erro, mensagem }`, os demais resultados sao mantidos e a resposta continua `200` com metricas de sucesso/erro por agente.

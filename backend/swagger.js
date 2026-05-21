module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Validador de Ideia de Negócio API',
    version: '1.0.0',
    description: 'Documentação da API para o validador multiagente de ideias de negócio.'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de Desenvolvimento Local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'Alias de /auth/login para flexibilidade',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'empreendedor@exemplo.com'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Autenticação bem-sucedida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    expiresIn: { type: 'number' },
                    userId: { type: 'string' }
                  }
                }
              }
            }
          },
          400: { description: 'E-mail inválido ou não informado' },
          500: { description: 'Erro interno no servidor' }
        }
      }
    },
    '/api/validar': {
      post: {
        summary: 'Envia uma ideia de negócio para análise',
        security: [{ bearerAuth: [] }],
        tags: ['Validação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ideia'],
                properties: {
                  ideia: {
                    type: 'string',
                    example: 'Uma plataforma SaaS para freelancers organizarem seus projetos de desenvolvimento.'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Validação realizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    ideia: { type: 'string' },
                    consolidado: { type: 'object' },
                    metricas: { type: 'object' },
                    createdAt: { type: 'string' }
                  }
                }
              }
            }
          },
          400: { description: 'Erro de validação de input' },
          401: { description: 'Token ausente ou inválido' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    '/api/validacoes': {
      get: {
        summary: 'Recupera o histórico de validações do usuário logado',
        security: [{ bearerAuth: [] }],
        tags: ['Validação'],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Número da página'
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 },
            description: 'Quantidade de itens por página'
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Filtro de busca na descrição da ideia (case-insensitive)'
          }
        ],
        responses: {
          200: {
            description: 'Lista de validações do usuário obtida com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: { type: 'object' }
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' }
                  }
                }
              }
            }
          },
          401: { description: 'Token ausente ou inválido' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    '/api/validacoes/{id}': {
      get: {
        summary: 'Recupera os detalhes de uma validação específica',
        security: [{ bearerAuth: [] }],
        tags: ['Validação'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID da validação'
          }
        ],
        responses: {
          200: {
            description: 'Detalhes da validação retornados com sucesso'
          },
          401: { description: 'Token ausente ou inválido' },
          404: { description: 'Validação não encontrada' },
          500: { description: 'Erro interno do servidor' }
        }
      },
      delete: {
        summary: 'Exclui uma validação específica',
        security: [{ bearerAuth: [] }],
        tags: ['Validação'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID da validação'
          }
        ],
        responses: {
          200: {
            description: 'Validação excluída com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' }
                  }
                }
              }
            }
          },
          401: { description: 'Token ausente ou inválido' },
          404: { description: 'Validação não encontrada' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Retorna o status de integridade do servidor e do banco de dados',
        tags: ['Monitoramento'],
        responses: {
          200: {
            description: 'Sistemas integrados e operacionais'
          },
          500: {
            description: 'Um ou mais serviços de infraestrutura falharam'
          }
        }
      }
    }
  }
};

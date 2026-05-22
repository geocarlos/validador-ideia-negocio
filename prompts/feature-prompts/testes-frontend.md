Analise a estrutura atual do frontend e implemente os testes automatizados abaixo seguindo EXATAMENTE os padrões já utilizados no projeto.

Antes de criar qualquer teste:

1. Analise os testes existentes no repositório.
2. Identifique:
   - framework de testes utilizado
   - padrões de mock
   - helpers/utilitários existentes
   - convenções de nomes
   - setup global de testes
3. Reutilize os padrões já adotados.
4. NÃO altere código de produção sem necessidade.
5. Caso algum arquivo precise de pequeno ajuste para testabilidade, explique o motivo antes.

Objetivo:
Implementar os seguintes testes:

---

1. utils/validationMapper.test.js

---

Criar testes para:

- mapValidationResponse()

Validar que:

- o campo "ideia" da API é transformado em "idea"
- o campo "consolidado.tecnico" é transformado em "technicalAnalysis"
- o mapper preserva os demais dados corretamente
- comportamento com campos ausentes/null
- comportamento com payload vazio

Criar cenários positivos e edge cases.

---

2. services/apiConfig.test.js

---

Criar testes para:

- parseApiError()

Validar que:

- lê backendError.details quando existir
- fallback para backendError.error
- fallback para mensagem padrão quando não existir nada
- trata erros inesperados sem quebrar

Mockar respostas reais de API.

---

3. services/authService.test.js

---

Criar testes para:

- getUserFromToken()

Validar que:

- extrai userId corretamente de um JWT fake
- extrai email corretamente
- trata token inválido
- trata token vazio/null
- não quebra com payload incompleto

Utilizar JWT fake mockado sem dependência externa real.

---

4. services/validationService.test.js

---

Criar testes para:

- validateIdea()

Validar que:

- envia POST corretamente
- body enviado contém:
  {
  ideia: "texto"
  }

- header Authorization é enviado corretamente
- content-type é enviado corretamente
- trata erro de fetch
- trata resposta não-ok

Mockar fetch completamente.

Validar:

- URL chamada
- método HTTP
- headers
- payload

---

5. components/IdeaForm/IdeaForm.test.jsx

---

Criar testes para:

- formulário de ideia

Validar que:

- ideia com menos de 20 caracteres exibe mensagem de erro
- submit NÃO é executado quando inválido
- mensagem desaparece após correção
- submit ocorre quando válido

Utilizar React Testing Library seguindo os padrões do projeto.

Validar:

- interação real do usuário
- digitação
- clique no submit
- renderização da mensagem de erro

---

Requisitos obrigatórios:

- Cobertura real de comportamento
- Evitar testes frágeis
- NÃO testar implementação interna
- Utilizar describe/it organizados
- Remover duplicação
- Utilizar mocks limpos
- Garantir isolamento entre testes
- Garantir compatibilidade com CI

Ao final:

1. Mostre os arquivos criados
2. Mostre possíveis melhorias encontradas
3. Informe possíveis riscos ou inconsistências detectadas no código atual
4. Informe se algum teste revelou comportamento incorreto na implementação

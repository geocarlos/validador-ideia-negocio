Crie a feature de deleção de validações integrada ao endpoint DELETE /api/validacoes/:id.

# Componentes

* DeleteConfirmModal

# Hooks

* useDelete()

# Objetivo

Permitir remoção segura de validações.

# Requisitos

* Modal de confirmação
* Estado de loading
* Tratamento de erro
* Atualização automática da lista
* UX segura para evitar deleções acidentais
* Hook reutilizável
* Service desacoplado

# Entregue

* Código completo
* Estrutura de arquivos
* Exemplo de integração com HistoryList
* Fluxo completo de deleção

Antes de gerar o código:
1. Explique rapidamente a arquitetura escolhida
2. Liste a estrutura de arquivos
3. Depois gere os arquivos completos
4. Nunca omita imports
5. Nunca use pseudo-código
6. Se algum componente já existir, reutilize e refatore ao invés de duplicar lógica.
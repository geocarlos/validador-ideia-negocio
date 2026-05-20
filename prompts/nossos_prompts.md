# Nossos Prompts

## Criar branch e estrutura de pastas do projeto

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de executar qualquer ação.

### Tarefas

1. **Criar o branch**
   - Leia o plano geral para identificar o nome do branch definido
   - Crie o branch conforme a tarefa a partir de `develop` 
   - Faça checkout para o novo branch

2. **Criar a estrutura de pastas**
   - Com base na estrutura definida no plano geral, crie **todos** os diretórios listados
   - Para cada pasta, adicione um arquivo `.gitkeep` (ou `README.md` se especificado no plano) para que o Git rastreie os diretórios vazios

3. **Commit inicial**
   - Faça um commit com a mensagem: `chore: estrutura inicial de pastas conforme plano geral`

### Restrições
- Não crie arquivos além dos especificados no plano geral
- Não modifique nenhum arquivo existente em `main`
- Se o branch já existir, pergunte antes de sobrescrevê-lo

### Saída esperada
Ao final, liste os diretórios criados e confirme o nome do branch ativo.
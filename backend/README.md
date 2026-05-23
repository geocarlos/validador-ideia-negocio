# Backend - Validador de Ideia

## Como rodar o projeto passo a passo:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Crie as variáveis de ambiente:**
   - Copie o arquivo `.env.example` e renomeie para `.env`.
   - Abra o `.env` e adicione a sua chave da OpenAI em `OPENAI_API_KEY`.

3. **Crie o Banco de Dados:**
   ```bash
   npx prisma migrate dev
   ```

4. **Inicie o servidor localmente:**
   ```bash
   npm run dev
   ```

5. **Teste a API:**
   Abra no seu navegador: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

**Comandos Extras Úteis:**
- Para rodar os testes: `npm test`
- Para ver o banco de dados visualmente: `npx prisma studio`

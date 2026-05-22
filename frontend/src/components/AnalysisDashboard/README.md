/**
 * README - AnalysisDashboard Component Suite
 * 
 * Feature completa de dashboard para exibir análise multi-agente
 */

# AnalysisDashboard - Dashboard de Análise Multi-Agente

## 📋 Componentes

### 1. **AnalysisDashboard** (index.jsx)
Componente principal que orquestra toda a exibição de análise.

**Props:**
- `result` (Object): Resultado estruturado da análise
- `isLoading` (Boolean): Estado de carregamento
- `error` (Object): Objeto de erro com `message` e `type`

**Features:**
- Layout responsivo (mobile, tablet, desktop)
- Estados: loading, empty, error, success
- Normalização de dados
- Tratamento de dados ausentes

### 2. **SummaryCard** (SummaryCard.jsx)
Exibe resumo executivo com destaque visual.

**Props:**
- `summary` (String): Texto do resumo
- `score` (Number): Score de 0-10
- `recommendation` (String): Recomendação geral

**Features:**
- Score visual em círculo
- Recomendação em destaque
- Gradiente visual

### 3. **TechnicalAnalysis** (TechnicalAnalysis.jsx)
Card para análise técnica com ícone especializado.

**Props:**
- `data` (Object|String): Dados da análise
- `isLoading` (Boolean): Estado de carregamento

**Suporta:**
- Objetos (renderiza key-value)
- Strings (renderiza como texto)
- Dados ausentes

### 4. **MarketAnalysis** (MarketAnalysis.jsx)
Card para análise de mercado.

**Props:** Mesmas do TechnicalAnalysis

### 5. **FinancialAnalysis** (FinancialAnalysis.jsx)
Card para análise financeira.

**Props:** Mesmas do TechnicalAnalysis

## 🎨 Cores e Ícones

| Componente | Cor | Ícone |
|------------|-----|-------|
| Summary | Azul (blue) | 📋 |
| Technical | Roxo (purple) | ⚙️ |
| Market | Verde (green) | 📊 |
| Financial | Âmbar (amber) | 💰 |

## 🚀 Uso Básico

```jsx
import AnalysisDashboard from './components/AnalysisDashboard';

const MyPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AnalysisDashboard
      result={result}
      isLoading={isLoading}
    />
  );
};
```

## 📊 Estrutura de Dados

```javascript
{
  summary: "Texto de resumo executivo...",
  score: 7.5,
  recommendation: "Prosseguir com MVP...",
  technicalAnalysis: {
    complexity: "Médio",
    timeline: "3-4 meses",
    technologies: ["React", "Node.js"]
  },
  marketAnalysis: {
    targetAudience: "Startups tech",
    marketSize: "$5B+",
    competition: "Shopify, Stripe"
  },
  financialAnalysis: {
    modeloReceita: "SaaS com comissão",
    custoMensal: "$2-5k",
    breakEven: "8-12 meses"
  }
}
```

## 🛠️ Hooks e Utilitários

### useAnalysisData
Hook para normalizar e validar dados de análise.

```jsx
const { 
  technicalAnalysis, 
  marketAnalysis,
  financialAnalysis,
  summary,
  hasValidAnalysis 
} = useAnalysisData(result);
```

### Formatadores (utils/formatters.js)
- `formatAnalysisText()`: Formata texto com quebras de linha
- `extractScore()`: Extrai número de score
- `formatObject()`: Converte objeto em texto legível
- `normalizeAnalysisResult()`: Normaliza estrutura completa

### Validadores (utils/validators.js)
- `isFieldEmpty()`: Verifica se campo está vazio
- `hasEnoughData()`: Valida dados suficientes
- `isValidScore()`: Valida score numérico
- `getMissingFields()`: Lista campos faltantes

## 📱 Responsividade

- **Mobile**: 1 coluna
- **Tablet**: 2 colunas (md:grid-cols-2)
- **Desktop**: 3 colunas (lg:grid-cols-3)

## ✨ Estados Tratados

1. **Carregamento**: Spinner com mensagem
2. **Vazio**: Card informativo quando sem dados
3. **Erro**: Alerta com detalhes do erro
4. **Sucesso**: Exibição completa do dashboard
5. **Dados Ausentes**: Fallback para cada card

## 🎯 Melhorias de UX

1. **Feedback Visual**
   - Estados diferenciados por cor
   - Ícones para rápida identificação
   - Loading states elegantes

2. **Dados Ausentes**
   - Mensagens claras quando ausentes
   - Não quebra layout
   - Sugere próximos passos

3. **Performance**
   - Componentes simples e leves
   - Sem re-renders desnecessários
   - Reutilizáveis

4. **Acessibilidade**
   - Contraste adequado de cores
   - Textos claros
   - Ícones com fallback textual

## 📚 Exemplos

Ver pasta `examples/`:
- `DashboardPage.example.jsx`: Integração completa com formulário
- `SimpleDashboard.example.jsx`: Uso direto com dados mock
- `LoadingStates.example.jsx`: Diferentes estados de loading
- `ErrorStates.example.jsx`: Tratamento de erros

## 🔄 Fluxo de Integração

```
IdeaForm
  ↓ (submits idea)
API (validationService)
  ↓ (returns analysis)
AnalysisDashboard
  ├─ SummaryCard
  ├─ TechnicalAnalysis
  ├─ MarketAnalysis
  └─ FinancialAnalysis
```

## 🎓 Boas Práticas Implementadas

✅ **Separação de Responsabilidades**
- Componentes especializados por domínio
- Lógica em hooks e utilitários
- UI em componentes puros

✅ **Props Tipadas**
- JSDoc comentários em cada componente
- Documentação clara de tipos

✅ **Tratamento de Erros**
- Estados de erro explícitos
- Fallbacks para dados ausentes
- Validação de entrada

✅ **Reutilizabilidade**
- Cards independentes
- Hooks genéricos
- Utilitários modulares

✅ **Acessibilidade**
- Cores e ícones significativos
- Textos descritivos
- Navegação intuitiva

## 📝 Próximas Melhorias

- [ ] Exportar análise como PDF
- [ ] Compartilhamento de análise
- [ ] Comparação entre múltiplas ideias
- [ ] Gráficos e visualizações avançadas
- [ ] Histórico de versões da ideia
- [ ] Comentários/anotações personalizadas

/**
 * Estado visual de carregamento para validação de ideia.
 */

const LoadingState = () => (
  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 flex items-center gap-4">
    <div className="animate-spin text-3xl">⏳</div>
    <div>
      <p className="font-semibold text-blue-900">Analisando sua ideia...</p>
      <p className="text-sm text-blue-700">
        A análise está em andamento. Aguarde enquanto os agentes processam o seu texto.
      </p>
    </div>
  </div>
);

export default LoadingState;

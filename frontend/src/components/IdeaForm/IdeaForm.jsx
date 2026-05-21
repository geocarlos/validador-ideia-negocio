/**
 * Formulário de validação de ideias.
 * Integra UI, hooks reutilizáveis e serviço desacoplado.
 */

import useForm from '../../hooks/useForm';
import useValidation from '../../hooks/useValidation';
import LoadingState from './LoadingState';
import ValidationResults from './ValidationResults';

const validateIdeaForm = ({ idea }) => {
  const errors = {};

  if (!idea || !idea.trim()) {
    errors.idea = 'Descreva sua ideia para iniciar a validação.';
  } else if (idea.trim().length < 10) {
    errors.idea = 'A ideia precisa ter pelo menos 10 caracteres.';
  }

  return errors;
};

const IdeaForm = () => {
  const { result, loading, error, validateIdea } = useValidation();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { idea: '' },
    validate: validateIdeaForm,
    onSubmit: async ({ idea }) => {
      await validateIdea(idea.trim());
    },
  });

  const isBusy = loading || isSubmitting;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Valide sua ideia</h2>
        <p className="mt-2 text-gray-600">
          Envie a sua ideia para análise técnica, de mercado e financeira.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            Ideia de negócio
          </label>
          <textarea
            id="idea"
            name="idea"
            rows="6"
            value={values.idea}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isBusy}
            placeholder="Ex: Uma plataforma de assinatura para produtores locais..."
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          {touched.idea && errors.idea && (
            <p className="mt-2 text-sm text-red-600">{errors.idea}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isBusy ? 'Validando ideia...' : 'Validar ideia'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {loading && <LoadingState />}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {result && <ValidationResults result={result} />}
      </div>
    </div>
  );
};

export default IdeaForm;

/**
 * Hook reutilizável de formulário.
 * Separa controle de valores, validação e submissão.
 */

import { useState, useCallback } from 'react';

const useForm = ({ initialValues = {}, validate, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateValues = useCallback(
    (currentValues) => {
      if (!validate) return {};
      const validationErrors = validate(currentValues);
      setErrors(validationErrors);
      return validationErrors;
    },
    [validate],
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateValues(values);
  }, [validateValues, values]);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      const validationErrors = validateValues(values);
      setTouched(Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true,
      }), {}));

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      if (!onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validateValues, values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateValues,
  };
};

export default useForm;

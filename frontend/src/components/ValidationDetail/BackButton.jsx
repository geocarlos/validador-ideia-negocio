/**
 * BackButton - Componente reutilizável para voltar
 * 
 * Responsabilidades:
 * - Navegação segura (volta ao histórico ou rota padrão)
 * - Ícone visual de volta
 * - Comportamento consistente
 * 
 * @param {Object} props
 * @param {function} [props.onClick] - Callback customizado (se não fornecido, usa history.back())
 * @param {string} [props.fallbackPath] - Caminho padrão se não houver histórico (ex: "/validations")
 * @param {string} [props.label] - Label customizado do botão
 * @returns {JSX.Element}
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({
  onClick,
  fallbackPath = '/validations',
  label = 'Voltar',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Tenta voltar no histórico, senão vai para fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white 
                 border border-gray-300 rounded-md hover:bg-gray-50 
                 transition-colors font-medium text-sm"
      aria-label="Voltar para página anterior"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
};

export default BackButton;

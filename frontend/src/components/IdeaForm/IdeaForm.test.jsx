import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IdeaForm from './IdeaForm';

const mockValidateIdea = vi.fn();

vi.mock('../../hooks/useValidation', () => ({
  default: () => ({
    result: null,
    loading: false,
    error: null,
    validateIdea: mockValidateIdea,
  }),
}));

vi.mock('../AnalysisDashboard', () => ({
  default: () => null,
}));

vi.mock('./LoadingState', () => ({
  default: () => null,
}));

describe('IdeaForm', () => {
  beforeEach(() => {
    mockValidateIdea.mockReset();
    mockValidateIdea.mockResolvedValue({});
  });

  it('exibe mensagem de erro quando a ideia tem menos de 20 caracteres', async () => {
    const user = userEvent.setup();
    render(<IdeaForm />);

    await user.type(
      screen.getByLabelText(/ideia de negócio/i),
      'ideia curta',
    );
    await user.click(screen.getByRole('button', { name: /validar ideia/i }));

    expect(
      screen.getByText(/a ideia precisa ter pelo menos 20 caracteres/i),
    ).toBeInTheDocument();
  });

  it('não executa submit quando o formulário é inválido', async () => {
    const user = userEvent.setup();
    render(<IdeaForm />);

    await user.type(screen.getByLabelText(/ideia de negócio/i), 'curta');
    await user.click(screen.getByRole('button', { name: /validar ideia/i }));

    expect(mockValidateIdea).not.toHaveBeenCalled();
  });

  it('remove a mensagem de erro após correção e nova validação', async () => {
    const user = userEvent.setup();
    render(<IdeaForm />);

    const textarea = screen.getByLabelText(/ideia de negócio/i);

    await user.type(textarea, 'ideia curta');
    await user.click(screen.getByRole('button', { name: /validar ideia/i }));
    expect(
      screen.getByText(/a ideia precisa ter pelo menos 20 caracteres/i),
    ).toBeInTheDocument();

    await user.clear(textarea);
    await user.type(
      textarea,
      'Uma plataforma de assinatura para produtores locais',
    );
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText(/a ideia precisa ter pelo menos 20 caracteres/i),
      ).not.toBeInTheDocument();
    });
  });

  it('executa submit quando a ideia é válida', async () => {
    const user = userEvent.setup();
    const validIdea = 'Uma plataforma de assinatura para produtores locais';
    render(<IdeaForm />);

    await user.type(screen.getByLabelText(/ideia de negócio/i), validIdea);
    await user.click(screen.getByRole('button', { name: /validar ideia/i }));

    await waitFor(() => {
      expect(mockValidateIdea).toHaveBeenCalledTimes(1);
      expect(mockValidateIdea).toHaveBeenCalledWith(validIdea);
    });
  });
});

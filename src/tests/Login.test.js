import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Test login page', () => {
  test('Components in screen', () => {
    render(<App />);
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const btn = screen.getByRole('button', { name: /enter/i });

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  test('Test type inputs', () => {
    render(<App />);
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const btn = screen.getByRole('button', { name: /enter/i });

    userEvent.type(email, 'email@email.com');
    userEvent.type(password, '1231231');

    expect(btn).not.toBeDisabled();

    userEvent.click(btn);

    // expect(history.location.pathname).toBe('/meals');
  });
});

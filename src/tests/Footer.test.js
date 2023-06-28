import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/RenderWithRouter';

describe('Componente Footer', () => {
  it('Existem os ícones de drinks e refeições no componente', () => {
    renderWithRouterAndContext(<App />, '/');

    const mealIcon = screen.getByRole('img', {
      name: /meal icon/i,
    });

    expect(mealIcon).toBeInTheDocument();

    const drinksIcon = screen.getByRole('img', {
      name: /drink icon/i,
    });

    expect(drinksIcon).toBeInTheDocument();
  });

  it('O ícone de meals no componente leva para suas respectivas páginas', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    const mealBtn = await screen.getByRole('img', {
      name: /meal icon/i,
    });

    userEvent.click(mealBtn);

    await waitFor(() => expect(history.location.pathname).toEqual('/meals'));

    const drinksBtn = await screen.getByRole('img', {
      name: /drink icon/i,
    });

    userEvent.click(drinksBtn);

    await waitFor(() => expect(history.location.pathname).toEqual('/drinks'));
  });

  it('O ícone de drinks no componente leva para suas respectivas páginas', async () => {
    const { history } = renderWithRouterAndContext(<App />, '/meals');

    const drinksBtn = await screen.getByRole('img', {
      name: /drink icon/i,
    });

    userEvent.click(drinksBtn);

    await waitFor(() => expect(history.location.pathname).toEqual('/drinks'));
  });
});

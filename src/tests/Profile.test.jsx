import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/RenderWithRouter';
import LocalStorageMock from './helpers/LocalStorageMock';

const SAMPLE_EMAIL = 'oi@mail.com';

describe('Testes da pagina Profile', () => {
  global.localStorage = new LocalStorageMock();

  it('Teste os elementos da tela', async () => {
    global.localStorage.setItem('user', JSON.stringify({ email: SAMPLE_EMAIL }));

    renderWithRouterAndContext(<App />, '/profile');

    const iconPage = screen.getByRole('img', {
      name: /profile icon/i,
    });
    expect(iconPage).toBeInTheDocument();

    const profileText = screen.getByText(/profile/i);
    expect(profileText).toBeInTheDocument();

    const email = screen.getByText(SAMPLE_EMAIL);
    expect(email).toBeInTheDocument();

    const btnDoneRecipe = screen.getByRole('button', {
      name: /done recipes/i,
    });
    expect(btnDoneRecipe).toBeInTheDocument();

    const btnFavoriteRecipes = screen.getByRole('button', {
      name: /favorite recipes/i,
    });
    expect(btnFavoriteRecipes).toBeInTheDocument();

    const btnLogout = screen.getByRole('button', {
      name: /logout/i,
    });
    expect(btnLogout).toBeInTheDocument();
  });

  it(
    'Verifica se ao clicar no botão "Done Recipes" a rota muda para "/done-recipes"',
    async () => {
      global.localStorage.clear();

      const { history } = renderWithRouterAndContext(<App />, '/profile');

      const btnDone = screen.getByRole('button', {
        name: /done recipes/i,
      });
      expect(btnDone).toBeInTheDocument();
      userEvent.click(btnDone);

      await waitFor(() => expect(history.location.pathname).toEqual('/done-recipes'));

      userEvent.click(screen.getByRole('img', {
        name: /profile icon/i,
      }));

      await waitFor(() => expect(history.location.pathname).toEqual('/profile'));

      const btnFav = screen.getByRole('button', {
        name: /favorite recipes/i,
      });
      expect(btnFav).toBeInTheDocument();
      userEvent.click(btnFav);
      await waitFor(() => expect(history.location.pathname).toEqual('/favorite-recipes'));

      userEvent.click(screen.getByRole('img', {
        name: /profile icon/i,
      }));
      const btnLogout = screen.getByRole('button', {
        name: /logout/i,
      });
      expect(btnLogout).toBeInTheDocument();
      userEvent.click(btnLogout);
      await waitFor(() => expect(history.location.pathname).toEqual('/'));
    },
  );
});

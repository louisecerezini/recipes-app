import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndContext from './helpers/RenderWithRouter';
import fetch from '../../cypress/mocks/fetch';

describe('Teste do componente Details', () => {
  const pathMeals = '/meals/52771';
  const pathDrinks = '/drinks/178319';
  beforeEach(() => {
    global.fetch = jest.fn(fetch);
  });

  afterEach(jest.restoreAllMocks);

  it('Verifica se a pagina renderiza o conteudo de Meals', async () => {
    renderWithRouterAndContext(<App />, pathMeals);

    const recipeTitle = await screen.findByRole('heading', { name: /spicy arrabiata penne/i });
    expect(recipeTitle).toBeInTheDocument();
  });

  it('Verifica se a pagina renderiza o conteudo de Drinks', async () => {
    renderWithRouterAndContext(<App />, pathDrinks);

    const recipeTitle = await screen.findByRole('heading', { name: /aquamarine/i });
    expect(recipeTitle).toBeInTheDocument();
  });

  it('Verificar se a mock da Api esta sendo chamada', async () => {
    renderWithRouterAndContext(<App />, pathMeals);

    expect(global.fetch).toHaveBeenCalled();
  });

  it('Verifica se o botão share funciona', async () => {
    renderWithRouterAndContext(<App />, pathMeals);

    Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn() } });

    const btnShare = screen.getByTestId('share-btn');
    expect(btnShare).toBeInTheDocument();

    userEvent.click(btnShare);

    const linkCopied = screen.getByText(/link copied!/i);
    expect(linkCopied).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/link copied!/i), { timeout: 2000 });
  });

  it('Verifica se o botão favoritar funciona na tela de Drinks', async () => {
    renderWithRouterAndContext(<App />, pathDrinks);

    const recipeTitle = await screen.findByRole('heading', { name: /aquamarine/i });
    expect(recipeTitle).toBeInTheDocument();

    const favoriteBtn = screen.getByTestId('favorite-btn');
    expect(favoriteBtn).toBeInTheDocument();

    userEvent.click(favoriteBtn);

    expect(favoriteBtn).toHaveAttribute('src', 'blackHeartIcon.svg');

    userEvent.click(favoriteBtn);

    expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');
  });

  it('Verifica se o botão favoritar funciona na tela de Meals', async () => {
    renderWithRouterAndContext(<App />, pathMeals);

    const recipeTitle = await screen.findByRole('heading', { name: /spicy arrabiata penne/i });
    expect(recipeTitle).toBeInTheDocument();

    const favoriteBtn = screen.getByTestId('favorite-btn');
    expect(favoriteBtn).toBeInTheDocument();

    userEvent.click(favoriteBtn);

    expect(favoriteBtn).toHaveAttribute('src', 'blackHeartIcon.svg');

    userEvent.click(favoriteBtn);

    expect(favoriteBtn).toHaveAttribute('src', 'whiteHeartIcon.svg');
  });
});

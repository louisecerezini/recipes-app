import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import App from '../App';
import renderWithRouterAndContext from './helpers/RenderWithRouter';
import meals from './mocks/meals';
import drinks from './mocks/drinks';
import drinkCategories from './mocks/drinkCategories';
import mealCategories from './mocks/mealCategories';
import beefMeals from './mocks/beefMeals';
import ordinaryDrinks from './mocks/ordinaryDrinks';

describe('Componente Recipes', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValueOnce(meals).mockResolvedValueOnce(mealCategories),
    });
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });
  // it('Ao clicar no botão, o usuário é redirecionado para a página de perfil', async () => {
  //   const { history } = renderWithRouterAndContext(<App />, '/drinks');

  //   const profileButton = screen.getByRole('img', { name: /profile icon/i });
  //   userEvent.click(profileButton);

  //   await waitFor(() => {
  //     expect(history.location.pathname).toBe('/profile');
  //   });
  // });

  // it('Ao clicar no botão de pesquisa, uma textbox aparece na tela', async () => {
  //   const { history } = renderWithRouterAndContext(<App />, '/meals');

  //   const searchButton = screen.getByRole('img', {
  //     name: /search icon/i,
  //   });

  //   userEvent.click(searchButton);

  //   expect(screen.getByRole('textbox')).toBeInTheDocument();
  // });

  // it('Existem os cards de receitas na renderização', async () => {
  //   renderWithRouterAndContext(<App />, '/meals');

  //   await screen.findAllByTestId(/recipe-card/);
  //   const recipeCard = screen.getByTestId('0-recipe-card');
  //   expect(recipeCard).toBeInTheDocument();
  // });

  // it('Existem botões de categorias na renderização', async () => {
  //   renderWithRouterAndContext(<App />, '/drinks');

  //   await screen.findAllByRole('button', { name: /ordinary drink/i });
  //   const categoryButton = screen.getByRole('button', { name: /ordinary drink/i });
  //   expect(categoryButton).toBeInTheDocument();
  // });

  it('Existem 12 cards renderizados inicialmente no endpoint /drinks', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });
    renderWithRouterAndContext(<App />, '/drinks');

    const allButton = screen.getByRole('button', {
      name: /all/i,
    });

    userEvent.click(allButton);

    await screen.findAllByTestId(/recipe-card/);
    const recipeCards = screen.getAllByTestId(/recipe-card/);
    expect(recipeCards).toHaveLength(12);
  });

  it('Existem 12 cards renderizados inicialmente no endpoint /meals', async () => {
    renderWithRouterAndContext(<App />, '/meals');

    const allButton = screen.getByRole('button', {
      name: /all/i,
    });

    userEvent.click(allButton);

    await screen.findAllByTestId(/recipe-card/);
    const recipeCards = screen.getAllByTestId(/recipe-card/);
    expect(recipeCards).toHaveLength(12);
  });

  it('Ao clicar nos botões de categorias, apenas os drinks relativos à aquela categoria são renderizados ', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      // primeira e segunda chamadas - dentro do UseEffect
      json: jest.fn().mockResolvedValueOnce(drinks)
        .mockResolvedValueOnce(drinkCategories)
        // terceira chamada - quando o usuario clica no filtro ordinary Drinks
        .mockResolvedValueOnce(ordinaryDrinks)
        // quarta chamada -quando o usuario clica novamente no botao
        .mockResolvedValueOnce(drinks),
    });
    renderWithRouterAndContext(<App />, '/drinks');

    await screen.findAllByRole('button', { name: /ordinary drink/i });
    const categoryButton = screen.getByRole('button', { name: /ordinary drink/i });

    userEvent.click(categoryButton);

    const drinkCategory = await screen.findByText(/mile long island iced tea/i);

    expect(drinkCategory).toBeInTheDocument();

    userEvent.click(categoryButton);

    const allDrinks = await screen.findByText(/gg/i);

    expect(allDrinks).toBeInTheDocument();
  });

  it('Ao clicar nos botões de categorias, apenas as meals relativos à aquela categoria são renderizados ', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValueOnce(meals)
        .mockResolvedValueOnce(mealCategories)
        .mockResolvedValueOnce(beefMeals),
    });
    renderWithRouterAndContext(<App />, '/meals');

    await screen.findByRole('button', {
      name: /beef/i,
    });
    const categoryButton = screen.getByRole('button', {
      name: /beef/i,
    });

    userEvent.click(categoryButton);

    const mealsCategory = await screen.findByText(/beef and mustard pie/i);

    expect(mealsCategory).toBeInTheDocument();
  });

  it('Ao clicar nos cards no /meals, o usuário é redirecionado para os detalhes daquela receita', async () => {
    const history = createMemoryHistory({ initialEntries: ['/meals'] });
    renderWithRouterAndContext(<App />, '/meals', history);

    const cardButton = await screen.findByRole('img', {
      name: /corba/i,
    });

    screen.debug(cardButton);

    userEvent.click(cardButton);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52977');
    });
  });

  it('Ao clicar nos cards no /drinks, o usuário é redirecionado para os detalhes daquela receita', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValueOnce(drinks)
        .mockResolvedValueOnce(drinkCategories),
    });
    const { history } = renderWithRouterAndContext(<App />, '/drinks');

    const cardButton = await screen.findByTestId('0-card-img');

    userEvent.click(cardButton);

    await waitFor(() => expect(history.location.pathname).toEqual('/drinks/15997'));
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';
import MealIcon from '../images/mealIcon.svg';
import RecipesProvider from '../context/recipesProvider';
import meals from './mocks/meals';

describe('Quando renderizando o componente header', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Renderiza o titulo de acordo com o parametro title', async () => {
    const pageTitle = 'Meals';
    render(<Header pageTitle={ pageTitle } />);
    const titleElement = await screen.findByTestId('page-title');
    expect(titleElement).toHaveTextContent(pageTitle);
  });
  // each
  it.each`
  showIcon | showSearch
  ${true}  | ${true}   
  ${true}  | ${false}  
  ${false} | ${true}   
  ${false} | ${false}
  `('Renderiza os icones da tela de acordo com os parametros '
    + '\'$showIcon\' e \'$showSearch\'', async ({ showIcon, showSearch }) => {
    const history = createMemoryHistory();

    render(
      <Router history={ history }>
        <Header showIcon={ showIcon } showSearch={ showSearch } />
      </Router>,
    );

    const searchElement = screen.queryByTestId('search-top-btn');
    const profileElement = screen.queryByTestId('profile-top-btn');

    if (showSearch) {
      expect(searchElement).toBeInTheDocument();
    } else {
      expect(searchElement).not.toBeInTheDocument();
    }

    if (showIcon) {
      expect(profileElement).toBeInTheDocument();
    } else {
      expect(profileElement).not.toBeInTheDocument();
    }
  });

  it('Mostra a searchBar caso o usuario clique no Search icon', async () => {
    const history = createMemoryHistory();

    render(
      <RecipesProvider>
        <Router history={ history }>
          <Header showIcon showSearch pageIcon={ MealIcon } />
        </Router>
      </RecipesProvider>,
    );

    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    const searchIcon = await screen.findByTestId('search-top-btn');
    userEvent.click(searchIcon);
    expect(screen.queryByTestId('search-input')).toBeInTheDocument();

    expect(screen.queryByTestId('page-icon-header')).toBeInTheDocument();
  });
});

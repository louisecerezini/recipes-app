import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';
import RecipesProvider from '../context/recipesProvider';
import drinks from './mocks/drinks';
import meals from './mocks/meals';

const INGREDIENT_SEARCH_RADIO_ID = 'ingredient-search-radio';
const NAME_SEARCH_RADIO_ID = 'name-search-radio';
const FIRST_LETTER_SEARCH_RADIO_ID = 'first-letter-search-radio';
const SEARCH_INPUT_ID = 'search-input';
const SEARCH_BUTTON_ID = 'exec-search-btn';

describe('Quando renderizando o componente searchBar para meals', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Renderiza os elementos da tela de pesquisa', () => {
    const pageType = 'meals';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radioIngredient = screen.queryByTestId(INGREDIENT_SEARCH_RADIO_ID);
    const radioName = screen.queryByTestId(NAME_SEARCH_RADIO_ID);
    const radioFirstLetter = screen.queryByTestId(FIRST_LETTER_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    expect(radioIngredient).toBeInTheDocument();
    expect(radioName).toBeInTheDocument();
    expect(radioFirstLetter).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('Pesquisa por ingrediente quando radio ingredients estiver selecionado', () => {
    const pageType = 'meals';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radioIngredient = screen.queryByTestId(INGREDIENT_SEARCH_RADIO_ID);
    const radioName = screen.queryByTestId(NAME_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'chicken';
    const urlPrefix = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';

    userEvent.click(radioName);
    userEvent.click(radioIngredient);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it('Pesquisa por name quando radio name estiver selecionado', () => {
    const pageType = 'meals';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(NAME_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'abcd';
    const urlPrefix = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it('Pesquisa por first letter quando radio first letter estiver selecionado', () => {
    const pageType = 'meals';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(FIRST_LETTER_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'a';
    const urlPrefix = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it(`Pesquisa por first letter FALHA quando radio first letter 
  estiver selecionado e usuario digitar mais de uma letra`, () => {
    const pageType = 'meals';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(FIRST_LETTER_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'abc';

    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(0);
    expect(global.alert).toBeCalledTimes(1);
  });
});

describe('Quando renderizando o componente searchBar para drinks', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Pesquisa por ingrediente quando radio ingredients estiver selecionado', () => {
    const pageType = 'drinks';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radioIngredient = screen.queryByTestId(INGREDIENT_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'mojito';
    const urlPrefix = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

    userEvent.click(radioIngredient);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it('Pesquisa por name quando radio name estiver selecionado', () => {
    const pageType = 'drinks';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(NAME_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'abcd';
    const urlPrefix = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it('Pesquisa por first letter quando radio first letter estiver selecionado', () => {
    const pageType = 'drinks';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(FIRST_LETTER_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);

    const param = 'a';
    const urlPrefix = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';

    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch.mock.calls[0][0].includes(param)).toBeTruthy();
    expect(global.fetch.mock.calls[0][0].includes(urlPrefix)).toBeTruthy();
  });

  it(`Pesquisa por first letter FALHA quando radio first letter 
  estiver selecionado e usuario digitar mais de uma letra`, () => {
    const pageType = 'drinks';
    render(
      <RecipesProvider>
        <SearchBar pageType={ pageType } />
      </RecipesProvider>,
    );

    const radio = screen.queryByTestId(FIRST_LETTER_SEARCH_RADIO_ID);
    const input = screen.queryByTestId(SEARCH_INPUT_ID);
    const button = screen.queryByTestId(SEARCH_BUTTON_ID);
    const param = 'abc';
    userEvent.click(radio);
    userEvent.type(input, param);
    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(0);
    expect(global.alert).toBeCalledTimes(1);
  });
});

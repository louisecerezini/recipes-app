import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RecipesContext from './recipesContext';
import { fetchDrinks, fetchMeals } from '../services/fetchApi';

function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const history = useHistory();

  // funcao responsavel por chamar o service e salvar o resultado no state recipes
  const fetch = useCallback(async (type, url) => {
    if (type === 'meals') {
      const dataApi = await fetchMeals(url);
      if (dataApi?.length === 1) {
        history.push(`/meals/${dataApi[0].idMeal}`);
      } else if (!dataApi?.length) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
      // atualiza o estado
      setRecipes(dataApi);
    } else {
      const dataApi = await fetchDrinks(url);
      if (dataApi?.length === 1) {
        history.push(`/drinks/${dataApi[0].idDrink}`);
      } else if (!dataApi?.length) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
      setRecipes(dataApi);
    }
  }, [setRecipes, history]);

  // funcao que e chamada pelo botao do componente SearchBar(pode ser a fetchMeals OU fetchDrink)
  // dependendo do radio que o usuario selecionou vai cair um case diferente (cada um tem sua URL)
  const fetchMealRecipes = useCallback(async (searchType, searchParam) => {
    switch (searchType) {
    case 'ingredient':
      // temos outra funcao sendo chamada aqui (fetch- em cima na pagina)
      await fetch(
        'meals',
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchParam}`,
      );
      break;
    case 'name':
      await fetch(
        'meals',
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchParam}`,
      );
      break;
    case 'first-letter':
      if (searchParam.length > 1) {
        global.alert('Your search must have only 1 (one) character');
        return;
      }

      await fetch(
        'meals',
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchParam}`,
      );
      break;
    default:
      console.log('invalid');
    }
  }, [fetch]);

  const fetchDrinkRecipes = useCallback(async (searchType, searchParam) => {
    switch (searchType) {
    case 'ingredient':
      await fetch(
        'drinks',
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchParam}`,
      );
      break;
    case 'name':
      await fetch(
        'drinks',
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchParam}`,
      );
      break;
    case 'first-letter':
      if (searchParam.length > 1) {
        global.alert('Your search must have only 1 (one) character');
        return;
      }

      await fetch(
        'drinks',
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchParam}`,
      );
      break;
    default:
      console.log('invalid');
    }
  }, [fetch]);

  const context = useMemo(() => ({
    fetchMealRecipes,
    fetchDrinkRecipes,
    recipes,
    setRecipes,
  }), [fetchMealRecipes, fetchDrinkRecipes, recipes, setRecipes]);

  return (
    <RecipesContext.Provider value={ context }>
      {children}
    </RecipesContext.Provider>
  );
}

RecipesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipesProvider;

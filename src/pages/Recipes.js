import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchDrinks, fetchMeals } from '../services/fetchApi';
import RecipesContext from '../context/recipesContext';
import '../css/Recipe.css';

const MAX_RECIPES_ON_PAGE = 12;
const MAX_CATEGORIES_ON_PAGE = 5;

export default function Recipes() {
  // recipes precisa vir do context para poder ser acessado pelos outros componentes tambem(exemplo:searchBar)
  const { recipes, setRecipes } = useContext(RecipesContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const callFetch = async () => {
      if (history.location.pathname === '/meals') {
        const mealsAPI = await fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const mealsCategories = await fetchMeals('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        setRecipes(mealsAPI);
        setCategories(mealsCategories);
      } else if (history.location.pathname === '/drinks') {
        const drinksAPI = await fetchDrinks('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        const drinsCategories = await fetchDrinks('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        setRecipes(drinksAPI);
        setCategories(drinsCategories);
      }
    };
    callFetch();
  }, [history.location.pathname, setRecipes]);

  const allRecipes = async () => {
    if (history.location.pathname === '/meals') {
      const mealsAPI = await fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      setRecipes(mealsAPI);
    } else if (history.location.pathname === '/drinks') {
      const drinksAPI = await fetchDrinks('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      setRecipes(drinksAPI);
    }
  };

  const whatCategory = async (category) => {
    let MealsAPI = [];
    let DrinksAPI = [];

    if (selectedCategory === category && filterActive) {
      setSelectedCategory(null);
      setFilterActive(false);
      await allRecipes();
    } else if (history.location.pathname === '/meals') {
      MealsAPI = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      setRecipes(MealsAPI);
      setSelectedCategory(category);
      setFilterActive(true);
    } else {
      DrinksAPI = await fetchDrinks(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
      setRecipes(DrinksAPI);
      setSelectedCategory(category);
      setFilterActive(true);
    }
  };

  const receipeDetails = (rec) => {
    if (history.location.pathname === '/drinks') {
      history.push(`/drinks/${rec}`);
    } else {
      history.push(`/meals/${rec}`);
    }
  };

  return (
    <div>
      <div className="category-conteiner">
        <button
          className="category-btn"
          data-testid="All-category-filter"
          onClick={ allRecipes }
        >
          All
        </button>
        {categories?.map((categoryName, index) => {
          if (index >= MAX_CATEGORIES_ON_PAGE) {
            return null;
          }
          return (
            <div key={ index }>
              <button
                className="category-btn"
                onClick={ () => whatCategory(categoryName.strCategory) }
                data-testid={ `${categoryName.strCategory}-category-filter` }
              >
                {categoryName.strCategory}
              </button>
            </div>
          );
        })}
      </div>

      <div className="recipe-list">
        {recipes?.map((recipe, index) => {
          if (index >= MAX_RECIPES_ON_PAGE) {
            return null;
          }
          return (
            <div
              key={ index }
              data-testid={ `${index}-recipe-card` }
              className="recipeCard"
            >
              <div>
                <p
                  data-testid={ `${index}-card-name` }
                  className="recipe-title"
                >
                  {history.location.pathname === '/drinks'
                    ? recipe.strDrink : recipe.strMeal}

                </p>
              </div>
              <button
                className="img-to-details"
                onClick={ history.location.pathname === '/drinks'
                  ? () => receipeDetails(recipe.idDrink)
                  : () => receipeDetails(recipe.idMeal) }
              >
                <img
                  data-testid={ `${index}-card-img` }
                  alt={ history.location.pathname === '/drinks'
                    ? recipe.strstrDrink : recipe.strMeal }
                  src={ history.location.pathname === '/drinks'
                    ? recipe.strDrinkThumb : recipe.strMealThumb }
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

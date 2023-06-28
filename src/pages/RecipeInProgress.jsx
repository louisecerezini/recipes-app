import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import '../css/RecipeInProgress.css';

function RecipeInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const locPath = history.location.pathname;
  const page = locPath.includes('meals') ? '/meals' : '/drinks';

  const [recipe, setRecipe] = useState({
    name: '',
    image: '',
    category: '',
    ingredients: [],
    instructions: '',
    nationality: '',
    alcoholicOrNot: '',
    tags: [],
  });

  const [completedIngredients, setCompletedIngredients] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [areAllIngredientsChecked, setAreAllIngredientsChecked] = useState(false);

  async function meals() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const json = await response.json();
    const data = json.meals;
    const ingredientsArray = [];
    const ingredientsNumber = 20;
    for (let i = 1; i <= ingredientsNumber; i += 1) {
      const ingredientsOrder = `strIngredient${i}`;
      const ingredients = data[0][ingredientsOrder];

      if (ingredients && ingredientsOrder !== '') {
        ingredientsArray.push(ingredients);
      }
    }
    setRecipe({
      name: data[0].strMeal,
      image: data[0].strMealThumb,
      category: data[0].strCategory,
      ingredients: ingredientsArray,
      instructions: data[0].strInstructions,
      nationality: data[0].strArea,
      tags: data[0].strTags,
    });
  }

  async function drinks() {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const json = await response.json();
    const data = json.drinks;
    const ingredientsArray = [];
    const maxIngredients = 20;
    for (let i = 1; i <= maxIngredients; i += 1) {
      const ingredientKey = `strIngredient${i}`;
      const ingredientValue = data[0][ingredientKey];

      if (ingredientValue && ingredientKey !== '') {
        ingredientsArray.push(ingredientValue);
      }
    }
    setRecipe({
      name: data[0].strDrink,
      image: data[0].strDrinkThumb,
      category: data[0].strCategory,
      ingredients: ingredientsArray,
      instructions: data[0].strInstructions,
      nationality: data[0].strArea,
      alcoholicOrNot: data[0].strAlcoholic,
    });
  }

  const mealsDrinks = () => {
    if (page === '/meals') {
      meals();
    } else {
      drinks();
    }
  };

  useEffect(() => {
    mealsDrinks();
  }, []);

  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
    const savedIngredients = inProgressRecipes[id] || [];

    setCompletedIngredients(savedIngredients);
  }, [id]);

  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
    inProgressRecipes[id] = completedIngredients;
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  }, [completedIngredients, id]);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isRecipeFavorite = favoriteRecipes
      .some((recipe01) => (recipe01.id === id && recipe01.type === page
        .includes('/meals') ? 'comida' : 'bebida'));
    setIsFavorite(isRecipeFavorite);
  }, [id, page]);
  const negativeNumber = -1;
  const handleIngredientChange = (ingredient) => {
    const updatedIngredients = [...completedIngredients];
    const index = updatedIngredients.indexOf(ingredient);
    if (index > negativeNumber) {
      updatedIngredients.splice(index, 1);
    } else {
      updatedIngredients.push(ingredient);
    }
    setCompletedIngredients(updatedIngredients);
  };
  const handleFavorite = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isRecipeFavorite = favoriteRecipes.some((recipe02) => recipe02.id === id
      && recipe02.type === (page.includes('/meals') ? 'meal' : 'drink'));
    if (isRecipeFavorite) {
      const updatedFavorites = favoriteRecipes.filter((recipe03) => recipe03.id !== id
        || recipe03.type !== (page.includes('/meals') ? 'meal' : 'drink'));
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
      console.log(updatedFavorites);
    } else {
      const newFavoriteRecipe = {
        id,
        type: page.includes('/meals') ? 'meal' : 'drink',
        nationality: recipe.nationality || '',
        category: recipe.category,
        alcoholicOrNot: recipe.alcoholicOrNot || '',
        name: recipe.name,
        image: recipe.image,
      };
      const updatedFavorites = [...favoriteRecipes, newFavoriteRecipe];
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
      console.log(updatedFavorites);
    }
  };
  const redirectToDoneRecipes = () => {
    let doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const [tag1, tag2] = recipe.tags ? recipe.tags.split(',') : ['', ''];
    const newDoneRecipe = {
      id,
      nationality: recipe.nationality || '',
      name: recipe.name,
      category: recipe.category,
      image: recipe.image,
      tags: page.includes('/meals') ? [tag1, tag2] : [],
      alcoholicOrNot: recipe.alcoholicOrNot || '',
      type: page.includes('/meals') ? 'meal' : 'drink',
      doneDate: new Date().toISOString(),
    };

    if (!Array.isArray(doneRecipes)) {
      doneRecipes = [];
    }

    const isRecipeAlreadyDone = doneRecipes
      .some((recipe04) => recipe04.id === newDoneRecipe.id);
    if (!isRecipeAlreadyDone) {
      const updatedDoneRecipes = [...doneRecipes, newDoneRecipe];
      localStorage.setItem('doneRecipes', JSON.stringify(updatedDoneRecipes));
    }
    history.push('/done-recipes');
  };
  const handleShare = () => {
    const recipeLink = window.location.href;
    const cleanRecipeLink = recipeLink.replace('/in-progress', '');
    navigator.clipboard.writeText(cleanRecipeLink)
      .then(() => setIsLinkCopied(true))
      .catch((error) => console.error('Failed to copy recipe link', error));
  };
  const checkAllIngredients = () => {
    setAreAllIngredientsChecked(completedIngredients
      .length === recipe.ingredients.length);
  };
  useEffect(() => {
    checkAllIngredients();
  }, [completedIngredients]);
  return (
    <div className="recipe-datail-container">
      <div className="details-content ">
        <img
          className="imgRecipeDetail"
          data-testid="recipe-photo"
          src={ recipe.image }
          alt="Imagem do prato pronto"
        />
        <h3 data-testid="recipe-title">{recipe.name}</h3>
        <div className="share-and-favorite">
          {isLinkCopied && <p>Link copied!</p>}
          <button
            data-testid="share-btn"
            type="button"
            onClick={ handleShare }
          >
            <FontAwesomeIcon icon={ faShare } />
          </button>
          <button
            data-testid="favorite-btn"
            type="button"
            onClick={ handleFavorite }
            src={ isFavorite ? 'blackHeartIcon' : 'whiteHeartIcon' }
          >
            {isFavorite
              ? (
                <FontAwesomeIcon
                  icon={ faHeart }
                  color="red"
                />
              ) : (
                <FontAwesomeIcon
                  icon={ faHeart }
                  color="gray"
                />)}
          </button>
        </div>
        <p data-testid="recipe-category">{recipe.category}</p>
        <div>
          Ingredients:
          <div />
          {recipe.ingredients.map((ingredient, index) => (
            <div key={ index } className="ingredients_checkbox_container">
              <label
                className="label"
                htmlFor={ ingredient }
                data-testid={ `${index}-ingredient-step` }
                style={ {
                  textDecoration: completedIngredients.includes(ingredient)
                    ? 'line-through'
                    : 'none',
                  color: completedIngredients.includes(ingredient)
                    ? 'rgb(0, 0, 0)'
                    : 'inherit',
                } }
              >
                {ingredient}
              </label>
              <input
                className="input"
                type="checkbox"
                name={ ingredient }
                id={ ingredient }
                checked={ completedIngredients.includes(ingredient) }
                onChange={ () => handleIngredientChange(ingredient) }
              />
            </div>
          ))}
        </div>
        <p className="detail-instruction" data-testid="instructions">
          {recipe.instructions}
        </p>
        <button
          className="btnStartRecipe"
          data-testid="finish-recipe-btn"
          type="button"
          disabled={ !areAllIngredientsChecked }
          onClick={ redirectToDoneRecipes }
        >
          Done Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeInProgress;

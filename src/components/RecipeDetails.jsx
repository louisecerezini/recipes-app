import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import BtnStartRecipe from './BtnStartRecipe';
import '../css/Details.css';
import { fetchMealsDetails, fetchDrinksDetails,
  fetchDrinks, fetchMeals } from '../services/fetchApi';
import FavoriteRecipeBtn from './FavoriteRecipeBtn';

function RecipeDetails() {
  const [responseMealApi, setResponseMealApi] = useState([]); // Estado que salva a resposta da API
  const [responseDrinksApi, setResponseDrinksApi] = useState(''); // Estado que salva a resposta da API
  const [recomendedDrinks, setRecomendedDrinks] = useState(''); // Estado que salva a resposta da API
  const [recomendedMeals, setRecomendedMeals] = useState(''); // Estado que salva a resposta da API
  const [inProgressRecipe, setInProgressRecipe] = useState(''); // Estado que salva as informações do LocalStorage
  const [shareBtn, setShareBtn] = useState(''); // Estado que trabalha com a mensagem do clipBoard
  const [isRecipeDone, setIsRecipeDone] = useState(false);
  const history = useHistory();

  const getDetailsData = async () => { // Função que chama a Api de acordo com qual path ela se encontra e depois salva no estado local
    const pathUrl = history.location.pathname;
    const [, prefix, id] = pathUrl.split('/');

    if (prefix === 'meals') { // Caso seja o prefixo meals faz as seguintes chamadas pra API
      const mealData = await fetchMealsDetails(id);
      const recomendedDrinksApi = await fetchDrinks('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      setResponseMealApi(mealData);
      setRecomendedDrinks(recomendedDrinksApi);
      return;
    }
    if (prefix === 'drinks') {
      // Caso seja o prefixo Drinks faz as seguintes chamadas pra API
      const drinkData = await fetchDrinksDetails(id);
      const recomendedMealsApi = await fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      setResponseDrinksApi(drinkData);
      setRecomendedMeals(recomendedMealsApi);
    }
  };

  const getLocalStorage = () => {
    const dataInProgressRecipeLS = JSON.parse(localStorage.getItem('inProgressRecipes'));
    setInProgressRecipe(dataInProgressRecipeLS || {});
  };

  const verifyRecipeDone = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const pathUrl = history.location.pathname;
    const [,, id] = pathUrl.split('/');
    const verifyIds = Array.isArray(dataLocalStorage)
    && dataLocalStorage.some((recipe) => recipe.id === id);
    setIsRecipeDone(verifyIds);
  };

  useEffect(() => { // Inicia o componente chamando a função q dispara a chamada da API
    getDetailsData();
    getLocalStorage();
    verifyRecipeDone();
  }, []);

  const renderIngredients = (ingredientList) => { // Função que faz uma contagem ate 20 para renderizar todos os ingredientes
    const ingredients = [];
    const limitIngred = 20;
    for (let i = 0; i <= limitIngred; i += 1) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;
      if (ingredientList[0][ingredientKey]) {
        ingredients.push(
          <p key={ i } data-testid={ `${i - 1}-ingredient-name-and-measure` }>
            {`${ingredientList[0][ingredientKey]} ${ingredientList[0][measureKey]}`}
          </p>,
        );
      }
    }
    return ingredients;
  };

  const embedVideo = (linkToEmbed) => { // Função que substitui o trecho, 'watch?v=' por 'embed/' no link do youtube que retorna da API
    const videoUrl = linkToEmbed.replace('watch?v=', 'embed/');
    return videoUrl;
  };

  const filterRecomendedCard = (element, index) => { // Filtro usado no map das recomendações, limita a renderização ate 6 itens;
    const maxCard = 6;
    return index < maxCard && element;
  };

  const handleShare = () => {
    const timeOut = 2000;
    const pathUrl = window.location.href;
    // clipboardCopy(pathUrl); // Ultiliza o clipBoard pra salvar o pathUrl no Ctrol + c
    navigator.clipboard.writeText(pathUrl);
    setShareBtn(true); // Seta o estado shareBtn para true assim a renderização condicional do span
    setTimeout(() => { // passa a ser executada, depois de 2 segundos é setado pra false novamente para o Span sumir
      setShareBtn(false);
    }, timeOut);
  };

  const handleClickCard = (type, id) => {
    if (type === 'drink') {
      history.push(`/drinks/${id}`);
    } else {
      history.push(`/meals/${id}`);
    }
  };

  let recipeContent = null;
  let recomendedCards = null;
  // Renderização condicional, se possuir alguma coisa no estado responseMealApi rendeiza o map dos Meals
  if (responseMealApi?.length > 0) {
    recipeContent = responseMealApi.map((meal) => (
      <div key={ meal.idMeal } className="details-content">
        <img
          className="imgRecipeDetail"
          data-testid="recipe-photo"
          src={ meal.strMealThumb }
          alt={ meal.strMeal }
        />
        <div>
          <h4 className="recipe_title" data-testid="recipe-title">{meal.strMeal}</h4>
          <div className="share-and-favorite">
            { shareBtn && <span>Link copied!</span> }
            <button
              type="button"
              data-testid="share-btn"
              onClick={ handleShare }
            >
              <FontAwesomeIcon icon={ faShare } />
            </button>
            <FavoriteRecipeBtn
              responseDrinksApi={ responseDrinksApi }
              responseMealApi={ responseMealApi }
            />
          </div>
        </div>
        <p data-testid="recipe-category">{meal.strCategory}</p>
        <h4>Ingredient</h4>
        <div className="detail-ingredient">
          {renderIngredients(responseMealApi)}
        </div>
        <h4>Intructions</h4>
        <div className="detail-instruction">
          <p data-testid="instructions">{meal.strInstructions}</p>
        </div>
        <iframe
          width="350"
          height="315"
          src={ embedVideo(meal.strYoutube) }
          title="YouTube video player"
          allow="accelerometer; clipboard-write;
           encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          data-testid="video"
        />
      </div>
    ));
    recomendedCards = recomendedDrinks
      .filter(filterRecomendedCard)
      .map((recipe, index) => (
        <button
          type="button"
          key={ recipe.idDrink }
          data-testid={ `${index}-recommendation-card` }
          onClick={ () => handleClickCard('drink', recipe.idDrink) }
        >
          <img
            className="imgRecomendCard"
            src={ recipe.strDrinkThumb }
            alt={ recipe.strDrink }
          />
          <h4 data-testid={ `${index}-recommendation-title` }>
            {recipe.strDrink}
          </h4>
        </button>
      ));
  } else if (responseDrinksApi?.length > 0) {
    recipeContent = responseDrinksApi.map((drink) => (
      <div key={ drink.idDrink } className="details-content">
        <img
          className="imgRecipeDetail"
          data-testid="recipe-photo"
          src={ drink.strDrinkThumb }
          alt={ drink.strDrink }
        />
        <div>
          <h4 className="recipe_title" data-testid="recipe-title">{drink.strDrink}</h4>
          <div className="share-and-favorite">
            { shareBtn && <span>Link copied!</span> }
            <button
              type="button"
              data-testid="share-btn"
              onClick={ handleShare }
            >
              <FontAwesomeIcon icon={ faShare } />
            </button>
            <FavoriteRecipeBtn
              responseDrinksApi={ responseDrinksApi }
              responseMealApi={ responseMealApi }
            />
          </div>
        </div>
        <p data-testid="recipe-category">{drink.strAlcoholic}</p>
        <h4>Ingredient</h4>
        <div className="detail-ingredient">
          {renderIngredients(responseDrinksApi)}
        </div>
        <div className="detail-instruction">
          <p data-testid="instructions">{drink.strInstructions}</p>
        </div>
      </div>
    ));
    recomendedCards = recomendedMeals
      .filter(filterRecomendedCard)
      .map((recipe, index) => (
        <button
          type="button"
          key={ recipe.idMeal }
          data-testid={ `${index}-recommendation-card` }
          onClick={ () => handleClickCard('meal', recipe.idMeal) }
        >
          <img
            className="imgRecomendCard"
            src={ recipe.strMealThumb }
            alt={ recipe.strMeal }
          />
          <h4 data-testid={ `${index}-recommendation-title` }>
            {recipe.strMeal}
          </h4>
        </button>
      ));
  }
  return (
    <section className="recipe-datail-container">

      {recipeContent}
      <div className="carousel-container">
        <div className="carousel-card">{recomendedCards}</div>
      </div>
      {!isRecipeDone && <BtnStartRecipe inProgressRecipe={ inProgressRecipe } />}
    </section>
  );
}

export default RecipeDetails;

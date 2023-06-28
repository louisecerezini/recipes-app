import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function FavoriteRecipeBtn({ responseMealApi, responseDrinksApi }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const history = useHistory();

  const handleFavorite = () => { // Executada ao clicar no botão favorito
    const dataLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const pathUrl = history.location.pathname;
    const [, prefix, id] = pathUrl.split('/'); // Pega o pathName e desestrutura para usar suas consts

    const favorite = { // Objeto com ternario dependendo do prefixo o qual vem a pagina
      id: prefix === 'meals' ? responseMealApi[0].idMeal : responseDrinksApi[0].idDrink,
      type: prefix === 'meals' ? 'meal' : 'drink',
      nationality: prefix === 'meals' ? responseMealApi[0].strArea : '',
      category: prefix === 'meals' ? responseMealApi[0].strCategory
        : responseDrinksApi[0].strCategory,
      alcoholicOrNot: prefix === 'drinks' ? responseDrinksApi[0].strAlcoholic : '',
      name: prefix === 'drinks' ? responseDrinksApi[0].strDrink
        : responseMealApi[0].strMeal,
      image: prefix === 'drinks' ? responseDrinksApi[0].strDrinkThumb
        : responseMealApi[0].strMealThumb,
    };

    const verifyIds = dataLocalStorage.some((recipe) => recipe.id === id); // Verifica se o Id ja existe no local storage
    if (verifyIds) {
      const removeFavorite = dataLocalStorage.filter((recipe) => recipe.id !== id); // Se existir remove o mesmo
      localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));
      setIsFavorite(false); // seta o estado que controla o coração do favorito pra falso
    } else {
      const addFavorite = [...dataLocalStorage, favorite];
      localStorage.setItem('favoriteRecipes', JSON.stringify(addFavorite)); // Se não existir adiciona um novo
      setIsFavorite(true); // seta o estado que controla o coração do favorito pra true
    }
  };

  const verifyIsfavorite = () => { // Verifica se no LocalStorage a Receita se encontra como favorita
    const dataLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const pathUrl = history.location.pathname;
    const [,, id] = pathUrl.split('/');

    const verifyIds = dataLocalStorage.some((recipe) => recipe.id === id);
    setIsFavorite(verifyIds);
  };

  useEffect(() => { // Inicia o componente chamando a função q dispara a chamada da API
    verifyIsfavorite();
  }, []);

  return (
    <button
      type="button"
      data-testid="favorite-btn"
      onClick={ handleFavorite }
      src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
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
  );
}

FavoriteRecipeBtn.propTypes = {
  responseMealApi: PropTypes.arrayOf(PropTypes.shape({
    idMeal: PropTypes.string.isRequired,
    strMeal: PropTypes.string.isRequired,
    strArea: PropTypes.string,
    strCategory: PropTypes.string.isRequired,
    strMealThumb: PropTypes.string.isRequired,
  })).isRequired,
  responseDrinksApi: PropTypes.arrayOf(PropTypes.shape({
    idDrink: PropTypes.string.isRequired,
    strDrink: PropTypes.string.isRequired,
    strCategory: PropTypes.string.isRequired,
    strAlcoholic: PropTypes.string,
    strDrinkThumb: PropTypes.string.isRequired,
  })).isRequired,
}.isRequired;

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import '../css/DoneRecipes.css';
import Logo from '../images/logowhite.png';

export default function DoneRecipes() {
  const [responseLS, setResponseLS] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [shareBtn, setShareBtn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const recive = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    if (!recive) localStorage.setItem('doneRecipes', JSON.stringify(objeto));
    setResponseLS(recive);
    setFilteredRecipes(recive);
  }, []);

  const filterRecipes = (type) => {
    if (type === 'Meals') {
      const filtered = responseLS.filter((recipe) => recipe.type === 'meal');
      setFilteredRecipes(filtered);
    } else if (type === 'Drinks') {
      const filtered = responseLS.filter((recipe) => recipe.type === 'drink');
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(responseLS);
    }
  };

  const handleShare = (type, id) => {
    const timeOut = 2000;
    if (type === 'meal') {
      const pathUrl = `${window.location.origin}/meals/${id}`;
      navigator.clipboard.writeText(pathUrl);
      setShareBtn(true);
      setTimeout(() => {
        setShareBtn(false);
      }, timeOut);
    } if (type === 'drink') {
      const pathUrl = `${window.location.origin}/drinks/${id}`;
      navigator.clipboard.writeText(pathUrl);
      setShareBtn(true);
      setTimeout(() => {
        setShareBtn(false);
      }, timeOut);
    }
  };

  const recipeDetails = (type, id) => {
    if (type === 'drink') {
      history.push(`/drinks/${id}`);
    } else {
      history.push(`/meals/${id}`);
    }
  };

  const goToRecipes = () => {
    history.push('/meals');
  };

  return (
    <>
      <Header pageTitle="Done Recipes" showSearch={ false } showIcon />
      <div className="category-conteiner-dr">
        <button className="logo-btn" onClick={ goToRecipes }>
          <img
            src={ Logo }
            alt="Logo-My-Chef"
            className="logo-image"
          />
        </button>
        <button
          className="category-btn-dr"
          data-testid="filter-by-all-btn"
          onClick={ () => filterRecipes('All') }
        >
          All
        </button>
        <button
          className="category-btn-dr"
          data-testid="filter-by-meal-btn"
          onClick={ () => filterRecipes('Meals') }
        >
          Meals
        </button>
        <button
          className="category-btn-dr"
          data-testid="filter-by-drink-btn"
          onClick={ () => filterRecipes('Drinks') }
        >
          Drinks
        </button>
      </div>
      <div className="recipe-list-dr">
        {filteredRecipes.map((recipe, index) => (
          <div className="recipeCard-dr" key={ recipe.id }>
            <button
              className="img-to-details"
              type="button"
              onClick={ () => recipeDetails(recipe.type, recipe.id) }
            >
              <img
                className="favorite-img-dr"
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                width={ 250 }
                height={ 200 }
                alt="Recipe"
              />
            </button>
            <div className="recipe-tags">
              <p
                className="recipe-title-dr"
                data-testid={ `${index}-horizontal-name` }
              >
                {recipe.name}
              </p>

              <p data-testid={ `${index}-horizontal-top-text` }>
                {recipe.type === 'meal'
                  ? `${recipe.nationality} - ${recipe.category}`
                  : recipe.alcoholicOrNot}
              </p>
              {recipe.tags
                .map((tag) => (
                  <p data-testid={ `${index}-${tag}-horizontal-tag` } key={ tag }>
                    {tag}
                  </p>
                ))
                .slice(0, 2)}
              <button
                type="button"
                className="favorite-item-remove"
                onClick={ () => handleShare(recipe.type, recipe.id) }
              >
                <FontAwesomeIcon icon={ faShare } />
              </button>
              { shareBtn && <span>Link copied!</span> }
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

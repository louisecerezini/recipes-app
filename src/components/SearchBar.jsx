import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RecipesContext from '../context/recipesContext';

// compomente contendo 1 input de texto 1 radio com 3 opçoes e 1 botao
// filter text armazena o valor do inṕut de texto
// search option armazena o valor do radio selecionado
export default function SearchBar({ pageType }) {
  const [filterText, setFilterText] = useState('');
  const [searchOption, setSearchOption] = useState('ingredient');
  const {
    fetchMealRecipes,
    fetchDrinkRecipes,
  } = useContext(RecipesContext);

  // chama a funcao quando o usuario clica no botao e chama ou a funcao fetch drinks ou a funcao fecthmeals
  const handleSearch = async () => {
    if (pageType === 'drinks') {
      await fetchDrinkRecipes(searchOption, filterText);
    } else {
      await fetchMealRecipes(searchOption, filterText);
    }
  };

  return (
    <>
      <div className="radio_container">
        <input
          className="radio_input"
          type="radio"
          value={ searchOption }
          id="ingredient"
          name="search-option"
          data-testid="ingredient-search-radio"
          onChange={ () => setSearchOption('ingredient') }
          checked={ searchOption === 'ingredient' }
        />
        {' '}
        <label htmlFor="ingredient">Ingredient</label>
        {' '}
        {'  '}

        <input
          className="radio_input"
          type="radio"
          value={ searchOption }
          id="name"
          name="search-option"
          data-testid="name-search-radio"
          onChange={ () => setSearchOption('name') }
          checked={ searchOption === 'name' }
        />
        {' '}
        <label htmlFor="name">Name</label>
        {'  '}

        <input
          className="radio_input"
          type="radio"
          value={ searchOption }
          id="first-letter"
          name="search-option"
          data-testid="first-letter-search-radio"
          onChange={ () => setSearchOption('first-letter') }
          checked={ searchOption === 'first-letter' }
        />
        {' '}
        <label htmlFor="first-letter">First letter</label>
      </div>
      <div className="input_btn_container">
        <input
          type="text"
          value={ filterText }
          onChange={ ({ target }) => setFilterText(target.value) }
          placeholder="Search"
          data-testid="search-input"
        />
        {/* <br />
      <br /> */}
        <button
          type="button"
          className="btn btn-warning"
          onClick={ handleSearch }
          data-testid="exec-search-btn"
        >
          SEARCH
        </button>
      </div>
    </>
  );
}

SearchBar.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export const fetchDrinks = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks;
  } catch {
    return [];
  }
};

export const fetchMeals = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals;
  } catch {
    return [];
  }
};

const URLM = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

export const fetchMealsDetails = async (id) => {
  try {
    const response = await fetch(`${URLM}${id}`);
    const data = await response.json();
    return data.meals;
  } catch {
    return [];
  }
};

const URLD = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

export const fetchDrinksDetails = async (id) => {
  try {
    const response = await fetch(`${URLD}${id}`);
    const data = await response.json();
    return data.drinks;
  } catch {
    return [];
  }
};

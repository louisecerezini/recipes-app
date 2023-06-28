import React from 'react';
import Header from '../components/Header';
import MealIcon from '../images/mealIcon.svg';
import '../css/Recipe.css';
import Footer from '../components/Footer';
import Recipes from './Recipes';

export default function Meals() {
  return (
    <div className="recipe-container">
      <Header
        pageTitle="Meals"
        showSearch
        showIcon
        pageIcon={ MealIcon }
        pageType="meals"
      />
      <Recipes />
      <Footer />
    </div>
  );
}

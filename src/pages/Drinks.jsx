import React from 'react';
import Header from '../components/Header';
import DrinkIcon from '../images/drinkIcon.svg';
import Footer from '../components/Footer';
import '../css/Recipe.css';
import Recipes from './Recipes';

export default function Drinks() {
  return (
    <div className="recipe-container">
      <Header
        pageTitle="Drinks"
        showSearch
        showIcon
        pageIcon={ DrinkIcon }
        pageType="drinks"
      />
      <Recipes />
      <Footer />
    </div>
  );
}

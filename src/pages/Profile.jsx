import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/Profile.css';
import icone from '../images/icone.png';

export default function Profile() {
  const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(
    () => {
      const getEmail = JSON.parse(localStorage.getItem('user')) || [];

      setEmail(getEmail.email);
    },
    [],
  );

  const doneRecipes = () => {
    history.push('/done-recipes');
  };

  const favoritesRecipes = () => {
    history.push('/favorite-recipes');
  };

  const loginPage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('doneRecipes');
    localStorage.removeItem('inProgressRecipes');
    localStorage.removeItem('favoriteRecipes');
    history.push('/');
  };

  return (
    <div>
      <Header pageTitle="Profile" showSearch={ false } showIcon />
      <div className="height_profile">
        <div className="btn_container">
          <img className="perfilimg_container" src={ icone } alt="" />
          <p
            className="email_profile"
            type="email"
            data-testid="profile-email"
          >
            {email}

          </p>
          <button
            className="profile_btn"
            data-testid="profile-done-btn"
            onClick={ doneRecipes }
          >
            Done Recipes

          </button>
          <button
            className="profile_btn"
            data-testid="profile-favorite-btn"
            onClick={ favoritesRecipes }
          >
            Favorite Recipes

          </button>
          <button
            className="profile_btn"
            data-testid="profile-logout-btn"
            onClick={ loginPage }
          >
            Logout

          </button>
        </div>
      </div>
      <Footer />
    </div>

  );
}

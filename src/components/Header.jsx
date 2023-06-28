import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { Button } from 'react-bootstrap';
import SearchIcon from '../images/searchIcon.svg';
import ProfileIcon from '../images/profileIcon.svg';
import SearchBar from './SearchBar';
import '../css/Header.css';

export default function Header({ showSearch, showIcon, pageIcon, pageType }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="header_background">
      <div className="icons_container">
        {showSearch ? (
          <button
            className="search-btn"
            onClick={ () => setIsSearchOpen(!isSearchOpen) }
          >
            <img data-testid="search-top-btn" alt="search icon" src={ SearchIcon } />
          </button>
        ) : null}
        {pageIcon ? (
          <img data-testid="page-icon-header" alt="page icon" src={ pageIcon } />
        ) : null}
        {showIcon ? (
          <Link to="/profile">
            <img
              data-testid="profile-top-btn"
              alt="profile icon"
              src={ ProfileIcon }
            />
          </Link>
        ) : null}

      </div>
      <div>
        {isSearchOpen ? (
          <SearchBar pageType={ pageType } />
        ) : null}
      </div>
    </div>
  );
}

Header.propTypes = {
  pageTitle: PropTypes.string,
  showSearch: PropTypes.bool,
  showIcon: PropTypes.bool,
  pageIcon: PropTypes.string,
  pageType: PropTypes.string,
};

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Logo from '../images/logoWhite.jpeg';
import '../css/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const testEmail = regex.test(email);
  const SIX = 6;
  const history = useHistory();

  const handleEmail = ({ target: { value } }) => {
    setEmail(value);
  };

  const handlePassword = ({ target: { value } }) => {
    setPassword(value);
  };

  const saveUser = (event) => {
    event.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  };

  return (
    <div className="page">
      <div className="godfather_div">
        <img src={ Logo } alt="Logo-My-Chef" />
        <form>
          <label htmlFor="email">
            <input
              type="text"
              name="email"
              data-testid="email-input"
              placeholder="Email"
              onChange={ handleEmail }
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              name="password"
              data-testid="password-input"
              placeholder="Password"
              onChange={ handlePassword }
            />
          </label>
          <button
            className="login-btn"
            type="button"
            data-testid="login-submit-btn"
            disabled={ !(password.length > SIX && testEmail) }
            onClick={ saveUser }
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

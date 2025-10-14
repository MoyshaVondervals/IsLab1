import React, { useState } from 'react';
import '../../../styles/login-page.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../../redux/authSlice';

import { AuthenticationApi } from '../../../api';
import { apiConfig } from '../../../apiConfig';

const authApi = new AuthenticationApi(apiConfig);
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage('Заполните оба поля');
        return;
      }

      const body = { username: username, password: password };

      const { data } = await authApi.authSignIn(body);

      localStorage.setItem('auth_token', data.token);

      dispatch(setAuthData({
        token: data.token,
        username: data.username,
        role: data.role
      }));

      navigate('/dragons');
    } catch (err) {
      console.error('Login failed:', err);
      setMessage('Неправильный логин или пароль.');
    }
  };

  return (
      <div>
        <div className="login-page-wrapper">
          <div className="authority-page-container1">
            <div className="authority-page-container2">
              <h1 className="authority-page-header">Вход в аккаунт</h1>

              <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Имя пользователя"
                  autoComplete="on"
                  className="authority-page-input input"
                  onChange={(e) => setUsername(e.target.value)}
              />
              <input
                  type="password"
                  required
                  placeholder="Пароль"
                  className="authority-page-input input"
                  onChange={(e) => setPassword(e.target.value)}
              />

              <button
                  type="submit"
                  className="authority-page-submit-button button"
                  onClick={handleSubmit}
              >
                Вход
              </button>

              <button
                  type="button"
                  className="dont-have-account button"
                  onClick={() => navigate('/auth/sign-up')}
              >
                Нет аккаунта :(
              </button>

              <div className="message">{message}</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;

import React, { useState} from 'react'
import '../../../styles/login-page.css'
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setAuthData} from "../../../redux/authSlice";
import axios from 'axios';
import useApiClient from "../../../utils/requestController";



const LoginPage = () => {
  const api = useApiClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage("Заполните оба поля");
        return; // важно
      }

      const response = await api.post('/auth/sign-in', {
        username,
        password
      });
      dispatch(setAuthData({
        token: response.data.token,
        username: response.data.username,
        role: response.data.role,
      }));
      navigate("/dragons")
    }catch (error) {
      console.error('Login failed:', error);
      setMessage('Неправильный логин или пароль.');
    }
  };
  return (
      <div>

        <div className="login-page-wrapper">
          <div className={`authority-page-container1`}>
            <div className="authority-page-container2">
              <h1 className="authority-page-header">
                Вход в аккаунт
              </h1>
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

              <button type="submit" className="authority-page-submit-button button"
              onClick={handleSubmit}>
                Вход
              </button>
              <button type="button" className="dont-have-account button"
              onClick={() => navigate('/auth/sign-up')}>
                Нет аккаунта :(
              </button>
              <div className="message">{message}</div>
            </div>
          </div>
        </div>
      </div>
)
}
export default LoginPage
import React, {useState} from 'react'

import PropTypes from 'prop-types'

import '../../../styles/login-page.css'
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {setAuthData} from "../../../redux/authSlice";
import useApiClient from "../../../utils/requestController";

const RegisterPage = () => {
  const api = useApiClient();
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleSubmit = async () => {
    try{
      if (!username || !password){
        setMessage("Заполните все поля")
      }

      const response = await api.post('/auth/sign-up', {
        username,
        password
      });
      dispatch(setAuthData({
        token: response.data.token,
        username: response.data.username,
      }));


      navigate("/dragons")

    }catch (error) {
      console.error('Register failed:', error);
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data)
            .filter(Boolean)
            .join('\n\n');

        setMessage(errorMessages);
      } else {
        setMessage("Сервер не отвечает");
      }
    }

  }
  return (
      <div>

        <div className="login-page-wrapper">
          <div className="authority-page-container1">
            <div className="authority-page-container2">
              <h1 className="authority-page-header">
                Регистрация
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
                Регистрация

              </button>
              <div className="message">{message}</div>
            </div>
          </div>
        </div>
      </div>
  )
}

RegisterPage.defaultProps = {
  button: undefined,
  heading: undefined,
}

RegisterPage.propTypes = {
  button: PropTypes.element,
  heading: PropTypes.element,
}

export default RegisterPage

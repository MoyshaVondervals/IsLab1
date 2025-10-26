import React, { useState } from 'react';
import '../../styles/header.css';

import {clearAuthData} from "../../redux/authSlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(clearAuthData());
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const mobileNavigate = (route) =>{
    navigate(route)
    toggleMobileMenu()
  }

  return (
      <div className="header-container">
        <header className="navbar">


          {/* Десктопное меню */}
          <div className="desktop-menu">
            <nav className="nav-links">
              <span className="nav-link" onClick={()=>navigate("/dragons")}>Драконы</span>
              <span className="nav-link" onClick={()=>navigate("/refs")}>Вспомогательные объекты</span>
              <span className="nav-link" onClick={()=>navigate("/operations")}>Операции</span>


              {role === "ROLE_ADMIN" && (
                  <span className="nav-link" onClick={() => navigate("/adminDashboard")}>
      Управление
    </span>
              )}
            </nav>
            <div className="nav-buttons">
              <button className="logout-btn button"
                      onClick={handleLogout}>
                <span>Выход</span>
              </button>
              <img alt="user" src="https://img.icons8.com/?size=100&id=7820&format=png&color=000000" className="user-icon" onClick={() => navigate("/myProfile")}/>
            </div>
          </div>

          {/* Бургер-меню */}
          <div className="burger-menu" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 1024 1024" className="burger-icon">
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
            </svg>
          </div>

          {/* Мобильное меню */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
            <div className="mobile-nav">
              <div className="mobile-top">

                <div className="close-menu" onClick={toggleMobileMenu}>
                  <svg viewBox="0 0 1024 1024" className="close-icon">
                    <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                  </svg>
                </div>
              </div>
              <nav className="mobile-links">
                <span className="mobile-link">Главная</span>
                <span className="mobile-link" onClick={() => mobileNavigate("/market")}>Рынок</span>


                {role === "ROLE_ADMIN" && (
                    <span className="mobile-link" onClick={() => mobileNavigate("/adminDashboard")} >
      Управление
    </span>
                )}
                <div className="mobile-user-center">
                  <img
                      alt="user"
                      src="https://img.icons8.com/?size=100&id=7820&format=png&color=000000"
                      className="user-icon"
                      onClick={() => mobileNavigate("/myProfile")}
                  />
                </div>

              </nav>

              <div className="mobile-buttons">

                <button className="mobile-logout button"
                        onClick={handleLogout}>
                  <span>Выход</span>
                </button>

              </div>

            </div>
          </div>
        </header>
      </div>
  );
};

export default Header;
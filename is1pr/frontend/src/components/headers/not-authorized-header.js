import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/header.css';
import { useNavigate } from "react-router-dom";

const NotAuthorizedHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const mobileNavigate = useCallback((route) => {
    navigate(route);
    setMobileMenuOpen(false);
  }, [navigate]);

  return (
      <header className="header">
        <div className="navbar">


          {/* Десктопное меню */}
          <div className="desktop-menu">
            <nav className="nav-links">

            </nav>
            <div className="auth-buttons">
              <button className="login-btn button" onClick={() => navigate('/')}>
                <span>Вход</span>
              </button>
              <button className="register-btn button" onClick={() => navigate('/auth/sign-up')}>
                <span>Регистрация</span>
              </button>
            </div>
          </div>

          <div className="burger-menu" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 1024 1024" className="burger-icon" aria-hidden="true">
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s-19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s-19.115 42.667 42.667 42.667z"></path>
            </svg>
          </div>

          <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
            <div className="mobile-nav">
              <div className="mobile-top">

                <div className="close-menu" onClick={toggleMobileMenu} aria-label="Закрыть меню">
                  <svg viewBox="0 0 1024 1024" className="close-icon" aria-hidden="true">
                    <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                  </svg>
                </div>
              </div>

              <nav className="mobile-links">
              </nav>

              <div className="mobile-auth-buttons">
                <button className="mobile-login button" onClick={() => mobileNavigate('/')}>
                  <span>Вход</span>
                </button>
                <button className="mobile-register button" onClick={() => mobileNavigate('/auth/sign-up')}>
                  <span>Регистрация</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>
  );
};

export default NotAuthorizedHeader;

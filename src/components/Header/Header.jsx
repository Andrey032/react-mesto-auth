import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo/logo.svg';
import burger from '../../images/Burger.png';
import burgerClose from '../../images/Close_Icon.svg';

export default function Header({ onSignOut, loggedIn, userEmail }) {
  const { pathname } = useLocation();
  const [isActiveBurgerMenu, setIsActiveBurgerMenu] = useState(false);

  function toggleBurger() {
    setIsActiveBurgerMenu(!isActiveBurgerMenu)
  }

  return (
    <header className={`header ${isActiveBurgerMenu ? 'header__opened' : ''}`}>
      <img
        className="header__logo"
        src={logo}
        alt="Логотип Место России."
      />
      <div className={isActiveBurgerMenu ? ('header__nav_active') : ("header__nav")} >
        {loggedIn && <p className='header__nav-email'>{userEmail}</p>}

        {loggedIn
          ? (
            <Link to="/sign-in" className="header__link" onClick={onSignOut}>
              Выйти
            </Link>
          )
          : (
            pathname === '/sign-in'
              ?
              <Link to="/sign-up" className="header__link">
                Регистрация
              </Link>
              :
              <Link to="/sign-in" className="header__link">
                Войти
              </Link>
          )
        }
      </div>
      {!isActiveBurgerMenu ?
        (<img className="header__burger-menu" src={burger} alt='иконка меню бургер' onClick={toggleBurger} />)
        :
        (<img className="header__burger-menu" src={burgerClose} alt='иконка крестик' onClick={toggleBurger} />)
      }
    </header>
  )
}
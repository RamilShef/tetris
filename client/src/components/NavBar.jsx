import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
     
      <nav className="navbar desktop-nav">
        <div className="nav-links">
          <Link to="/leaderboard">Таблица лидеров</Link>
          <Link to="/game">Игра</Link>
          <div className="nav-right">
            {user ? (
              <>
                <Link to="/profile">Профиль</Link>
                <button onClick={logout} className="logout-btn">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">Вход</Link>
                <Link to="/auth?mode=register">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </nav>

    
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

    
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

     
      <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={closeMenu}>✕</button>
        <div className="menu-links">
          <Link to="/leaderboard" onClick={closeMenu}>Таблица лидеров</Link>
          <Link to="/game" onClick={closeMenu}>Игра</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={closeMenu}>Профиль</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="logout-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" onClick={closeMenu}>Вход</Link>
              <Link to="/auth?mode=register" onClick={closeMenu}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
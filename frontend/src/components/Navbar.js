import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className="modern-navbar" 
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-container">
        <Link 
          to="/" 
          className="navbar-brand"
          aria-label="AWS WebApp Home"
        >
          <span className="brand-icon" aria-hidden="true">☁️</span>
          <span className="brand-text">AWS WebApp</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu" role="menubar">
          <li role="none">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              role="menuitem"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">🏠</span>
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/user" 
              className={`nav-link ${isActive('/user') ? 'active' : ''}`}
              role="menuitem"
              aria-current={isActive('/user') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">➕</span>
              <span className="nav-text">Add User</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/users" 
              className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              role="menuitem"
              aria-current={isActive('/users') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">👥</span>
              <span className="nav-text">All Users</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/docs" 
              className={`nav-link ${isActive('/docs') ? 'active' : ''}`}
              role="menuitem"
              aria-current={isActive('/docs') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">📚</span>
              <span className="nav-text">Docs</span>
            </Link>
          </li>
        </ul>

        {/* Theme Toggle & Mobile Menu Toggle */}
        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <span className="theme-icon" aria-hidden="true">☀️</span>
            ) : (
              <span className="theme-icon" aria-hidden="true">🌙</span>
            )}
            <span className="theme-text">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <span className="hamburger-line" aria-hidden="true"></span>
            <span className="hamburger-line" aria-hidden="true"></span>
            <span className="hamburger-line" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <ul className="mobile-menu-list" role="menu">
          <li role="none">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              role="menuitem"
              onClick={toggleMenu}
            >
              <span className="nav-icon" aria-hidden="true">🏠</span>
              <span>Home</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/user" 
              className={`mobile-nav-link ${isActive('/user') ? 'active' : ''}`}
              role="menuitem"
              onClick={toggleMenu}
            >
              <span className="nav-icon" aria-hidden="true">➕</span>
              <span>Add User</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/users" 
              className={`mobile-nav-link ${isActive('/users') ? 'active' : ''}`}
              role="menuitem"
              onClick={toggleMenu}
            >
              <span className="nav-icon" aria-hidden="true">👥</span>
              <span>All Users</span>
            </Link>
          </li>
          <li role="none">
            <Link 
              to="/docs" 
              className={`mobile-nav-link ${isActive('/docs') ? 'active' : ''}`}
              role="menuitem"
              onClick={toggleMenu}
            >
              <span className="nav-icon" aria-hidden="true">📚</span>
              <span>Docs</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart.js';

function Header() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo and Brand */}
          <Link to="/" className="logo">
            <span className="logo-icon">🐱</span>
            <span className="logo-text">Cat E-Shop</span>
          </Link>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for cat products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/search" className="nav-link">
              All Products
            </Link>
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
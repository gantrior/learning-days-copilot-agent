import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import AuthModal from './auth/AuthModal';
import UserAvatar from './auth/UserAvatar';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to show auth modal based on location state
  React.useEffect(() => {
    if (location.state?.authRequired && !isAuthenticated) {
      setShowAuthModal(true);
      setAuthModalMode('login');
      // Clear the state to prevent showing modal again
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, isAuthenticated, navigate, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignInClick = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  const wishlistCount = getWishlistCount();

  return (
    <>
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
              
              {/* Wishlist link - only show if authenticated */}
              {isAuthenticated && (
                <Link to="/wishlist" className="nav-link wishlist-link">
                  💝 Wishlist
                  {wishlistCount > 0 && (
                    <span className="wishlist-badge">{wishlistCount}</span>
                  )}
                </Link>
              )}
              
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>

              {/* Authentication Section */}
              <div className="auth-section">
                {isAuthenticated ? (
                  <div className="user-menu-container">
                    <button 
                      className="user-menu-trigger"
                      onClick={handleUserMenuClick}
                      aria-expanded={showUserMenu}
                      aria-haspopup="true"
                    >
                      <UserAvatar user={user} size="small" />
                      <span className="user-name">{user.name}</span>
                      <span className="menu-arrow">{showUserMenu ? '▲' : '▼'}</span>
                    </button>
                    
                    {showUserMenu && (
                      <>
                        <div className="user-menu-overlay" onClick={closeUserMenu}></div>
                        <div className="user-menu">
                          <div className="user-menu-header">
                            <UserAvatar user={user} size="medium" showName={true} />
                          </div>
                          
                          <div className="user-menu-items">
                            <Link 
                              to="/profile" 
                              className="user-menu-item"
                              onClick={closeUserMenu}
                            >
                              👤 My Profile
                            </Link>
                            <Link 
                              to="/orders" 
                              className="user-menu-item"
                              onClick={closeUserMenu}
                            >
                              📦 Order History
                            </Link>
                            <Link 
                              to="/wishlist" 
                              className="user-menu-item"
                              onClick={closeUserMenu}
                            >
                              💝 My Wishlist
                              {wishlistCount > 0 && (
                                <span className="menu-badge">{wishlistCount}</span>
                              )}
                            </Link>
                            <hr className="user-menu-separator" />
                            <button 
                              className="user-menu-item sign-out-btn"
                              onClick={handleSignOut}
                            >
                              🚪 Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <button 
                      className="auth-btn sign-in-btn"
                      onClick={handleSignInClick}
                    >
                      🔑 Sign In
                    </button>
                    <button 
                      className="auth-btn sign-up-btn"
                      onClick={handleSignUpClick}
                    >
                      🎉 Sign Up
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
}

export default Header;
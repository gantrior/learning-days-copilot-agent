import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/useCart';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const { items, removeFromWishlist, moveToCart, clearWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleMoveToCart = (item) => {
    moveToCart(item.id, addToCart);
  };

  const handleClearWishlist = async () => {
    setIsClearing(true);
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    clearWishlist();
    setIsClearing(false);
  };

  const handleShareWishlist = () => {
    // Simulate sharing functionality (demo only)
    const wishlistData = {
      items: items.map(item => ({ name: item.name, price: item.price })),
      count: getWishlistCount()
    };
    
    // In a real app, this would generate a shareable link or open share dialog
    alert(`Sharing wishlist with ${wishlistData.count} items! 🎉\n\nIn a real app, this would create a shareable link or open the native share dialog.`);
  };

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="page-header">
            <h1>
              <span className="page-icon">💝</span>
              My Wishlist
            </h1>
            <p className="page-subtitle">Your favorite cat products</p>
          </div>

          <div className="empty-wishlist">
            <div className="empty-state">
              <span className="empty-icon">💔</span>
              <h2>Your wishlist is empty</h2>
              <p>
                Start browsing our amazing cat products and click the heart icon 
                to add items to your wishlist!
              </p>
              
              <div className="empty-actions">
                <Link to="/" className="browse-products-btn">
                  🏠 Browse Products
                </Link>
                <Link to="/search" className="view-all-btn">
                  🔍 View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1>
                <span className="page-icon">💝</span>
                My Wishlist
              </h1>
              <p className="page-subtitle">
                {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            <div className="header-actions">
              <button 
                className="share-wishlist-btn"
                onClick={handleShareWishlist}
                title="Share your wishlist"
              >
                📤 Share
              </button>
              
              <button 
                className="clear-wishlist-btn"
                onClick={handleClearWishlist}
                disabled={isClearing}
                title="Clear all items from wishlist"
              >
                {isClearing ? (
                  <>
                    <span className="loading-spinner"></span>
                    Clearing...
                  </>
                ) : (
                  <>
                    🗑️ Clear All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="wishlist-content">
          <div className="wishlist-grid">
            {items.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-header">
                  <button 
                    className="remove-from-wishlist-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    ❤️
                  </button>
                  {item.addedAt && (
                    <span className="added-date">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <ProductCard product={item} />
                
                <div className="wishlist-item-actions">
                  <button 
                    className="move-to-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    🛒 Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wishlist-footer">
          <div className="wishlist-stats">
            <div className="stat">
              <span className="stat-label">Total Items:</span>
              <span className="stat-value">{getWishlistCount()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Value:</span>
              <span className="stat-value">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(items.reduce((sum, item) => sum + item.price, 0))}
              </span>
            </div>
          </div>

          <div className="wishlist-actions">
            <Link to="/search" className="continue-shopping-btn">
              🛍️ Continue Shopping
            </Link>
            
            <button 
              className="add-all-to-cart-btn"
              onClick={() => {
                items.forEach(item => addToCart(item));
                clearWishlist();
              }}
              disabled={items.length === 0}
            >
              🛒 Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
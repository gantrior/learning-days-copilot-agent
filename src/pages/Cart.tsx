import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart.js';

function Cart() {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: string): void => {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleRemoveItem = (productId: number): void => {
    removeFromCart(productId);
  };

  const handleClearCart = (): void => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Your Shopping Cart</h1>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <p>Discover our amazing selection of cat products!</p>
            
            <div className="empty-cart-actions">
              <Link to="/search" className="primary-btn">
                Start Shopping
              </Link>
              <Link to="/" className="secondary-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <div className="cart-summary">
            <span className="total-items">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            <button 
              className="clear-cart-btn" 
              onClick={handleClearCart}
              title="Clear entire cart"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">
                    Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </p>
                  <p className="item-price">{formatPrice(item.price)} each</p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-control">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="quantity-input"
                    />
                  </div>
                  
                  <div className="item-total">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                  
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove from cart"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>{formatPrice(totalPrice * 0.08)}</span>
              </div>
              
              <div className="summary-row total">
                <span><strong>Total</strong></span>
                <span><strong>{formatPrice(totalPrice + totalPrice * 0.08)}</strong></span>
              </div>
              
              <div className="checkout-actions">
                <Link to="/checkout" className="primary-btn full-width">
                  Proceed to Checkout
                </Link>
                
                <Link to="/search" className="secondary-btn full-width">
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="cart-benefits">
              <h3>🎉 Why Shop with Us?</h3>
              <ul>
                <li>🚚 Free shipping on orders over $50</li>
                <li>🛡️ 30-day satisfaction guarantee</li>
                <li>⭐ Premium quality cat products</li>
                <li>💝 Perfect for your feline friends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
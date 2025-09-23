import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

function Cart() {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
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
            <div className="empty-cart-icon">�</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/search" className="continue-shopping-btn">
              Continue Shopping
            </Link>
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
          <div className="cart-summary-header">
            <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            <button 
              onClick={handleClearCart}
              className="clear-cart-btn"
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
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">
                    {item.description.length > 100 
                      ? `${item.description.substring(0, 100)}...`
                      : item.description
                    }
                  </p>
                  <p className="item-category">
                    Category: {item.category}
                  </p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-control">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <div className="quantity-input-group">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantity-input"
                      />
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= 99}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-price">
                    <span className="unit-price">{formatPrice(item.price)} each</span>
                    <span className="total-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-item-btn"
                    title="Remove item from cart"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-line">
                <span>Items ({totalItems}):</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              
              <div className="summary-line tax-line">
                <span>Estimated Tax:</span>
                <span>{formatPrice(totalPrice * 0.08)}</span>
              </div>
              
              <div className="summary-line total-line">
                <span>Total:</span>
                <span>{formatPrice(totalPrice + (totalPrice * 0.08))}</span>
              </div>
              
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
              
              <Link to="/search" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
            
            <div className="shipping-info">
              <h3>🚚 Free Shipping</h3>
              <p>Free shipping on all orders! Your cat products will be delivered with care.</p>
            </div>
            
            <div className="guarantee-info">
              <h3>�️ Our Guarantee</h3>
              <p>30-day return policy. If your cat isn't happy, we'll make it right!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
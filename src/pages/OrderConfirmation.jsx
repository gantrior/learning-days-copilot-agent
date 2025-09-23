import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const { orderNumber, orderTotal, customerName } = location.state || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Redirect if no order data
  if (!orderNumber) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="confirmation-content">
            <h1>Order Not Found</h1>
            <p>We couldn't find your order information.</p>
            <Link to="/" className="home-btn">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          <div className="success-icon">✅</div>
          
          <h1>Order Confirmed!</h1>
          
          <p className="confirmation-message">
            Thank you for your order, <strong>{customerName}</strong>! 
            Your cat products are on their way to bring joy to your feline friend.
          </p>
          
          <div className="order-details">
            <h2>Order Details</h2>
            
            <div className="detail-row">
              <span className="label">Order Number:</span>
              <span className="value order-number">{orderNumber}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Total Amount:</span>
              <span className="value total-amount">{formatPrice(orderTotal)}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Estimated Delivery:</span>
              <span className="value">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          <div className="next-steps">
            <h2>What Happens Next?</h2>
            
            <div className="step">
              <div className="step-icon">📧</div>
              <div className="step-content">
                <h3>Confirmation Email</h3>
                <p>You'll receive an order confirmation email shortly with all the details.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">📦</div>
              <div className="step-content">
                <h3>Order Processing</h3>
                <p>We'll carefully pack your cat products with love and attention.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">🚚</div>
              <div className="step-content">
                <h3>Shipping & Delivery</h3>
                <p>Free shipping! Your order will arrive within 3-5 business days.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">😸</div>
              <div className="step-content">
                <h3>Happy Cat Time!</h3>
                <p>Watch your cat enjoy their new toys, food, and accessories!</p>
              </div>
            </div>
          </div>
          
          <div className="customer-service">
            <h2>Need Help?</h2>
            <p>
              If you have any questions about your order, please contact us:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1-555-CAT-SHOP</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>meow@catshop.demo</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>Live Chat available 9 AM - 6 PM</span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link to="/" className="home-btn">
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()} 
              className="print-btn"
            >
              Print Confirmation
            </button>
          </div>
          
          <div className="social-share">
            <h3>Share the Joy! 😺</h3>
            <p>Your cat is going to love these products! Share your excitement:</p>
            <div className="social-buttons">
              <button className="social-btn facebook">
                📘 Share on Facebook
              </button>
              <button className="social-btn instagram">
                📷 Share on Instagram
              </button>
              <button className="social-btn twitter">
                🐦 Tweet About It
              </button>
            </div>
          </div>
          
          <div className="satisfaction-guarantee">
            <h3>🛡️ Our 30-Day Satisfaction Guarantee</h3>
            <p>
              If your cat isn't completely satisfied with their new products, 
              we'll make it right with a full refund or exchange. Your cat's 
              happiness is our priority!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
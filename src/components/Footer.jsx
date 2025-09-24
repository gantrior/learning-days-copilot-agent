import React from 'react';
import PropTypes from 'prop-types';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Contact Information */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>📞 +1-555-CAT-SHOP</p>
            <p>📧 meow@catshop.demo</p>
            <p>🏠 123 Cat Street, Feline City, FC 12345</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/search">All Products</a></li>
              <li><a href="/cart">Shopping Cart</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a 
                href="https://facebook.com/CatShopDemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                📘 Facebook
              </a>
              <a 
                href="https://instagram.com/CatShopDemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                📸 Instagram
              </a>
              <a 
                href="https://twitter.com/CatShopDemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                🐦 Twitter
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Get the latest cat product updates!</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="your-email@example.com"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 Cat E-Shop Demo. All rights reserved. This is a demonstration project.</p>
          <p>🐾 Made with love for our feline friends 🐾</p>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  // This component doesn't receive props directly
};

export default Footer;
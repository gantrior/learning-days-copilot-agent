import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { getFeaturedProducts, getProductsByCategory } from '../data/products';

function HomePage() {
  const featuredProducts = getFeaturedProducts(6);
  const toyProducts = getProductsByCategory('toys').slice(0, 3);
  const foodProducts = getProductsByCategory('food').slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Cat E-Shop</h1>
            <p className="hero-subtitle">
              The purr-fect place to shop for your feline friends! 🐱
            </p>
            <p className="hero-description">
              Discover our curated collection of premium cat toys, nutritious food, 
              and stylish accessories that will make your cat's life more comfortable and fun.
            </p>
            <a href="/search" className="hero-cta">
              Shop All Products �
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductGrid 
        products={featuredProducts}
        title="⭐ Featured Products"
      />

      {/* Category Highlights */}
      <section className="category-highlights">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          
          <div className="category-grid">
            <div className="category-card">
              <span className="category-icon">🧸</span>
              <h3>Toys & Entertainment</h3>
              <p>Keep your cat active and engaged</p>
              <a href="/search?category=toys" className="category-link">
                Shop Toys →
              </a>
            </div>
            
            <div className="category-card">
              <span className="category-icon">🥫</span>
              <h3>Food & Treats</h3>
              <p>Premium nutrition for healthy cats</p>
              <a href="/search?category=food" className="category-link">
                Shop Food →
              </a>
            </div>
            
            <div className="category-card">
              <span className="category-icon">🎀</span>
              <h3>Accessories</h3>
              <p>Beds, collars, and comfort items</p>
              <a href="/search?category=accessories" className="category-link">
                Shop Accessories →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Toys Preview */}
      <ProductGrid 
        products={toyProducts}
        title="🧸 Popular Toys"
      />

      {/* Food & Treats Preview */}
      <ProductGrid 
        products={foodProducts}
        title="🥫 Premium Food & Treats"
      />

      {/* Newsletter Signup */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated with Cat Care Tips! �</h2>
            <p>Get the latest product updates, cat care advice, and special offers.</p>
            <form className="newsletter-signup">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-email"
              />
              <button type="submit" className="newsletter-submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
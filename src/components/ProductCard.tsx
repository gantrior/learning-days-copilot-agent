import React, { useState } from 'react';
import { useCart } from '../contexts/useCart.js';
import { Product } from '../types/index.js';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState<boolean>(false);

  const handleAddToCart = (): void => {
    addToCart(product);
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('✨');
    }

    return stars.join('');
  };

  // Fallback image placeholder
  const getFallbackImage = (): string => {
    const categoryEmojis: Record<string, string> = {
      toys: '🧸',
      food: '🥫',
      accessories: '🎀'
    };
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f0f0f0"/><text x="150" y="130" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="%23666">${categoryEmojis[product.category] || '🐱'}</text><text x="150" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="%23999">${product.name}</text></svg>`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageError ? (
          <img 
            src={getFallbackImage()} 
            alt={product.name}
            className="product-image product-image-fallback"
          />
        ) : (
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        {!product.inStock && (
          <div className="out-of-stock-overlay">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-value">({product.rating})</span>
        </div>
        
        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...`
            : product.description
          }
        </p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          
          <button 
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
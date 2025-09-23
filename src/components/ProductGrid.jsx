import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, title, emptyMessage = "No products found." }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <div className="container">
          {title && <h2 className="grid-title">{title}</h2>}
          <div className="empty-state">
            <span className="empty-icon">🐾</span>
            <p>{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-section">
      <div className="container">
        {title && <h2 className="grid-title">{title}</h2>}
        
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
        
        {products.length > 0 && (
          <div className="grid-summary">
            <p>Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
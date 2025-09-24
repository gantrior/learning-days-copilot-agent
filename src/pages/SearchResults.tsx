import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.js';
import Loading from '../components/Loading.js';
import { searchProducts, getProductsByCategory, categories } from '../data/products.js';
import { Product } from '../types/index.js';

type SortOption = 'name' | 'price-low' | 'price-high' | 'rating';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';

  useEffect(() => {
    // Simulate loading for demo purposes
    setIsLoading(true);
    
    const loadProducts = (): void => {
      // Apply search and category filters
      let products: Product[] = [];
      
      if (query) {
        products = searchProducts(query);
      } else {
        products = getProductsByCategory(categoryParam);
      }

      // Apply additional category filter if both search and category are present
      if (query && selectedCategory !== 'all') {
        products = products.filter(product => product.category === selectedCategory);
      }

      // Apply sorting
      products = [...products].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });

      setFilteredProducts(products);
      setIsLoading(false);
    };

    // Simulate loading delay for demo
    setTimeout(loadProducts, 500);
  }, [query, categoryParam, selectedCategory, sortBy]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category);
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value as SortOption);
  };

  const getPageTitle = (): string => {
    if (query) {
      return `Search Results for "${query}"`;
    } else if (categoryParam !== 'all') {
      const category = categories.find(cat => cat.id === categoryParam);
      return category ? `${category.name}` : 'All Products';
    }
    return 'All Products';
  };

  return (
    <div className="search-results">
      <div className="container">
        <div className="search-header">
          <h1>{getPageTitle()}</h1>
          {query && (
            <p className="search-info">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
              {' '}matching your search
            </p>
          )}
        </div>

        <div className="search-controls">
          {/* Category Filter */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="sort-section">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Rating (Highest First)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loading message="Finding the perfect products for your cat..." />
        ) : (
          <ProductGrid 
            products={filteredProducts}
            emptyMessage={
              query 
                ? `No products found for "${query}". Try different keywords or browse our categories.`
                : "No products found in this category."
            }
          />
        )}
      </div>
    </div>
  );
}

export default SearchResults;
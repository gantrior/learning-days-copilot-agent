import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../components/ProductCard';
import { CartProvider } from '../contexts/CartContext';
import { useCart } from '../contexts/useCart';

// Mock product data for testing
const mockProduct = {
  id: 1,
  name: 'Test Cat Toy',
  price: 15.99,
  category: 'toys',
  image: 'https://example.com/test-image.jpg',
  description: 'A wonderful cat toy that will keep your feline friend entertained for hours and hours.',
  inStock: true,
  rating: 4.5
};

const mockOutOfStockProduct = {
  ...mockProduct,
  id: 2,
  name: 'Out of Stock Toy',
  inStock: false
};

// Test component to track cart state
const CartTracker = ({ onCartUpdate }) => {
  const cart = useCart();
  
  React.useEffect(() => {
    onCartUpdate(cart);
  }, [cart, onCartUpdate]);
  
  return null;
};

const renderProductCard = (product, onCartUpdate = jest.fn()) => {
  return render(
    <CartProvider>
      <ProductCard product={product} />
      <CartTracker onCartUpdate={onCartUpdate} />
    </CartProvider>
  );
};

describe('ProductCard Component', () => {
  test('should render product information correctly', () => {
    renderProductCard(mockProduct);
    
    expect(screen.getByText('Test Cat Toy')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText(/A wonderful cat toy/)).toBeInTheDocument();
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    expect(screen.getByAltText('Test Cat Toy')).toBeInTheDocument();
  });

  test('should display rating stars correctly', () => {
    renderProductCard(mockProduct);
    
    const starsElement = screen.getByText('⭐⭐⭐⭐✨');
    expect(starsElement).toBeInTheDocument();
  });

  test('should format price with currency', () => {
    renderProductCard(mockProduct);
    
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  test('should truncate long descriptions', () => {
    const longDescProduct = {
      ...mockProduct,
      description: 'This is a very long description that should be truncated because it exceeds the 100 character limit set in the component and should show ellipsis at the end.'
    };
    
    renderProductCard(longDescProduct);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description.textContent).toMatch(/\.\.\.$/);
    expect(description.textContent.length).toBeLessThan(longDescProduct.description.length);
  });

  test('should add product to cart when Add to Cart button is clicked', async () => {
    const user = userEvent.setup();
    let cartData;
    const onCartUpdate = jest.fn((data) => { cartData = data; });
    
    renderProductCard(mockProduct, onCartUpdate);
    
    const addButton = screen.getByText('🛒 Add to Cart');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();
    
    await user.click(addButton);
    
    expect(cartData.cartItems).toHaveLength(1);
    expect(cartData.cartItems[0]).toEqual({
      ...mockProduct,
      quantity: 1
    });
    expect(cartData.totalItems).toBe(1);
  });

  test('should display out of stock state correctly', () => {
    renderProductCard(mockOutOfStockProduct);
    
    const addButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveClass('disabled');
    
    const overlay = document.querySelector('.out-of-stock-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveTextContent('Out of Stock');
  });

  test('should not add out of stock product to cart', async () => {
    const user = userEvent.setup();
    let cartData;
    const onCartUpdate = jest.fn((data) => { cartData = data; });
    
    renderProductCard(mockOutOfStockProduct, onCartUpdate);
    
    const addButton = screen.getByRole('button', { name: /out of stock/i });
    
    // Try to click disabled button
    await user.click(addButton);
    
    // Cart should remain empty
    expect(cartData.cartItems).toHaveLength(0);
  });

  test('should handle image loading error with fallback', async () => {
    renderProductCard(mockProduct);
    
    const image = screen.getByAltText('Test Cat Toy');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Wait for fallback image to load
    await waitFor(() => {
      const fallbackImage = screen.getByAltText('Test Cat Toy');
      expect(fallbackImage.src).toMatch(/data:image\/svg\+xml/);
    });
  });

  test('should display category emoji in fallback image', async () => {
    const toyProduct = { ...mockProduct, category: 'toys' };
    renderProductCard(toyProduct);
    
    const image = screen.getByAltText('Test Cat Toy');
    fireEvent.error(image);
    
    await waitFor(() => {
      const fallbackImage = screen.getByAltText('Test Cat Toy');
      expect(fallbackImage.src).toContain('%F0%9F%A7%B8'); // URL encoded 🧸
    });
  });

  test('should display default cat emoji for unknown category', async () => {
    const unknownCategoryProduct = { ...mockProduct, category: 'unknown' };
    renderProductCard(unknownCategoryProduct);
    
    const image = screen.getByAltText('Test Cat Toy');
    fireEvent.error(image);
    
    await waitFor(() => {
      const fallbackImage = screen.getByAltText('Test Cat Toy');
      expect(fallbackImage.src).toContain('%F0%9F%90%B1'); // URL encoded 🐱
    });
  });

  test('should handle zero rating', () => {
    const noRatingProduct = { ...mockProduct, rating: 0 };
    renderProductCard(noRatingProduct);
    
    expect(screen.getByText('(0)')).toBeInTheDocument();
    // Should not display any stars
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  test('should handle perfect rating', () => {
    const perfectRatingProduct = { ...mockProduct, rating: 5 };
    renderProductCard(perfectRatingProduct);
    
    expect(screen.getByText('⭐⭐⭐⭐⭐')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  test('should set lazy loading on images', () => {
    renderProductCard(mockProduct);
    
    const image = screen.getByAltText('Test Cat Toy');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  test('should apply correct CSS classes', () => {
    renderProductCard(mockProduct);
    
    const productCard = screen.getByText('Test Cat Toy').closest('.product-card');
    expect(productCard).toHaveClass('product-card');
    
    const addButton = screen.getByText('🛒 Add to Cart');
    expect(addButton).toHaveClass('add-to-cart-btn');
    expect(addButton).not.toHaveClass('disabled');
  });
});
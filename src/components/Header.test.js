import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { CartProvider } from '../contexts/CartContext';
import { useCart } from '../contexts/useCart';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test component to manipulate cart for testing
const CartManipulator = ({ itemCount }) => {
  const { addToCart } = useCart();
  
  React.useEffect(() => {
    if (itemCount > 0) {
      // Add mock items to cart for testing
      for (let i = 0; i < itemCount; i++) {
        addToCart({ id: i + 1, name: `Product ${i + 1}`, price: 10 });
      }
    }
  }, []); // Empty dependency array to run only once
  
  return null;
};

const renderHeader = (cartItemCount = 0) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <Header />
        {cartItemCount > 0 && <CartManipulator itemCount={cartItemCount} />}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('should render header with logo and navigation', () => {
    renderHeader();
    
    expect(screen.getByText('🐱')).toBeInTheDocument();
    expect(screen.getByText('Cat E-Shop')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('🛒 Cart')).toBeInTheDocument();
  });

  test('should render search input and button', () => {
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    const searchButton = screen.getByText('🔍');
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('type', 'submit');
  });

  test('should navigate to search page when search is submitted', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    const searchButton = screen.getByText('🔍');
    
    await user.type(searchInput, 'cat toy');
    await user.click(searchButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=cat%20toy');
  });

  test('should handle search form submission with Enter key', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    await user.type(searchInput, 'catnip');
    await user.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=catnip');
  });

  test('should clear search input after submission', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    await user.type(searchInput, 'search query');
    expect(searchInput).toHaveValue('search query');
    
    await user.keyboard('{Enter}');
    
    expect(searchInput).toHaveValue('');
  });

  test('should not navigate when search query is empty or whitespace', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    // Test empty search
    await user.click(screen.getByText('🔍'));
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Test whitespace only search
    await user.type(searchInput, '   ');
    await user.keyboard('{Enter}');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('should display cart badge when items are in cart', () => {
    renderHeader(3);
    
    const cartBadge = screen.getByText('3');
    expect(cartBadge).toBeInTheDocument();
    expect(cartBadge).toHaveClass('cart-badge');
  });

  test('should not display cart badge when cart is empty', () => {
    renderHeader(0);
    
    const cartBadge = screen.queryByText(/\d+/);
    expect(cartBadge).not.toBeInTheDocument();
  });

  test('should update cart badge count when items are added', () => {
    renderHeader(5);
    
    const cartBadge = screen.getByText('5');
    expect(cartBadge).toBeInTheDocument();
  });

  test('should have correct navigation links', () => {
    renderHeader();
    
    const homeLink = screen.getByText('Home').closest('a');
    const productsLink = screen.getByText('All Products').closest('a');
    const cartLink = screen.getByText('🛒 Cart').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/search');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  test('should apply correct CSS classes', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
    
    const searchForm = screen.getByPlaceholderText('Search for cat products...').closest('form');
    expect(searchForm).toHaveClass('search-form');
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('nav');
  });

  test('should handle logo link to home page', () => {
    renderHeader();
    
    const logoLink = screen.getByText('Cat E-Shop').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
    expect(logoLink).toHaveClass('logo');
  });

  test('should trim whitespace from search query', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    await user.type(searchInput, '  trimmed query  ');
    await user.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=trimmed%20query');
  });

  test('should handle special characters in search query', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    await user.type(searchInput, 'cat & dog toys!');
    await user.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=cat%20%26%20dog%20toys!');
  });

  test('should maintain search input focus during typing', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search for cat products...');
    
    await user.click(searchInput);
    expect(searchInput).toHaveFocus();
    
    await user.type(searchInput, 'test');
    expect(searchInput).toHaveFocus();
  });
});
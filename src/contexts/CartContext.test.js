import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider } from '../contexts/CartContext';
import { useCart } from '../contexts/useCart';

// Test helper component
const TestCartComponent = ({ onCartData }) => {
  const cart = useCart();
  
  React.useEffect(() => {
    onCartData(cart);
  }, [cart, onCartData]);

  return (
    <div>
      <div data-testid="cart-items">Items: {cart.cartItems.length}</div>
      <div data-testid="total-items">Total Items: {cart.totalItems}</div>
      <div data-testid="total-price">Total Price: ${cart.totalPrice.toFixed(2)}</div>
      <button onClick={() => cart.addToCart({ id: 1, name: 'Test Product', price: 10 })}>
        Add Product
      </button>
      <button onClick={() => cart.removeFromCart(1)}>
        Remove Product
      </button>
      <button onClick={() => cart.updateQuantity(1, 3)}>
        Update Quantity
      </button>
      <button onClick={() => cart.clearCart()}>
        Clear Cart
      </button>
    </div>
  );
};

const renderCartProvider = (onCartData = jest.fn()) => {
  return render(
    <CartProvider>
      <TestCartComponent onCartData={onCartData} />
    </CartProvider>
  );
};

describe('CartContext and useCart Hook', () => {
  let cartData;
  
  beforeEach(() => {
    cartData = null;
    // Clear localStorage mock and reset return value
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    window.localStorage.getItem.mockReturnValue(null);
  });

  test('should provide initial cart state', () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    expect(cartData.cartItems).toEqual([]);
    expect(cartData.totalItems).toBe(0);
    expect(cartData.totalPrice).toBe(0);
    expect(typeof cartData.addToCart).toBe('function');
    expect(typeof cartData.removeFromCart).toBe('function');
    expect(typeof cartData.updateQuantity).toBe('function');
    expect(typeof cartData.clearCart).toBe('function');
  });

  test('should add item to cart', async () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    
    await act(async () => {
      addButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $10.00');
  });

  test('should increase quantity when adding existing item', async () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    
    // Add same item twice
    await act(async () => {
      addButton.click();
      addButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $20.00');
  });

  test('should remove item from cart', async () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    const removeButton = screen.getByText('Remove Product');
    
    // Add then remove
    await act(async () => {
      addButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1');
    
    await act(async () => {
      removeButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $0.00');
  });

  test('should update item quantity', async () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    const updateButton = screen.getByText('Update Quantity');
    
    // Add item then update quantity
    await act(async () => {
      addButton.click();
    });
    
    await act(async () => {
      updateButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $30.00');
  });

  test('should clear entire cart', async () => {
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    const clearButton = screen.getByText('Clear Cart');
    
    // Add items then clear
    await act(async () => {
      addButton.click();
      addButton.click();
    });
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 2');
    
    await act(async () => {
      clearButton.click();
    });
    
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $0.00');
  });

  test('should handle localStorage persistence', async () => {
    // Mock localStorage data
    const savedCartData = JSON.stringify([
      { id: 1, name: 'Saved Product', price: 15, quantity: 2 }
    ]);
    
    window.localStorage.getItem.mockReturnValue(savedCartData);
    
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    // Should load from localStorage
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $30.00');
    
    // Check that localStorage.getItem was called
    expect(window.localStorage.getItem).toHaveBeenCalledWith('cat-eshop-cart');
  });

  test('should save to localStorage when cart changes', async () => {
    // Clear previous mock calls first
    window.localStorage.setItem.mockClear();
    
    const onCartData = jest.fn((data) => { cartData = data; });
    renderCartProvider(onCartData);
    
    const addButton = screen.getByText('Add Product');
    
    await act(async () => {
      addButton.click();
    });
    
    // Should save to localStorage (check last call)
    const calls = window.localStorage.setItem.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall).toEqual([
      'cat-eshop-cart',
      JSON.stringify([{ id: 1, name: 'Test Product', price: 10, quantity: 1 }])
    ]);
  });

  test('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    window.localStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const onCartData = jest.fn();
    renderCartProvider(onCartData);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading cart from localStorage:',
      expect.any(Error)
    );
    
    consoleErrorSpy.mockRestore();
  });
});
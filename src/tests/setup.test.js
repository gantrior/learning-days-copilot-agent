import React from 'react';
import { render, screen } from '@testing-library/react';
import { useCart } from '../contexts/useCart';

// Simple smoke test to verify Jest setup
describe('Jest Setup', () => {
  test('Jest and React Testing Library are working', () => {
    const TestComponent = () => <div data-testid="test">Hello Test</div>;
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  test('useCart hook throws error when used outside provider', () => {
    // Mock console.error to prevent noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const TestComponent = () => {
      try {
        useCart();
        return <div>Should not render</div>;
      } catch (error) {
        return <div data-testid="error">{error.message}</div>;
      }
    };

    render(<TestComponent />);
    expect(screen.getByTestId('error')).toHaveTextContent('useCart must be used within a CartProvider');
    
    consoleSpy.mockRestore();
  });
});
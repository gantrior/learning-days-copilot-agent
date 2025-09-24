import { useContext } from 'react';
import CartContext from './CartContext.js';
import { CartContextValue } from '../types/index.js';

// Custom hook to use cart context
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
import React, { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

// Cart reducer to manage state changes
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          cartItems: updatedItems
        };
      } else {
        // Add new item to cart
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cartItems.filter(item => item.id !== action.payload);
      return {
        ...state,
        cartItems: updatedItems
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        cartItems: updatedItems
      };
    }
    
    case 'CLEAR_CART': {
      return {
        ...state,
        cartItems: []
      };
    }
    
    case 'LOAD_CART': {
      return {
        ...state,
        cartItems: action.payload || []
      };
    }
    
    default:
      return state;
  }
};

// Calculate derived state (totals)
const calculateTotals = (cartItems) => {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return { totalItems, totalPrice };
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: []
  });

  // Calculate totals whenever cart items change
  const { totalItems, totalPrice } = calculateTotals(state.cartItems);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cat-eshop-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart items change
  useEffect(() => {
    try {
      localStorage.setItem('cat-eshop-cart', JSON.stringify(state.cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.cartItems]);

  // Cart actions
  const addToCart = (product) => {
    try {
      // Validate product before adding
      if (!product || typeof product !== 'object') {
        throw new Error('Invalid product data');
      }
      if (!product.id || !product.name || typeof product.price !== 'number') {
        throw new Error('Product missing required fields');
      }
      
      dispatch({ type: 'ADD_TO_CART', payload: product });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // In a real app, you might show a toast notification
    }
  };

  const removeFromCart = (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      if (typeof quantity !== 'number' || quantity < 0) {
        throw new Error('Quantity must be a non-negative number');
      }
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cartItems: state.cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CartContext;
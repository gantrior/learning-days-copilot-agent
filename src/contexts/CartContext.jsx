import React, { createContext, useReducer, useEffect } from 'react';

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
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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

export default CartContext;
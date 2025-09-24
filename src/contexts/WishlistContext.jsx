import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// Wishlist reducer to manage state changes
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload
      };
    
    case 'ADD_TO_WISHLIST': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Item already in wishlist, no change
        return state;
      } else {
        // Add new item to wishlist
        return {
          ...state,
          items: [...state.items, { ...action.payload, addedAt: new Date().toISOString() }]
        };
      }
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };
    
    case 'MOVE_TO_CART': {
      // Remove item from wishlist when moved to cart
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems
      };
    }
    
    default:
      return state;
  }
};

// Initial wishlist state
const initialState = {
  items: []
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from localStorage when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        const savedWishlist = localStorage.getItem(`cat-eshop-wishlist-${user.id}`);
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
        } else {
          dispatch({ type: 'LOAD_WISHLIST', payload: [] });
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        dispatch({ type: 'LOAD_WISHLIST', payload: [] });
      }
    } else {
      // Clear wishlist when user logs out
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
  }, [isAuthenticated, user]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        localStorage.setItem(`cat-eshop-wishlist-${user.id}`, JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [state.items, isAuthenticated, user]);

  // Wishlist actions
  const addToWishlist = (product) => {
    if (!isAuthenticated) {
      // Could trigger auth modal here in the future
      console.warn('User must be authenticated to add items to wishlist');
      return false;
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    return true;
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const moveToCart = (productId, addToCartFn) => {
    const item = state.items.find(item => item.id === productId);
    if (item && addToCartFn) {
      addToCartFn(item);
      dispatch({ type: 'MOVE_TO_CART', payload: productId });
      return true;
    }
    return false;
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isInWishlist,
    getWishlistCount,
    isAuthenticated // Pass through for components to check auth state
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
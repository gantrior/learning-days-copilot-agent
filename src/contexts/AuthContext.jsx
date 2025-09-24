import React, { createContext, useReducer, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Auth reducer to manage authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Initial auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Utility function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password strength
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
};

// Generate mock user data
const generateMockUser = (email, name) => {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    avatar: null,
    preferences: {
      favoriteBreeds: [],
      categories: [],
      notifications: true
    },
    createdAt: new Date().toISOString()
  };
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user session from localStorage on component mount
  useEffect(() => {
    const loadUserSession = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const savedUser = localStorage.getItem('cat-eshop-user');
        const savedToken = localStorage.getItem('cat-eshop-token');
        
        if (savedUser && savedToken) {
          const user = JSON.parse(savedUser);
          // Simulate token validation (in real app, this would be a server call)
          const tokenExpiry = localStorage.getItem('cat-eshop-token-expiry');
          
          if (tokenExpiry && new Date() < new Date(tokenExpiry)) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          } else {
            // Token expired, clear storage
            localStorage.removeItem('cat-eshop-user');
            localStorage.removeItem('cat-eshop-token');
            localStorage.removeItem('cat-eshop-token-expiry');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUserSession();
  }, []);

  // Save user session to localStorage
  const saveUserSession = (user) => {
    try {
      const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('cat-eshop-user', JSON.stringify(user));
      localStorage.setItem('cat-eshop-token', token);
      localStorage.setItem('cat-eshop-token-expiry', expiry.toISOString());
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  };

  // Clear user session from localStorage
  const clearUserSession = () => {
    try {
      localStorage.removeItem('cat-eshop-user');
      localStorage.removeItem('cat-eshop-token');
      localStorage.removeItem('cat-eshop-token-expiry');
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { email, password, name } = userData;
      
      // Validation
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors[0]); // Show first error
      }
      
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      // Check if user already exists (mock check)
      const existingUsers = JSON.parse(localStorage.getItem('cat-eshop-registered-users') || '[]');
      if (existingUsers.some(u => u.email === email)) {
        throw new Error('An account with this email already exists');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new user
      const newUser = generateMockUser(email, name.trim());
      
      // Save to registered users list
      existingUsers.push({ email: newUser.email, id: newUser.id });
      localStorage.setItem('cat-eshop-registered-users', JSON.stringify(existingUsers));
      
      // Save user session
      saveUserSession(newUser);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      
      return { success: true, user: newUser };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Sign in function
  const signIn = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { email, password } = credentials;
      
      // Validation
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!password || password.length < 1) {
        throw new Error('Please enter your password');
      }

      // Check if user exists (mock check)
      const existingUsers = JSON.parse(localStorage.getItem('cat-eshop-registered-users') || '[]');
      const userExists = existingUsers.find(u => u.email === email);
      
      if (!userExists) {
        throw new Error('No account found with this email address');
      }

      // Simulate API delay and authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication (in real app, this would validate against server)
      // For demo purposes, accept any password for existing users
      const user = generateMockUser(email, email.split('@')[0]); // Use email prefix as name
      user.id = userExists.id; // Keep consistent user ID
      
      // Save user session
      saveUserSession(user);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      return { success: true, user };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const signOut = () => {
    clearUserSession();
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile function
  const updateProfile = (updates) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      saveUserSession(updatedUser);
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
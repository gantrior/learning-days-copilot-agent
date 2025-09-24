// Core TypeScript interfaces and types for Cat E-Shop

export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'toys' | 'food' | 'accessories';
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalPrice: number;
  customerInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface CartState {
  cartItems: CartItem[];
}

export interface CartContextValue {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Search and filtering types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}
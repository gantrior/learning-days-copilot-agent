// Cat E-Shop Product Catalog
import { Product, Category } from '../types/index.js';

export const products: Product[] = [
  // Cat Toys
  {
    id: 1,
    name: "Feather Wand Toy",
    price: 12.99,
    category: "toys",
    image: "https://picsum.photos/seed/feather-wand/300/300",
    description: "Interactive feather wand that will keep your cat entertained for hours. Features colorful feathers and a sturdy handle.",
    inStock: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Catnip Mouse Set",
    price: 8.49,
    category: "toys",
    image: "https://picsum.photos/seed/catnip-mouse/300/300",
    description: "Set of 3 adorable catnip-filled mice that will drive your cat wild with excitement. Made with premium organic catnip.",
    inStock: true,
    rating: 4.6
  },
  {
    id: 3,
    name: "Laser Pointer Pro",
    price: 15.99,
    category: "toys",
    image: "https://picsum.photos/seed/laser-pointer/300/300",
    description: "High-quality laser pointer with multiple patterns and automatic shut-off for safe play sessions.",
    inStock: true,
    rating: 4.7
  },

  // Cat Food
  {
    id: 4,
    name: "Premium Salmon Cat Food",
    price: 24.99,
    category: "food",
    image: "https://picsum.photos/seed/salmon-food/300/300",
    description: "Grain-free premium cat food made with real salmon. Rich in omega-3 fatty acids for a healthy coat.",
    inStock: true,
    rating: 4.9
  },
  {
    id: 5,
    name: "Chicken & Rice Kibble",
    price: 18.99,
    category: "food",
    image: "https://picsum.photos/seed/chicken-kibble/300/300",
    description: "Balanced nutrition with real chicken and brown rice. Perfect for adult cats of all sizes.",
    inStock: true,
    rating: 4.5
  },
  {
    id: 6,
    name: "Gourmet Wet Food Variety Pack",
    price: 19.99,
    category: "food",
    image: "https://picsum.photos/seed/wet-food-variety/300/300",
    description: "12-can variety pack featuring chicken, beef, and fish flavors in delicious gravy.",
    inStock: true,
    rating: 4.8
  },

  // Cat Accessories
  {
    id: 7,
    name: "Cozy Cat Bed",
    price: 34.99,
    category: "accessories",
    image: "https://picsum.photos/seed/cat-bed/300/300",
    description: "Ultra-soft, machine-washable cat bed with raised edges for security. Perfect for napping cats.",
    inStock: true,
    rating: 4.7
  },
  {
    id: 8,
    name: "Scratching Post Tower",
    price: 45.99,
    category: "accessories",
    image: "https://picsum.photos/seed/scratching-post/300/300",
    description: "Multi-level scratching post with sisal rope and cozy perches. Keeps claws healthy and cats happy.",
    inStock: true,
    rating: 4.6
  },
  {
    id: 9,
    name: "Designer Cat Collar",
    price: 16.99,
    category: "accessories",
    image: "https://picsum.photos/seed/cat-collar/300/300",
    description: "Stylish breakaway collar with bell and ID tag. Available in multiple colors and patterns.",
    inStock: true,
    rating: 4.4
  },

  // Additional products to exceed the minimum requirement
  {
    id: 10,
    name: "Interactive Puzzle Feeder",
    price: 22.99,
    category: "accessories",
    image: "https://picsum.photos/seed/puzzle-feeder/300/300",
    description: "Slow-feeding puzzle bowl that promotes healthy eating habits and mental stimulation.",
    inStock: true,
    rating: 4.8
  },
  {
    id: 11,
    name: "Organic Catnip Treats",
    price: 7.99,
    category: "food",
    image: "https://picsum.photos/seed/catnip-treats/300/300",
    description: "All-natural catnip treats made with organic ingredients. Perfect for training and rewards.",
    inStock: true,
    rating: 4.7
  },
  {
    id: 12,
    name: "Cat Exercise Wheel",
    price: 189.99,
    category: "toys",
    image: "https://picsum.photos/seed/exercise-wheel/300/300",
    description: "Professional-grade exercise wheel for indoor cats. Helps maintain fitness and reduce boredom.",
    inStock: true,
    rating: 4.5
  }
];

// Product categories
export const categories: Category[] = [
  { id: 'all', name: 'All Products', icon: '🐱' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
  { id: 'food', name: 'Food & Treats', icon: '🥫' },
  { id: 'accessories', name: 'Accessories', icon: '🎀' }
];

// Helper functions
export const getProductById = (id: number | string): Product | undefined => {
  return products.find(product => product.id === parseInt(id.toString()));
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all' || !category) {
    return products;
  }
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  if (!query) return products;
  
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  // Return highest rated products
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export default products;
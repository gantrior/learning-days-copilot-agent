# GitHub Copilot Agent Instructions

## Project Overview

This is a **Cat E-Shop Demo** built with React, TypeScript, and Vite, designed specifically as a GitHub Copilot Agent development playground. The project demonstrates a fully functional e-commerce frontend with cat-themed products, shopping cart functionality, and checkout process, now with enhanced type safety and developer experience.

## Architecture & Design Principles

### Technology Stack
- **Frontend Framework**: React 18+ with functional components and hooks
- **Type System**: TypeScript for enhanced type safety and developer experience
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React Context API with TypeScript for global cart state
- **Styling**: CSS modules with responsive design
- **Data Persistence**: localStorage for cart state persistence

### Project Structure
```
src/
├── components/          # Reusable UI components (TypeScript)
│   ├── Header.tsx      # Navigation with search and cart
│   ├── Footer.tsx      # Contact info and social links
│   ├── ProductCard.tsx # Individual product display
│   ├── ProductGrid.tsx # Product collection layout
│   └── Loading.tsx     # Loading state component
├── pages/              # Route-based page components (TypeScript)
│   ├── HomePage.tsx    # Landing page with featured products
│   ├── SearchResults.tsx # Search results and filtering
│   ├── Cart.tsx        # Shopping cart management
│   ├── Checkout.tsx    # Order process form
│   └── OrderConfirmation.tsx # Order success page
├── contexts/           # React Context providers (TypeScript)
│   ├── CartContext.tsx # Global cart state management
│   └── useCart.ts      # Custom cart hook
├── types/             # TypeScript type definitions
│   └── index.ts       # Core interfaces and types
├── data/              # Static data and mock content (TypeScript)
│   └── products.ts    # Product catalog with helper functions
├── styles/            # CSS styling files
│   ├── index.css      # Global styles and reset
│   ├── App.css        # Main application styles
│   └── components.css # Component-specific styles
└── App.tsx            # Main app with routing setup
```

## Code Style Conventions

### Component Architecture
- **Use functional components exclusively** with React hooks and TypeScript
- **Follow PascalCase naming** for component files and functions
- **Use TypeScript interfaces** for prop types and component contracts
- **Implement single responsibility principle** - one component per file
- **Create reusable components** rather than duplicating code

### React Patterns
- **State Management**: Use `useState` with TypeScript generics for local state, Context API with typed interfaces for global state
- **Side Effects**: Use `useEffect` for data fetching and cleanup with proper dependency typing
- **Event Handling**: Use typed arrow functions for event handlers
- **Conditional Rendering**: Use ternary operators for simple conditions, logical AND for boolean conditions
- **List Rendering**: Always include unique `key` props when mapping arrays with proper typing

### File Organization
- **Component files**: Place in `src/components/` with `.tsx` extension
- **Page components**: Place in `src/pages/` for route-based components with `.tsx` extension
- **Context providers**: Place in `src/contexts/` with descriptive names and `.tsx` extension
- **Hooks**: Place in `src/contexts/` with `.ts` extension
- **Type definitions**: Place in `src/types/` as `.ts` modules
- **Static data**: Place in `src/data/` as `.ts` modules with proper typing
- **Styles**: Place in `src/styles/` with component-specific organization

### TypeScript Conventions
- **Use strict TypeScript configuration** with all strict mode options enabled
- **Define interfaces** for all data structures (Product, CartItem, User, Order, etc.)
- **Type all function parameters and return values** for better developer experience
- **Use generic types** where appropriate for reusable components
- **Avoid `any` type** - use proper typing or union types instead
- **Export types and interfaces** from centralized type definition files

### CSS and Styling
- **Use semantic class names** that describe purpose, not appearance
- **Follow BEM methodology** for CSS class naming
- **Implement mobile-first responsive design** with media queries
- **Use CSS custom properties** for consistent theming
- **Maintain cat-themed color palette**: oranges, browns, and warm tones

## TypeScript Integration

### Core Type Definitions
The project includes comprehensive TypeScript interfaces in `src/types/index.ts`:

- **Product**: Defines cat product structure with id, name, price, category, etc.
- **CartItem**: Extends Product with quantity for shopping cart items
- **Category**: Defines product categories with icons and names
- **Order**: Complete order structure with customer info and items
- **User**: User profile and contact information
- **CartContextValue**: Typed interface for cart context operations
- **CartAction**: Union type for cart reducer actions

### State Management with TypeScript

### Cart Context Structure (TypeScript)
```typescript
interface CartContextValue {
  cartItems: CartItem[];           // Array of typed cart items with product and quantity
  totalItems: number;             // Total number of items in cart
  totalPrice: number;             // Total price of all items
  addToCart: (product: Product) => void;        // Add product to cart
  removeFromCart: (id: number) => void;         // Remove product from cart
  updateQuantity: (id: number, quantity: number) => void; // Update item quantity
  clearCart: () => void;          // Clear all cart items
}
```

### Data Persistence
- **Cart state**: Automatically saved to localStorage on every change
- **Search history**: Optional localStorage for recent searches
- **User preferences**: Can be extended for theme or layout preferences

## Feature Implementation Guidelines

### Adding New Products
1. Update `src/data/products.js` with new product objects
2. Ensure each product has: `id`, `name`, `price`, `image`, `description`, `category`
3. Test product display in ProductCard and ProductGrid components

### Adding New Pages
1. Create component in `src/pages/` directory
2. Add route to `src/App.jsx` in the router configuration
3. Update navigation links in Header component if needed
4. Ensure responsive design and consistent styling

### Extending Cart Functionality
1. Add new actions to `CartContext.jsx`
2. Update cart state structure if needed
3. Implement localStorage persistence for new data
4. Test cart operations across all components

### Search and Filtering
1. Extend search logic in `SearchResults.jsx`
2. Add new filter criteria in product data structure
3. Implement real-time search in Header component
4. Consider performance optimization for large product catalogs

## Quality Standards

### Code Quality
- **Consistent indentation**: Use 2 spaces for JavaScript/JSX
- **Proper error handling**: Implement try-catch for async operations
- **Console warnings**: Resolve all React warnings and errors
- **Accessibility**: Include proper ARIA labels and semantic HTML

### Performance Considerations
- **Component optimization**: Use React.memo for expensive components
- **Image optimization**: Use appropriate image formats and sizes
- **Bundle size**: Keep dependencies minimal and tree-shake unused code
- **Loading states**: Implement loading indicators for better UX

### Testing Approach
- **Manual testing**: Verify all user flows work correctly
- **Cross-browser compatibility**: Test on modern browsers
- **Responsive design**: Test on various screen sizes
- **Cart persistence**: Verify localStorage functionality

## Demo Content Guidelines

### Product Data
- **Minimum 9 products** across categories: toys, food, accessories
- **Realistic pricing** with proper currency formatting
- **Cat-themed descriptions** with engaging copy
- **Placeholder images** from reliable sources

### Contact Information
- **Phone**: +1-555-CAT-SHOP
- **Email**: meow@catshop.demo
- **Social Media**: @CatShopDemo (Facebook, Instagram)

### Fake Checkout Process
- **No real payment processing** - simulate successful orders
- **Generate fake order numbers** for confirmation
- **Store order history** in localStorage for demo purposes

## Best Practices for AI Agent Development

### Agent-Friendly Code
- **Clear variable names** that describe purpose and content
- **Comprehensive comments** for complex business logic
- **Modular functions** that can be easily extended or modified
- **Consistent patterns** throughout the codebase

### Documentation Standards
- **Update this file** when adding new architectural patterns
- **Comment complex state logic** in Context providers
- **Document API contracts** for component props
- **Maintain README.md** with current setup instructions

### Extension Points
- **Product categories**: Easy to add new categories in data structure
- **Payment methods**: Designed to accommodate multiple fake payment types
- **User accounts**: Architecture supports future user authentication
- **Inventory tracking**: Product data structure ready for stock management

## Common Tasks for AI Agents

### Adding a New Product Category
1. Update product data with new category field
2. Add category filter to search functionality
3. Update navigation or filtering UI as needed
4. Test category display and filtering

### Implementing New Cart Features
1. Extend CartContext with new actions and state
2. Update localStorage persistence logic
3. Add UI components for new functionality
4. Test cart operations and persistence

### Styling and Theme Updates
1. Update CSS custom properties for color scheme
2. Modify component-specific styles in styles directory
3. Ensure responsive design is maintained
4. Test across different screen sizes

### Performance Optimizations
1. Identify performance bottlenecks
2. Implement React.memo or useMemo where appropriate
3. Optimize image loading and bundling
4. Test performance improvements

Remember: This is a demo project designed for learning and experimentation. Prioritize code clarity and educational value over production optimizations.
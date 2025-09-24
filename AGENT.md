# Agent Development Guide

## Project Overview

**Cat E-Shop Demo** - A React + TypeScript + Vite e-commerce demonstration project designed for GitHub Copilot Agent development and experimentation, now with enhanced type safety and superior developer experience.

## Quick Start Commands

### Development Server
```bash
npm run dev
```
Starts the Vite development server at `http://localhost:5173/`
- Hot reload enabled
- Fast refresh for React components
- TypeScript compilation and error checking
- ESLint integration for code quality

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` directory
- TypeScript compilation and type checking
- Minified and bundled JavaScript/CSS
- Asset optimization and hashing
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing
- Tests the actual production bundle
- Useful for verifying build optimization

### Code Quality
```bash
npm run lint
```
Runs ESLint to check code quality and style
- TypeScript-specific linting rules
- Catches common React anti-patterns
- Enforces consistent code style
- Reports accessibility issues

### Type Checking
```bash
npx tsc --noEmit
```
Runs TypeScript compiler for type checking without emitting files
- Validates all TypeScript interfaces and types
- Catches type errors before runtime
- Ensures type safety across the codebase

## Development Workflow

### 1. Environment Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd learning-days-copilot-agent
npm install

# Start development server
npm run dev
```

### 2. Project Structure Navigation
```
learning-days-copilot-agent/
├── .github/
│   └── copilot-instructions.md    # AI agent guidelines
├── src/
│   ├── components/                # Reusable UI components
│   ├── pages/                     # Route-based pages
│   ├── contexts/                  # React Context providers
│   ├── data/                      # Static data and mocks
│   ├── styles/                    # CSS styling files
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── public/                        # Static assets
├── plan/                          # Implementation planning docs
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── index.html                     # HTML template
```

### 3. Adding New Features

#### Adding a New Product
1. **Update Product Data**: Edit `src/data/products.js`
2. **Test Display**: Check ProductCard and ProductGrid components
3. **Verify Search**: Ensure new products appear in search results

#### Creating New Components
1. **Create Component**: Add to `src/components/` with `.jsx` extension
2. **Follow Naming**: Use PascalCase for file and component names
3. **Add Styles**: Create corresponding styles in `src/styles/`
4. **Import and Use**: Add to parent components as needed

#### Adding New Pages
1. **Create Page Component**: Add to `src/pages/` directory
2. **Add Route**: Update router configuration in `src/App.jsx`
3. **Update Navigation**: Add links in Header component if needed
4. **Test Routing**: Verify navigation works correctly

### 4. State Management

#### Cart Context Usage
```javascript
// In components, import and use cart context
import { useCart } from '../contexts/CartContext';

function MyComponent() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  
  // Use cart functions and state
  const handleAddToCart = () => {
    addToCart(product);
  };
}
```

#### Adding New Context
1. **Create Context**: Add to `src/contexts/` directory
2. **Provide Context**: Wrap components in `src/App.jsx`
3. **Use Context**: Import and use in child components

### 5. Styling Guidelines

#### CSS Organization
- **Global Styles**: `src/styles/index.css` for resets and global styles
- **App Styles**: `src/styles/App.css` for main application layout
- **Component Styles**: `src/styles/components.css` for component-specific styles

#### Responsive Design
```css
/* Mobile-first approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### 6. Testing Procedures

#### Manual Testing Checklist
- [ ] Home page loads with all products displayed
- [ ] Search functionality works with various keywords
- [ ] Products can be added to cart successfully
- [ ] Cart updates quantities and totals correctly
- [ ] Checkout process completes with fake order
- [ ] Navigation between pages works smoothly
- [ ] Responsive design functions on mobile/tablet/desktop
- [ ] localStorage persists cart data between sessions

#### Testing Commands
```bash
# Development testing
npm run dev
# Visit http://localhost:5173/ and test manually

# Production testing
npm run build
npm run preview
# Visit preview URL and test production build
```

### 7. Common Development Tasks

#### Adding Product Categories
1. **Update Data Structure**: Add category field to products
2. **Update Filtering Logic**: Modify search/filter components
3. **Add UI Elements**: Create category navigation if needed

#### Implementing New Cart Features
1. **Extend Context**: Add new actions to CartContext
2. **Update Persistence**: Modify localStorage logic
3. **Add UI Components**: Create new cart-related components
4. **Test Integration**: Verify all cart operations work

#### Performance Optimization
1. **Identify Bottlenecks**: Use React DevTools Profiler
2. **Implement Memoization**: Add React.memo or useMemo where needed
3. **Optimize Images**: Compress and use appropriate formats
4. **Bundle Analysis**: Check build size and optimize imports

### 8. Deployment

#### Static Deployment (Recommended)
```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Netlify: Drag and drop or Git integration
# - Vercel: Import Git repository
# - GitHub Pages: Use gh-pages action
# - Any static hosting service
```

#### Local Development Deployment
```bash
# Build and preview locally
npm run build
npm run preview

# Serve on local network
npm run dev -- --host
```

### 9. Troubleshooting

#### Common Issues

**Issue**: Vite server won't start
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: React hot reload not working
```bash
# Solution: Check vite.config.js and restart dev server
npm run dev
```

**Issue**: Build fails with missing dependencies
```bash
# Solution: Install missing dependencies
npm install
npm run build
```

**Issue**: Cart state not persisting
- Check browser localStorage in DevTools
- Verify CartContext persistence logic
- Test in incognito mode to rule out localStorage corruption

#### Debug Commands
```bash
# Check package dependencies
npm ls

# Audit for vulnerabilities
npm audit

# Update dependencies
npm update

# Clear npm cache
npm cache clean --force
```

### 10. Contributing Guidelines

#### Code Style
- Use 2-space indentation for JavaScript/JSX
- Follow ESLint rules configured in the project
- Write descriptive variable and function names
- Add comments for complex business logic

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-cat-product-category

# Make changes and commit
git add .
git commit -m "Add new cat toy category with 3 products"

# Push and create pull request
git push origin feature/new-cat-product-category
```

#### Documentation
- Update this AGENT.md file when adding new workflows
- Update .github/copilot-instructions.md for architectural changes
- Add inline comments for complex components
- Keep README.md current with setup instructions

## Demo Features Overview

### Current Features
- ✅ Product catalog with 9+ cat products
- ✅ Search and filtering functionality
- ✅ Shopping cart with quantity management
- ✅ Fake checkout process with order confirmation
- ✅ Responsive design for all devices
- ✅ Cart persistence using localStorage
- ✅ Cat-themed UI and content

### Potential Extensions (for AI Agents)
- 🔄 User account system with login/registration
- 🔄 Product reviews and ratings
- 🔄 Wishlist functionality
- 🔄 Advanced filtering (price range, brand, etc.)
- 🔄 Product comparison feature
- 🔄 Inventory tracking system
- 🔄 Multiple payment method simulation
- 🔄 Order history and tracking
- 🔄 Product recommendation engine
- 🔄 Admin panel for product management

### Contact Information (Demo)
- **Phone**: +1-555-CAT-SHOP
- **Email**: meow@catshop.demo
- **Social Media**: @CatShopDemo (Facebook, Instagram)

---

**Note**: This is a demonstration project designed for GitHub Copilot Agent development. All contact information and payment processes are simulated for educational purposes.
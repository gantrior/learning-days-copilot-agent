# Error Handling and Validation Guide

This document outlines the comprehensive error handling and validation patterns implemented in the Cat E-Shop Demo application.

## Overview

The application now includes:
- **React Error Boundaries** for catching and displaying runtime errors
- **react-hook-form** for robust form validation with real-time feedback
- **PropTypes** for runtime type validation across components
- **Enhanced error handling** in cart operations and state management
- **Accessible form validation** with ARIA attributes

## Error Boundaries

### Implementation

Error boundaries are implemented using the `react-error-boundary` library with a custom `ErrorBoundary` component:

```javascript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary">
      <h2>🐱 Oops! Something went wrong</h2>
      <p>Don't worry, we'll get this fixed for your cats!</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}
```

### Usage Patterns

Error boundaries are strategically placed around:
- **App-level**: Wraps the entire application
- **Component-level**: Around Header, Footer, and main content areas
- **Page-level**: Around individual route components
- **Form sections**: Around complex form sections in checkout

```javascript
<ErrorBoundary>
  <Header />
</ErrorBoundary>
```

## Form Validation with react-hook-form

### Checkout Form

The checkout form uses `react-hook-form` with comprehensive validation schemas:

```javascript
import { useForm } from 'react-hook-form';
import { validationSchemas } from '../utils/validation';

const {
  register,
  handleSubmit,
  formState: { errors },
  setValue
} = useForm({
  mode: 'onChange' // Real-time validation
});
```

### Validation Features

1. **Real-time validation**: Errors appear as users type
2. **Input formatting**: Automatic formatting for phone, card numbers, etc.
3. **Accessible errors**: ARIA attributes for screen readers
4. **Custom validation rules**: Business logic validation (e.g., card expiry)

### Field Examples

```javascript
// Email with pattern validation
<input
  {...register('email', validationSchemas.checkout.email)}
  aria-invalid={errors.email ? 'true' : 'false'}
/>

// Phone with formatting
<input
  {...register('phone', validationSchemas.checkout.phone)}
  onChange={handleFormattedInput('phone', formatters.phone)}
/>
```

## Validation Schemas

### Validation Rules

Located in `src/utils/validation.js`:

```javascript
export const validationSchemas = {
  checkout: {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      }
    },
    cardNumber: {
      required: 'Card number is required',
      validate: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 || 'Invalid card number length';
      }
    }
    // ... more fields
  }
};
```

### Input Formatters

Automatic formatting for better UX:

```javascript
export const formatters = {
  phone: (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    // Returns formatted like (555) 123-4567
  },
  
  cardNumber: (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : ''; // 1234 5678 9012 3456
  }
};
```

## PropTypes Implementation

### Runtime Type Validation

All components now include PropTypes for development-time validation:

```javascript
import PropTypes from 'prop-types';

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.number,
    inStock: PropTypes.bool
  }).isRequired
};
```

### Benefits

- **Development warnings**: Catches prop type mismatches early
- **Documentation**: Self-documenting component interfaces
- **Validation**: Runtime validation in development mode
- **IDE support**: Better intellisense and autocompletion

## Enhanced Cart Error Handling

### Robust Cart Operations

The cart context now includes comprehensive error handling:

```javascript
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
    // Could show toast notification in real app
  }
};
```

### Error Scenarios Handled

1. **Invalid product data**: Malformed product objects
2. **Missing required fields**: Incomplete product information
3. **Type validation**: Ensuring proper data types
4. **localStorage errors**: Graceful handling of storage failures
5. **Quantity limits**: Preventing unreasonable quantities (max 99)

## Accessibility Features

### ARIA Support

Form validation includes proper ARIA attributes:

```javascript
<input
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert" aria-live="polite">
    {errors.email.message}
  </span>
)}
```

### Screen Reader Support

- **Error announcements**: `role="alert"` for immediate feedback
- **Live regions**: `aria-live="polite"` for non-intrusive updates
- **Form associations**: Proper labeling and error associations
- **Focus management**: Proper focus handling during errors

## Error Message Patterns

### User-Friendly Messages

All error messages are written in clear, actionable language:

- ✅ "Please enter a valid email address"
- ✅ "Phone number must be at least 10 digits"
- ✅ "Card has expired"
- ❌ "Invalid input" (too vague)

### Error Display

- **Inline errors**: Next to the problematic field
- **Error styling**: Red borders and text for visual indication
- **Icons**: Clear visual indicators (⚠️ for warnings)
- **Contextual help**: Guidance on how to fix the error

## Testing Error Scenarios

### How to Test

1. **Form validation**: Submit empty checkout form
2. **Invalid inputs**: Enter malformed email, phone, card number
3. **Runtime errors**: Modify localStorage to corrupt data
4. **Network errors**: Block external image requests (already handled)
5. **Edge cases**: Try extreme quantities, expired cards

### Expected Behaviors

- **Graceful degradation**: App continues to function despite errors
- **User feedback**: Clear error messages for all scenarios
- **Recovery options**: "Try Again" buttons and alternative flows
- **Data preservation**: Form data maintained during error states

## Best Practices

### For Developers

1. **Wrap with ErrorBoundary**: Any component that might throw
2. **Validate early**: Check data at component boundaries
3. **Fail gracefully**: Always provide fallback UI
4. **Log errors**: Console.error for debugging (would use error service in production)
5. **Test edge cases**: Null/undefined values, malformed data

### For Users

1. **Clear feedback**: Immediate validation responses
2. **Helpful messages**: Explain what went wrong and how to fix it
3. **Visual indicators**: Color, icons, and styling for error states
4. **Accessibility**: Screen reader compatible error handling

## Production Considerations

### Error Reporting

In production, you would typically:

```javascript
const handleError = (error, errorInfo) => {
  // Send to error reporting service (e.g., Sentry, LogRocket)
  errorReportingService.captureException(error, {
    extra: errorInfo,
    user: getCurrentUser(),
    tags: { component: 'checkout' }
  });
};
```

### Performance

- **Lazy validation**: Only validate on user interaction
- **Debounced validation**: Avoid excessive API calls
- **Memoization**: Cache validation results where appropriate

This comprehensive error handling and validation system ensures the Cat E-Shop Demo provides a robust, user-friendly experience while maintaining code quality and accessibility standards.
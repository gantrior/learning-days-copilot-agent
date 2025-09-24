// Validation schemas for different forms
export const validationSchemas = {
  checkout: {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      }
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^\d{10,}$/,
        message: 'Please enter a valid phone number (10+ digits)'
      },
      validate: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 10 || 'Phone number must be at least 10 digits';
      }
    },
    firstName: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters'
      },
      maxLength: {
        value: 50,
        message: 'First name cannot exceed 50 characters'
      }
    },
    lastName: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters'
      },
      maxLength: {
        value: 50,
        message: 'Last name cannot exceed 50 characters'
      }
    },
    address: {
      required: 'Street address is required',
      minLength: {
        value: 5,
        message: 'Please enter a complete address'
      }
    },
    city: {
      required: 'City is required',
      minLength: {
        value: 2,
        message: 'City name must be at least 2 characters'
      }
    },
    state: {
      required: 'State is required'
    },
    zipCode: {
      required: 'ZIP code is required',
      pattern: {
        value: /^\d{5}(-\d{4})?$/,
        message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
      }
    },
    cardNumber: {
      required: 'Card number is required',
      pattern: {
        value: /^\d{13,19}$/,
        message: 'Card number must be 13-19 digits'
      },
      validate: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 || 'Invalid card number length';
      }
    },
    expiryDate: {
      required: 'Expiry date is required',
      pattern: {
        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
        message: 'Please enter a valid expiry date (MM/YY)'
      },
      validate: (value) => {
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          return 'Card has expired';
        }
        return true;
      }
    },
    cvv: {
      required: 'CVV is required',
      pattern: {
        value: /^\d{3,4}$/,
        message: 'CVV must be 3 or 4 digits'
      }
    },
    nameOnCard: {
      required: 'Name on card is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Name can only contain letters and spaces'
      }
    }
  }
};

// Input formatters for better UX
export const formatters = {
  phone: (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    
    let formatted = '';
    if (match[1]) formatted += `(${match[1]}`;
    if (match[2]) formatted += `) ${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;
    
    return formatted;
  },
  
  cardNumber: (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : '';
  },
  
  expiryDate: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  },
  
  zipCode: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
    }
    return cleaned;
  },
  
  cvv: (value) => {
    return value.replace(/\D/g, '').slice(0, 4);
  }
};

// Error message components - returns plain object for use in JSX
export const getErrorMessage = (error) => {
  if (!error) return null;
  
  return {
    message: error.message || error,
    role: 'alert',
    className: 'error-message'
  };
};

// Form validation utilities
export const createValidationProps = (name, register, errors, options = {}) => {
  const schema = validationSchemas.checkout[name];
  const formatter = formatters[name];
  
  if (!schema) {
    console.warn(`No validation schema found for field: ${name}`);
    return {};
  }
  
  const registerProps = register(name, schema);
  
  return {
    ...registerProps,
    className: errors[name] ? 'error' : '',
    onChange: (e) => {
      let value = e.target.value;
      
      // Apply formatter if available
      if (formatter) {
        value = formatter(value);
        e.target.value = value;
      }
      
      registerProps.onChange(e);
    },
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    ...options
  };
};

export const getErrorProps = (name, errors) => {
  if (!errors[name]) return {};
  
  return {
    id: `${name}-error`,
    role: 'alert',
    'aria-live': 'polite'
  };
};
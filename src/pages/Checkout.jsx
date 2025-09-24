import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { validationSchemas, formatters } from '../utils/validation';
import ErrorBoundary from '../components/ErrorBoundary';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      specialInstructions: ''
    },
    mode: 'onChange'
  });

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Custom input handlers with formatting
  const handleFormattedInput = (fieldName, formatter) => (e) => {
    const formatted = formatter(e.target.value);
    setValue(fieldName, formatted, { shouldValidate: true });
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CAT-${timestamp.slice(-6)}${randomNum}`;
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);
    setSubmitError(null);
    
    try {
      // Validate cart has items
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Validate total price
      if (typeof totalPrice !== 'number' || totalPrice <= 0) {
        throw new Error('Invalid order total');
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderNumber = generateOrderNumber();
      const orderTotal = totalPrice + (totalPrice * 0.08);
      
      // Store order in localStorage for demo
      const order = {
        orderNumber,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: orderTotal,
        shippingInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          apartment: data.apartment,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          email: data.email,
          phone: data.phone
        },
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      try {
        const existingOrders = JSON.parse(localStorage.getItem('catShopOrders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('catShopOrders', JSON.stringify(existingOrders));
      } catch (storageError) {
        console.warn('Could not save order to localStorage:', storageError);
        // Don't fail the order process if localStorage fails
      }
      
      // Clear cart
      clearCart();
      
      // Reset form
      reset();
      
      // Navigate to confirmation page with order details
      navigate('/order-confirmation', { 
        state: { 
          orderNumber, 
          orderTotal,
          customerName: `${data.firstName} ${data.lastName}`
        } 
      });
      
    } catch (error) {
      console.error('Order processing failed:', error);
      setSubmitError(error.message || 'Order processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h1>Checkout</h1>
            <p>Your cart is empty. Please add some items before checkout.</p>
            <button onClick={() => navigate('/search')} className="return-shopping-btn">
              Return to Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice;
  const tax = totalPrice * 0.08;
  const total = subtotal + tax;

  return (
    <ErrorBoundary>
      <div className="checkout-page">
        <div className="container">
          <h1>Checkout</h1>
          
          <div className="checkout-content">
            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form" noValidate>
              {/* Contact Information */}
              <ErrorBoundary>
                <section className="form-section">
                  <h2>Contact Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', validationSchemas.checkout.email)}
                        className={errors.email ? 'error' : ''}
                        placeholder="your.email@example.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <span id="email-error" className="error-message" role="alert">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone', validationSchemas.checkout.phone)}
                        onChange={handleFormattedInput('phone', formatters.phone)}
                        className={errors.phone ? 'error' : ''}
                        placeholder="(555) 123-4567"
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && (
                        <span id="phone-error" className="error-message" role="alert">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              </ErrorBoundary>

              {/* Shipping Information */}
              <ErrorBoundary>
                <section className="form-section">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        {...register('firstName', validationSchemas.checkout.firstName)}
                        className={errors.firstName ? 'error' : ''}
                        aria-invalid={errors.firstName ? 'true' : 'false'}
                        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      />
                      {errors.firstName && (
                        <span id="firstName-error" className="error-message" role="alert">
                          {errors.firstName.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        {...register('lastName', validationSchemas.checkout.lastName)}
                        className={errors.lastName ? 'error' : ''}
                        aria-invalid={errors.lastName ? 'true' : 'false'}
                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                      />
                      {errors.lastName && (
                        <span id="lastName-error" className="error-message" role="alert">
                          {errors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      {...register('address', validationSchemas.checkout.address)}
                      className={errors.address ? 'error' : ''}
                      placeholder="123 Main Street"
                      aria-invalid={errors.address ? 'true' : 'false'}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                    {errors.address && (
                      <span id="address-error" className="error-message" role="alert">
                        {errors.address.message}
                      </span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="apartment">Apartment, Suite, etc. (Optional)</label>
                    <input
                      type="text"
                      id="apartment"
                      {...register('apartment')}
                      placeholder="Apt 4B"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        {...register('city', validationSchemas.checkout.city)}
                        className={errors.city ? 'error' : ''}
                        aria-invalid={errors.city ? 'true' : 'false'}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                      />
                      {errors.city && (
                        <span id="city-error" className="error-message" role="alert">
                          {errors.city.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <select
                        id="state"
                        {...register('state', validationSchemas.checkout.state)}
                        className={errors.state ? 'error' : ''}
                        aria-invalid={errors.state ? 'true' : 'false'}
                        aria-describedby={errors.state ? 'state-error' : undefined}
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="WA">Washington</option>
                        {/* Add more states as needed */}
                      </select>
                      {errors.state && (
                        <span id="state-error" className="error-message" role="alert">
                          {errors.state.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        {...register('zipCode', validationSchemas.checkout.zipCode)}
                        onChange={handleFormattedInput('zipCode', formatters.zipCode)}
                        className={errors.zipCode ? 'error' : ''}
                        placeholder="12345"
                        aria-invalid={errors.zipCode ? 'true' : 'false'}
                        aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                      />
                      {errors.zipCode && (
                        <span id="zipCode-error" className="error-message" role="alert">
                          {errors.zipCode.message}
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              </ErrorBoundary>

              {/* Payment Information */}
              <ErrorBoundary>
                <section className="form-section">
                  <h2>Payment Information</h2>
                  <p className="demo-note">
                    ⚠️ This is a demo site. Use fake card information for testing.
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      {...register('cardNumber', validationSchemas.checkout.cardNumber)}
                      onChange={handleFormattedInput('cardNumber', formatters.cardNumber)}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                      aria-invalid={errors.cardNumber ? 'true' : 'false'}
                      aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                    />
                    {errors.cardNumber && (
                      <span id="cardNumber-error" className="error-message" role="alert">
                        {errors.cardNumber.message}
                      </span>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        {...register('expiryDate', validationSchemas.checkout.expiryDate)}
                        onChange={handleFormattedInput('expiryDate', formatters.expiryDate)}
                        className={errors.expiryDate ? 'error' : ''}
                        placeholder="MM/YY"
                        aria-invalid={errors.expiryDate ? 'true' : 'false'}
                        aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                      />
                      {errors.expiryDate && (
                        <span id="expiryDate-error" className="error-message" role="alert">
                          {errors.expiryDate.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        {...register('cvv', validationSchemas.checkout.cvv)}
                        onChange={handleFormattedInput('cvv', formatters.cvv)}
                        className={errors.cvv ? 'error' : ''}
                        placeholder="123"
                        aria-invalid={errors.cvv ? 'true' : 'false'}
                        aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                      />
                      {errors.cvv && (
                        <span id="cvv-error" className="error-message" role="alert">
                          {errors.cvv.message}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="nameOnCard">Name on Card *</label>
                    <input
                      type="text"
                      id="nameOnCard"
                      {...register('nameOnCard', validationSchemas.checkout.nameOnCard)}
                      className={errors.nameOnCard ? 'error' : ''}
                      placeholder="John Doe"
                      aria-invalid={errors.nameOnCard ? 'true' : 'false'}
                      aria-describedby={errors.nameOnCard ? 'nameOnCard-error' : undefined}
                    />
                    {errors.nameOnCard && (
                      <span id="nameOnCard-error" className="error-message" role="alert">
                        {errors.nameOnCard.message}
                      </span>
                    )}
                  </div>
                </section>
              </ErrorBoundary>

              {/* Special Instructions */}
              <ErrorBoundary>
                <section className="form-section">
                  <h2>Special Instructions (Optional)</h2>
                  <div className="form-group">
                    <label htmlFor="specialInstructions">
                      Delivery Instructions for Your Cat Products
                    </label>
                    <textarea
                      id="specialInstructions"
                      {...register('specialInstructions')}
                      rows="3"
                      placeholder="Any special delivery instructions for your cat's happiness..."
                    />
                  </div>
                </section>
              </ErrorBoundary>

              {submitError && (
                <div className="form-error" role="alert">
                  {submitError}
                </div>
              )}

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isProcessing}
                aria-describedby={isProcessing ? 'processing-status' : undefined}
              >
                {isProcessing ? (
                  <>
                    <span id="processing-status" aria-live="polite">
                      Processing Order...
                    </span>
                  </>
                ) : (
                  `Place Order • ${formatPrice(total)}`
                )}
              </button>
            </form>

            <ErrorBoundary>
              <div className="order-summary-sidebar">
                <div className="order-summary">
                  <h2>Order Summary</h2>
                  
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="item-thumbnail"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%23f0f0f0"/><text x="25" y="30" font-family="Arial" font-size="30" text-anchor="middle" fill="%23666">🐱</text></svg>';
                          }}
                        />
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <span className="item-total">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-totals">
                    <div className="total-line">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="total-line">
                      <span>Shipping:</span>
                      <span className="free-shipping">FREE</span>
                    </div>
                    <div className="total-line">
                      <span>Tax:</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="total-line grand-total">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="security-info">
                  <h3>🔒 Secure Checkout</h3>
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

Checkout.propTypes = {
  // This component doesn't receive props directly, but we can document its dependencies
};

export default Checkout;
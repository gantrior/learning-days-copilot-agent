import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Information
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Special Instructions
    specialInstructions: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Contact validation
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Shipping validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    // Payment validation (fake validation for demo)
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^\d{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CAT-${timestamp.slice(-6)}${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderNumber = generateOrderNumber();
      const orderTotal = totalPrice + (totalPrice * 0.08);
      
      // Store order in localStorage for demo
      const order = {
        orderNumber,
        items: cartItems,
        total: orderTotal,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('catShopOrders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('catShopOrders', JSON.stringify(existingOrders));
      
      // Clear cart
      clearCart();
      
      // Navigate to confirmation page with order details
      navigate('/order-confirmation', { 
        state: { 
          orderNumber, 
          orderTotal,
          customerName: `${formData.firstName} ${formData.lastName}`
        } 
      });
      
    } catch (error) {
      console.error('Order processing failed:', error);
      setErrors({ submit: 'Order processing failed. Please try again.' });
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
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Contact Information */}
            <section className="form-section">
              <h2>Contact Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
            </section>

            {/* Shipping Information */}
            <section className="form-section">
              <h2>Shipping Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="123 Main Street"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="apartment">Apartment, Suite, etc. (Optional)</label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apt 4B"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="WA">Washington</option>
                    {/* Add more states as needed */}
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={errors.zipCode ? 'error' : ''}
                    placeholder="12345"
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>
            </section>

            {/* Payment Information */}
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
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={errors.cardNumber ? 'error' : ''}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={errors.expiryDate ? 'error' : ''}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={errors.cvv ? 'error' : ''}
                    placeholder="123"
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="nameOnCard">Name on Card *</label>
                <input
                  type="text"
                  id="nameOnCard"
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                  className={errors.nameOnCard ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.nameOnCard && <span className="error-message">{errors.nameOnCard}</span>}
              </div>
            </section>

            {/* Special Instructions */}
            <section className="form-section">
              <h2>Special Instructions (Optional)</h2>
              <div className="form-group">
                <label htmlFor="specialInstructions">
                  Delivery Instructions for Your Cat Products
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special delivery instructions for your cat's happiness..."
                />
              </div>
            </section>

            {errors.submit && (
              <div className="form-error">
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Order...' : `Place Order • ${formatPrice(total)}`}
            </button>
          </form>

          <div className="order-summary-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="item-thumbnail" />
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
        </div>
      </div>
    </div>
  );
}

export default Checkout;
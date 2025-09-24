import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';

// This would normally fetch from a backend API
const getMockOrderById = (orderId) => {
  return {
    id: orderId,
    status: 'shipped',
    items: [
      { 
        id: 1, 
        name: 'Interactive Feather Wand', 
        price: 12.99, 
        quantity: 1,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f0f0f0"/><text x="150" y="130" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="%23666">🧸</text><text x="150" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="%23999">Interactive Feather Wand</text></svg>'
      },
      { 
        id: 2, 
        name: 'Premium Cat Food - Salmon', 
        price: 24.99, 
        quantity: 2,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f0f0f0"/><text x="150" y="130" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="%23666">🥫</text><text x="150" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="%23999">Premium Cat Food</text></svg>'
      },
      { 
        id: 3, 
        name: 'Cozy Cat Bed', 
        price: 29.99, 
        quantity: 1,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f0f0f0"/><text x="150" y="130" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="%23666">🛏️</text><text x="150" y="180" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="%23999">Cozy Cat Bed</text></svg>'
      }
    ],
    subtotal: 92.96,
    shipping: 5.99,
    tax: 7.92,
    total: 106.87,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    trackingNumber: 'TRACK12345ABC',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    shippingAddress: {
      name: 'John Doe',
      street: '123 Cat Street',
      city: 'Meowtown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    statusHistory: [
      {
        status: 'pending',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order placed and payment confirmed'
      },
      {
        status: 'processing',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order is being prepared for shipment'
      },
      {
        status: 'shipped',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order has been shipped and is on its way'
      }
    ]
  };
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'processing': return '📦';
    case 'shipped': return '🚚';
    case 'delivered': return '✅';
    default: return '📋';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#ffa502';
    case 'processing': return '#3742fa';
    case 'shipped': return '#2ed573';
    case 'delivered': return '#1dd1a1';
    default: return '#747d8c';
  }
};

function OrderDetails() {
  const { orderId } = useParams();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      // Simulate API call
      setTimeout(() => {
        try {
          const mockOrder = getMockOrderById(orderId);
          setOrder(mockOrder);
          setLoading(false);
        } catch {
          setError('Order not found');
          setLoading(false);
        }
      }, 1000);
    }
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleReorder = () => {
    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item);
      }
    });
    
    // Show success message (in a real app, this might be a toast notification)
    alert(`${order.items.length} items added to cart! 🛒`);
  };

  const handleTrackOrder = () => {
    // Simulate opening tracking page (demo only)
    alert(`Tracking package ${order.trackingNumber}\n\nIn a real app, this would open a tracking page or redirect to the carrier's website.`);
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="order-details-page">
      <div className="container">
        <div className="page-header">
          <div className="header-navigation">
            <Link to="/orders" className="back-link">
              ← Back to Orders
            </Link>
          </div>
          
          <div className="order-header">
            <h1>Order #{order.id}</h1>
            <div className="order-meta">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusIcon(order.status)} {order.status.toUpperCase()}
              </span>
              <span className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="order-content">
          <div className="order-main">
            {/* Order Status Timeline */}
            <div className="status-timeline">
              <h2>Order Status</h2>
              <div className="timeline">
                {order.statusHistory.map((status, index) => (
                  <div 
                    key={index}
                    className={`timeline-item ${index === order.statusHistory.length - 1 ? 'current' : 'completed'}`}
                  >
                    <div className="timeline-marker">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="timeline-content">
                      <h3>{status.status.charAt(0).toUpperCase() + status.status.slice(1)}</h3>
                      <p>{status.description}</p>
                      <time>{new Date(status.date).toLocaleString()}</time>
                    </div>
                  </div>
                ))}
                
                {order.status === 'shipped' && (
                  <div className="timeline-item upcoming">
                    <div className="timeline-marker">📬</div>
                    <div className="timeline-content">
                      <h3>Delivered</h3>
                      <p>Estimated delivery</p>
                      <time>{new Date(order.estimatedDelivery).toLocaleDateString()}</time>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h2>Items Ordered ({order.items.length})</h2>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="order-item-card">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h3>{item.name}</h3>
                      <div className="item-price">
                        {formatPrice(item.price)} × {item.quantity}
                      </div>
                      <div className="item-total">
                        Total: {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <button 
                      className="add-to-cart-btn small"
                      onClick={() => addToCart(item)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-sidebar">
            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="sidebar-section">
                <h3>📦 Tracking Information</h3>
                <div className="tracking-details">
                  <div className="tracking-number">
                    <span className="label">Tracking Number:</span>
                    <span className="value">{order.trackingNumber}</span>
                  </div>
                  <div className="estimated-delivery">
                    <span className="label">Estimated Delivery:</span>
                    <span className="value">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                  <button className="track-btn" onClick={handleTrackOrder}>
                    📍 Track Package
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="sidebar-section">
              <h3>🏠 Shipping Address</h3>
              <div className="address">
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="sidebar-section">
              <h3>💰 Order Summary</h3>
              <div className="order-summary">
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="summary-line total">
                  <span><strong>Total:</strong></span>
                  <span><strong>{formatPrice(order.total)}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sidebar-section">
              <h3>🔄 Actions</h3>
              <div className="order-actions">
                <button className="reorder-btn" onClick={handleReorder}>
                  🔄 Reorder All Items
                </button>
                {order.status === 'delivered' && (
                  <button className="review-btn">
                    ⭐ Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
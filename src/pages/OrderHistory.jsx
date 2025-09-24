import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock order data generator
const generateMockOrders = (userId) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const orders = [];
  
  for (let i = 0; i < 5; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - (i * 7)); // One order per week going back
    
    orders.push({
      id: `CAT-${String(Date.now() + i).slice(-6)}`,
      userId,
      status: statuses[Math.min(i, statuses.length - 1)],
      items: [
        { id: 1, name: 'Interactive Feather Wand', price: 12.99, quantity: 1 },
        { id: 2, name: 'Premium Cat Food', price: 24.99, quantity: 2 }
      ],
      total: i === 0 ? 62.97 : 37.98 + (i * 5), // Vary the totals
      createdAt: orderDate.toISOString(),
      trackingNumber: i < 3 ? `TRACK${String(Math.random()).slice(-8).toUpperCase()}` : null,
      shippingAddress: {
        street: '123 Cat Street',
        city: 'Meowtown',
        state: 'CA',
        zipCode: '90210'
      }
    });
  }
  
  return orders;
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

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate loading orders
      setTimeout(() => {
        const mockOrders = generateMockOrders(user.id);
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="container">
          <div className="page-header">
            <h1>
              <span className="page-icon">📦</span>
              Order History
            </h1>
            <p className="page-subtitle">Track your Cat E-Shop purchases</p>
          </div>

          <div className="empty-orders">
            <div className="empty-state">
              <span className="empty-icon">🛒</span>
              <h2>No orders yet</h2>
              <p>
                You haven't placed any orders yet. Start shopping for your 
                feline friend and your orders will appear here!
              </p>
              
              <div className="empty-actions">
                <Link to="/" className="browse-products-btn">
                  🏠 Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <span className="page-icon">📦</span>
            Order History
          </h1>
          <p className="page-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order.id}</h3>
                  <div className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-content">
                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-total">
                    <strong>Total: {formatPrice(order.total)}</strong>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <span className="tracking-label">Tracking:</span>
                      <span className="tracking-number">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-actions">
                <Link 
                  to={`/order/${order.id}`} 
                  className="view-details-btn"
                >
                  📋 View Details
                </Link>
                
                {order.status === 'delivered' && (
                  <button className="reorder-btn">
                    🔄 Reorder
                  </button>
                )}
                
                {order.trackingNumber && (
                  <button className="track-order-btn">
                    📍 Track Package
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="order-history-footer">
          <Link to="/search" className="continue-shopping-btn">
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
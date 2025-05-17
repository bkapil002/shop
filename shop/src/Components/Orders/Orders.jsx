import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Truck, CircleCheckBig, Package, ShoppingBag } from 'lucide-react';
import './Orders.css'; // Import the CSS file

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to view your orders');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/order/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const cancelOrder = async (orderId) => {
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to cancel the order');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/order/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error('Failed to cancel the order');
    }
  };

  const requestReturn = async (orderId, productId) => {
    try {
      const token = user ? user.token : null;
      if (!token) {
        toast.error('Please log in to request a return');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/order/return/${orderId}`, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);

      // Update the local state to reflect the return request
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? {
            ...order,
            products: order.products.map(item =>
              item.product._id === productId ? { ...item, returnRequested: true } : item
            )
          } : order
        )
      );
    } catch (error) {
      toast.error('Failed to request a return');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ordered':
        return (
          <span className="status-badge ordered">
            <Package className="status-icon" />
            Ordered
          </span>
        );
      case 'Shipping':
        return (
          <span className="status-badge shipping">
            <Truck className="status-icon" />
            Shipping
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="status-badge out-for-delivery">
            <Truck className="status-icon" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="status-badge delivered">
            <CircleCheckBig className="status-icon" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-badge cancelled">
            <X className="status-icon" />
            Cancelled
          </span>
        );
      case 'Return Requested':
        return (
          <span className="status-badge return-requested">
            <CircleCheckBig className="status-icon" />
            Return Requested
          </span>
        );
      case 'Return Processed':
        return (
          <span className="status-badge return-processed">
            <CircleCheckBig className="status-icon" />
            Return Processed
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isWithinReturnWindow = (deliveryDate) => {
    const fiveDaysAfterDelivery = new Date(deliveryDate);
    fiveDaysAfterDelivery.setDate(fiveDaysAfterDelivery.getDate() + 5);
    return new Date() <= fiveDaysAfterDelivery;
  };

  // Loading skeleton for orders
  const OrdersSkeleton = () => (
    <div className="orders-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-order">
          <div className="skeleton-header">
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
          <div className="skeleton-products">
            {[1, 2].map((j) => (
              <div key={j} className="skeleton-product">
                <div className="skeleton-image"></div>
                <div className="skeleton-details">
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                </div>
                <div className="skeleton-row"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-header"></div>
        <OrdersSkeleton />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-content">
          <ShoppingBag className="empty-icon" />
          <h2 className="empty-title">No orders yet</h2>
          <p className="empty-message">
            When you place orders, they will appear here for you to track and manage.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      Ordered: 'status-ordered',
      Shipping: 'status-shipping',
      'Out for Delivery': 'status-out-for-delivery',
      Delivered: 'status-delivered',
      Cancelled: 'status-cancelled',
      'Return Requested': 'status-return-requested',
      'Return Processed': 'status-return-processed',
    };
    return colors[status] || 'status-default';
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <span className="orders-count">{orders.length} orders</span>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-content">
                {/* Order Header */}
                <div className="order-header">
                  <div>
                    <p className="order-date">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                    <p className="order-id">#{order._id}</p>
                    {order.deliveryDate && (
                      <p className="delivery-date">
                        Delivery by {formatDate(order.deliveryDate)}
                      </p>
                    )}
                  </div>
                  <div className="order-status">
                    <div className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="order-total">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Products List */}
                <div className="products-list">
                  {order.products.map((item) => (
                    <div key={item.product._id} className="product-item">
                      <div className="product-image-container">
                        <img
                          src={item.product.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          className="product-image"
                        />
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{item.product.name}</h3>
                        <div className="product-info">
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                          <p>${item.product.sellingPrice?.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="product-actions">
                        <p className="product-price">
                          ${(item.quantity * item.product.sellingPrice)?.toFixed(2)}
                        </p>
                        {/* Request Return Button */}
                        {order.status === 'Delivered' &&
                          item.product.features?.sevenDayReturns &&
                          !item.returnRequested &&
                          isWithinReturnWindow(order.deliveryDate) && (
                            <button
                              onClick={() => requestReturn(order._id, item.product._id)}
                              className="return-button"
                            >
                              <CircleCheckBig className="return-icon" />
                              Request Return
                            </button>
                          )}
                        {item.returnRequested && (
                          <span className="return-requested">
                            <CircleCheckBig className="return-icon" />
                            Return Requested
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancel Order Button */}
                {order.status === 'Ordered' && (
                  <div className="cancel-order">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="cancel-button"
                    >
                      <X className="cancel-icon" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

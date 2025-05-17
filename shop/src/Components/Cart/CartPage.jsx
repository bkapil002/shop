import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CartPage.css'; // Import the CSS file

const CartPage = () => {
  const { user, updateCart } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateCartTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const sellingPrice = item.product.sellingPrice || 0;
      return sum + sellingPrice * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  const fetchCartItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = user.token;
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCartItems(response.data.products);
      calculateCartTotal(response.data.products);
    } catch (error) {
      console.error('Failed to fetch cart items', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAddressExists = async (token) => {
    const response = await fetch('http://localhost:5000/api/address/check-user-details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false; // Address details not found
      }
      throw new Error('Failed to fetch address details');
    }

    const data = await response.json();
    return !!data; // Return true if address details exist, false otherwise
  };

  const handleNext = async () => {
    if (!user?.token) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const hasAddress = await checkAddressExists(user.token);
      if (hasAddress) {
        navigate('/AddressDetails');
      } else {
        navigate('/address');
      }
    } catch (error) {
      toast.error('Failed to check address details');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (id, quantity) => {
    if (!user) {
      alert('Please log in to update your cart');
      return;
    }

    if (quantity < 1) return; // Prevent quantity from going below 1
    if (quantity > 2) {
      alert('Maximum quantity allowed is 2 items per product');
      return;
    }

    try {
      const token = user.token;
      await axios.post(
        `http://localhost:5000/api/cart/update/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.product._id === id ? { ...item, quantity } : item
        )
      );

      calculateCartTotal(
        cartItems.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update item quantity', error);
      alert('Failed to update the quantity. Please try again.');
    }
  };

  const removeItemFromCart = async (id) => {
    if (!user) {
      alert('Please log in to remove items from your cart');
      return;
    }

    try {
      const token = user.token;
      await axios.delete(`http://localhost:5000/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      updateCart(cartItems.filter((item) => item.product._id !== id));
      setCartItems((prevCart) => prevCart.filter((item) => item.product._id !== id));
      calculateCartTotal(cartItems.filter((item) => item.product._id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      alert('Failed to remove item from the cart. Please try again.');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  useEffect(() => {
    calculateCartTotal(cartItems);
  }, [cartItems]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <ShoppingCart className="cart-icon" />
          <h1 className="cart-title">Your Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart className="empty-cart-icon" />
            <p className="empty-cart-message">Your cart is empty</p>
            <button
              className="continue-shopping-button"
              onClick={() => window.history.back()}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <div className="cart-item-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-content">
                      <div className="cart-item-image-container">
                        {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                          <img
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            className="cart-item-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="no-image">
                            <span>No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <div className="cart-item-info">
                            <h3 className="cart-item-name">{item.product.name}</h3>
                            <p className="cart-item-brand">{item.product.brand}</p>
                            {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                          </div>
                          <p className="cart-item-price">
                            ₹{(item.product.sellingPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="cart-item-actions">
                          <div className="cart-item-quantity">
                            <button
                              onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                              className="quantity-button"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="quantity-icon" />
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                              className="quantity-button"
                              disabled={item.quantity >= 2}
                            >
                              <Plus className="quantity-icon" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItemFromCart(item.product._id)}
                            className="remove-item-button"
                          >
                            <X className="remove-icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-container">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-details">
                  <div className="summary-row">
                    <div className="summary-label">
                      <span>Subtotal</span>
                    </div>
                    <span className="summary-value">₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <div className="summary-label">
                      <span>Shipping</span>
                      <HelpCircle className="help-icon" />
                    </div>
                    <span className="summary-value free-shipping">Free</span>
                  </div>

                  <div className="summary-row">
                    <div className="summary-label">
                      <span>Tax</span>
                      <HelpCircle className="help-icon" />
                    </div>
                    <span className="summary-value">₹0.00</span>
                  </div>

                  <div className="summary-total">
                    <span className="total-label">Total</span>
                    <span className="total-value">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="checkout-button"
                  onClick={handleNext}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

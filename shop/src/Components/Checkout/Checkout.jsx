import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingBagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css'; // Import the CSS file

export default function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = user?.token;
      if (!token) {
        toast.error('Please log in to view your cart');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch cart');
      setCart([]);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = user?.token;
      if (!token) {
        toast.error('Please log in to view your details');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      toast.error('Failed to fetch user details');
      setUserDetails(null);
    }
  };

  const fetchAddressDetails = async () => {
    try {
      const token = user?.token;
      if (!token) {
        toast.error('Please log in to view your address details');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/address/check-user-details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddressDetails(response.data);
    } catch (error) {
      toast.error('Failed to fetch address details');
      setAddressDetails(null);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const token = user?.token;
      if (!token) {
        toast.error('Please log in to place an order');
        setLoading(false);
        return;
      }

      const orderDetails = {
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          sellingPrice: item.product.sellingPrice,
          size: item.size,
        })),
        totalAmount: calculateTotalAmount(),
        shippingAddress: addressDetails,
        paymentMethod: paymentMethod,
      };

      await axios.post('http://localhost:5000/api/order', orderDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Order placed successfully');
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.product.sellingPrice * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
    fetchUserDetails();
    fetchAddressDetails();
  }, [user]);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <div className="header-content">
            <ShoppingBagIcon className="header-icon" />
            <h1 className="header-title">Checkout</h1>
          </div>
        </div>

        <div className="checkout-grid">
          <div className="checkout-section">
            {/* Order Summary */}
            <div className="order-summary">
              <h2 className="section-title">Order Summary</h2>
              <div className="order-items">
                {Array.isArray(cart) && cart.length > 0 ? (
                  cart.map(item => (
                    <div key={item.product._id} className="order-item">
                      <div className="item-content">
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="item-image"
                          loading="lazy"
                        />
                        <div className="item-details">
                          <h3 className="item-name">{item.product.name}</h3>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                          <p className="item-size">Size: {item.size}</p>
                          <p className="item-price">${item.product.sellingPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No items in cart</p>
                )}
              </div>
              <div className="order-total">
                <div className="total-row">
                  <p>Total</p>
                  <p>${calculateTotalAmount().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="user-details">
              <h2 className="section-title">User Details</h2>
              {userDetails ? (
                <div className="user-info">
                  <div className="info-row">
                    <span>Email</span>
                    <span>{userDetails.email}</span>
                  </div>
                </div>
              ) : (
                <div className="loading-animation">
                  <div className="loading-row"></div>
                  <div className="loading-row"></div>
                </div>
              )}
            </div>
          </div>

          <div className="checkout-section">
            {/* Delivery Address */}
            <div className="delivery-address">
              <h2 className="section-title">Delivery Address</h2>
              {addressDetails ? (
                <div className="address-info">
                  <div className="info-row">
                    <span>Name</span>
                    <span>{addressDetails.name}</span>
                  </div>
                  <div className="info-row">
                    <span>Phone</span>
                    <span>{addressDetails.phone}</span>
                  </div>
                  <div>
                    <span>Address</span>
                    <p>
                      {addressDetails.houseNo}, {addressDetails.landmark},
                      <br />
                      {addressDetails.areaPin}, {addressDetails.state}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="loading-animation">
                  <div className="loading-row"></div>
                  <div className="loading-row"></div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="payment-method">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash On Delivery"
                    checked={paymentMethod === 'Cash On Delivery'}
                    onChange={() => setPaymentMethod('Cash On Delivery')}
                  />
                  <span>Cash On Delivery</span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={loading || !userDetails || !addressDetails || cart.length === 0}
              className="place-order-button"
            >
              {loading ? (
                <span className="processing">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

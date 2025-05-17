import React, { useState } from 'react';
import {  Product } from '../types';
import { CheckCircle, X } from 'lucide-react';

export interface Order{
  id: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  productId: string;
  quantity: number;
  orderDate: Date;
}

interface OrderFormProps {
  product: Product | null;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onClose, onSubmitOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      address,
      phone,
      email,
      productId: product.id,
      quantity,
      orderDate: new Date()
    };
    
    onSubmitOrder(newOrder);
    setOrderSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setOrderSuccess(false);
      setCustomerName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setQuantity(1);
      onClose();
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been received.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address*
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
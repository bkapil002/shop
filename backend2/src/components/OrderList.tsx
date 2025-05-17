import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Truck, CircleCheckBig, Package, Trash } from 'lucide-react';

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    sellingPrice: number;
    imageUrls: string[];
  };
  quantity: number;
  returnRequested: boolean;
  size: string;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string;
  user: {
    email: string;
  };
  shippingAddress: {
    houseNo: string;
    landmark: string;
    areaPin: string;
    type: string;
    state: string;
    phone: string;
    name: string;
  };
}

type OrderStatus =
  | 'Ordered'
  | 'Shipping'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned';

const OrderManagement: React.FC = () => {
  const orderStatuses: OrderStatus[] = [
    'Ordered',
    'Shipping',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Return Requested',
    'Returned',
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>('Ordered');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/order/Chick-User-Order');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to retrieve orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/order/admin/update/${orderId}`, {
        status,
        deliveryDate,
      });
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
      setSelectedOrder(null); // Close the form
    } catch (error) {
      toast.error('Failed to update the order status');
    }
  };

  const handleReturnRequest = async (orderId: string, productId: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/order/admin/return/${orderId}`, {
        productId,
      });
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error('Failed to process the return request');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/order/admin/delete/${orderId}`);
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error('Failed to delete the order');
    }
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Ordered':
        return (
          <span className="flex items-center text-yellow-600">
            <Package className="h-5 w-5 mr-1" />
            Ordered
          </span>
        );
      case 'Shipping':
        return (
          <span className="flex items-center text-yellow-600">
            <Truck className="h-5 w-5 mr-1" />
            Shipping
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="flex items-center text-yellow-600">
            <Truck className="h-5 w-5 mr-1" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="flex items-center text-green-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center text-red-600">
            <X className="h-5 w-5 mr-1" />
            Cancelled
          </span>
        );
      case 'Return Requested':
        return (
          <span className="flex items-center text-blue-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Return Requested
          </span>
        );
      case 'Returned':
        return (
          <span className="flex items-center text-purple-600">
            <CircleCheckBig className="h-5 w-5 mr-1" />
            Returned
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No orders available</h2>
        <p className="text-gray-600 mb-8">
          There are currently no orders to display.
        </p>
      </div>
    );
  }

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Management Dashboard</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {orderStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium
                transition-all duration-200 ease-in-out
                ${filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`
                bg-white rounded-xl shadow-sm overflow-hidden
                transition-all duration-300 hover:shadow-md
                ${order.status === 'Cancelled' ? 'bg-red-50' : ''}
              `}
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      Order Date: {formatDate(order.createdAt)}
                    </p>
                    <p className="text-indigo-600 font-medium">
                      Expected Delivery: {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">{renderStatusBadge(order.status)}</div>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{order.totalAmount?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{order.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium">
                      {order.shippingAddress.houseNo}, {order.shippingAddress.landmark},
                      {order.shippingAddress.areaPin}, {order.shippingAddress.type},
                      {order.shippingAddress.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.product.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                          <p className="text-gray-600">
                            {item.quantity} × ₹{item.product.sellingPrice?.toFixed(2) || 'N/A'}
                          </p>
                          {item.returnRequested && (
                            <span className="ml-4 inline-flex items-center text-blue-600">
                              <CircleCheckBig className="h-4 w-4 mr-1" />
                              Return Requested
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.quantity * item.product.sellingPrice)?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatus(order.status);
                      setDeliveryDate(order.deliveryDate); // Set the delivery date
                    }}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Update Status
                  </button>
                  {order.status === 'Cancelled' && (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 inline mr-1" />
                      Delete Order
                    </button>
                  )}
                  {order.products.some(item => item.returnRequested) && (
                    <button
                      onClick={() => handleReturnRequest(
                        order._id,
                        order.products.find(item => item.returnRequested)!.product._id
                      )}
                      className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      <CircleCheckBig className="h-4 w-4 inline mr-1" />
                      Mark as Returned
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Update Status Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Update Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {orderStatuses.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id)}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

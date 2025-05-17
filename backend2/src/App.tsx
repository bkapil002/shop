import { useState, useEffect } from 'react';
import { Product, Order } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { Package, ShoppingBag, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
    setShowProductForm(false);
  };

  const handleOrderProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleSubmitOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="bottom-right" />
      
      {/* Header */}
      <header className="bg-blue-600 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-center">Product Management System</h1>
          </div>
        </div>
      </header>

      {/* Navigation and Actions */}
      <div className="sticky top-16 sm:top-20 bg-white z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex cursor-pointer items-center whitespace-nowrap py-4 px-1 border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Products</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex  cursor-pointer items-center whitespace-nowrap py-4 px-1 border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Orders</span>
              </button>
            </nav>

            {activeTab === 'products' && (
              <button
                onClick={() => setShowProductForm(true)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base mt-2 sm:mt-0"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Upload Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-md">
          {activeTab === 'products' ? (
            products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-center text-gray-500 text-sm sm:text-base">
                  No products available. Add a product to get started.
                </p>
              </div>
            ) : (
              <ProductList products={products} onOrderProduct={handleOrderProduct} />
            )
          ) : (
            <OrderList orders={orders} products={products} />
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <ProductForm
              onAddProduct={handleAddProduct}
              onCancel={() => setShowProductForm(false)}
            />
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <OrderForm
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onSubmitOrder={handleSubmitOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
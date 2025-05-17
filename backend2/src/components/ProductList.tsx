import React, { useState } from 'react';
import { Product } from '../types';
import { Edit, Trash, Eye } from 'lucide-react';
import UpdateProductForm from './UpdateProductForm';

interface ProductListProps {
  products: Product[];
  onOrderProduct: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No products available yet.</p>
      </div>
    );
  }

  const handleEdit = (product: Product) => {
    console.log('Editing product:', product); // Debugging statement
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const calculateDiscount = (price: number, sellingPrice?: number) => {
    if (!sellingPrice || sellingPrice >= price) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  const handleDelete = (productId: string) => {
    // Implement delete functionality here
    console.log(`Delete product with ID: ${productId}`);
  };

  const handleView = (productId: string) => {
    // Implement view functionality here
    console.log(`View product with ID: ${productId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const discountPercentage = calculateDiscount(product.price, product.sellingPrice);

          return (
            <div
              key={product.id || `product-${Math.random().toString(36).substr(2, 9)}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
            >
              {/* Product Image */}
              <div className="relative">
                {product.imageUrls && product.imageUrls[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image for product ${product.name}`);
                      e.currentTarget.src = 'path_to_default_image.jpg'; // Ensure this path is correct
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {discountPercentage}% off
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2 h-10 mb-1">{product.name}</h3>

                {/* Price Section */}
                <div className="mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-green-600">inclusive of all taxes</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      title="Edit"
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleView(product.id)}
                      title="View"
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isFormOpen && editingProduct && (
          <div className="fixed top-0 left-0 w-full h-full z-50  bg-opacity-50 flex justify-center items-center">
            <div className="p-4 w-full max-w-md bg-white rounded-lg shadow-md">
              <UpdateProductForm
                product={editingProduct}
                onClose={() => setIsFormOpen(false)}
                onAddProduct={(updatedProduct) => {
                  // Handle the updated product, e.g., update the product list
                  console.log('Product updated:', updatedProduct);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

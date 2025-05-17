import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Share2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import lowerPrice from '../image/saving-money.png';
import returnProduct from '../image/return.png';
import cashOnDelivery from '../image/cash-on-delivery.png';
import freeDelivery from '../image/free-shipping.png';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProductPage.css'; // Import the CSS file

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { user, updateCart } = useAuth();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    }
  }, [id]);

  const fetchRelated = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/related-products/${id}`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch related products', error);
    } finally {
      setRelatedProductsLoading(false);
    }
  }, [id]);

  const addToCart = async (product) => {
    try {
      const token = user ? user.token : null;

      if (!token) {
        toast('Please login to add items to the cart');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { id: product._id, quantity: 1, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast('Product added to cart');
      updateCart(response.data.products);
    } catch (error) {
      console.error('Failed to add to cart', error);
      toast.error('Add the Size');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRelated();
  }, [fetchProduct, fetchRelated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  const availableSizes = Object.keys(product.size).filter(size => product.size[size]);

  const calculateDiscount = (price, sellingPrice) => {
    if (price && sellingPrice && sellingPrice < price) {
      const discountPercentage = ((price - sellingPrice) / price) * 100;
      return Math.round(discountPercentage);
    }
    return 0;
  };

  const nextImage = () => {
    if (product.imageUrls) {
      setSelectedImage((prev) => (prev + 1) % product.imageUrls.length);
    }
  };

  const previousImage = () => {
    if (product.imageUrls) {
      setSelectedImage((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    }
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Breadcrumb - Mobile */}
        <div className="breadcrumb-mobile">
          <Link to="/" className="back-link">
            ← Back to products
          </Link>
        </div>

        {/* Breadcrumb - Desktop */}
        <nav className="breadcrumb-desktop">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img
                src={product.imageUrls?.[selectedImage] || ''}
                alt={product.name}
                className="main-image"
                onClick={() => setIsImageModalOpen(true)}
              />
              {product.imageUrls && product.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="image-nav-button left"
                  >
                    <ChevronLeft className="nav-icon" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="image-nav-button right"
                  >
                    <ChevronRight className="nav-icon" />
                  </button>
                </>
              )}
              {product.sellingPrice && product.sellingPrice < product.price && (
                <div className="discount-badge">
                  {calculateDiscount(product.price, product.sellingPrice)}% OFF
                </div>
              )}
            </div>
            <div className="thumbnail-grid">
              {product.imageUrls?.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-button ${selectedImage === index ? 'selected' : ''}`}
                >
                  <img
                    src={url}
                    alt={`${product.name} - View ${index + 1}`}
                    className="thumbnail-image"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div>
              <h1 className="product-title">
                {product.name}
              </h1>
              <div className="price-container">
                <span className="product-price">
                  ${product.sellingPrice?.toFixed(2) || product.price.toFixed(2)}
                </span>
                {product.sellingPrice && product.sellingPrice < product.price && (
                  <div className="discount-info">
                    <span className="original-price">${product.price.toFixed(2)}</span>
                    <span className="discount-percentage">
                      {calculateDiscount(product.price, product.sellingPrice)}% off
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="size-selector">
              <h3 className="size-selector-title">Select Size</h3>
              <div className="size-grid">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="features-grid">
              {product.features?.freeDelivery && (
                <div className="feature-item">
                  <img
                    src={freeDelivery}
                    alt="Free Delivery"
                    className="feature-icon"
                  />
                  <span className="feature-text">
                    Free Delivery
                  </span>
                </div>
              )}
              {product.features?.cashOnDelivery && (
                <div className="feature-item">
                  <img
                    src={cashOnDelivery}
                    alt="Cash On Delivery"
                    className="feature-icon"
                  />
                  <span className="feature-text">
                    Cash On Delivery
                  </span>
                </div>
              )}
              {product.features?.fiveDayReturns && (
                <div className="feature-item">
                  <img
                    src={returnProduct}
                    alt="5-Day Returns"
                    className="feature-icon"
                  />
                  <span className="feature-text">
                    5-Day Returns
                  </span>
                </div>
              )}
              {product.features?.lowestPrice && (
                <div className="feature-item">
                  <img
                    src={lowerPrice}
                    alt="Low Price"
                    className="feature-icon"
                  />
                  <span className="feature-text">
                    Low Price
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => addToCart(product)}
                className="add-to-cart-button"
              >
                <ShoppingCart className="cart-icon" />
                <span>Add to Cart</span>
              </button>
              <div className="share-button-container">
                <button
                  className="share-button"
                  aria-label="Share"
                >
                  <Share2 className="share-icon" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="product-description">
              <h3 className="description-title">Product Details</h3>
              <div className="description-text">
                {product.details && product.details.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2 className="related-products-title">You May Also Like</h2>
          {relatedProductsLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading related products...</p>
            </div>
          ) : (
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => {
                const discountPercentage = calculateDiscount(
                  relatedProduct.price,
                  relatedProduct.sellingPrice || relatedProduct.price
                );

                return (
                  <Link
                    to={`/product/${relatedProduct._id}`}
                    key={relatedProduct._id}
                    className="related-product-card"
                  >
                    <div className="related-product-image-container">
                      <img
                        src={relatedProduct.imageUrls?.[0] || ''}
                        alt={relatedProduct.name}
                        className="related-product-image"
                        loading="lazy"
                      />
                      {discountPercentage > 0 && (
                        <div className="related-product-discount-badge">
                          {discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="related-product-info">
                      <h3 className="related-product-title">
                        {relatedProduct.name}
                      </h3>
                      <p className="related-product-category">{relatedProduct.category}</p>
                      <div className="related-product-price-container">
                        <span className="related-product-price">
                          ${relatedProduct.sellingPrice?.toFixed(2) || relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.sellingPrice && relatedProduct.sellingPrice < relatedProduct.price && (
                          <span className="related-product-original-price">
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="image-modal"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="modal-content">
            <img
              src={product.imageUrls?.[selectedImage]}
              alt={product.name}
              className="modal-image"
            />
            <button
              className="modal-close-button"
              onClick={() => setIsImageModalOpen(false)}
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

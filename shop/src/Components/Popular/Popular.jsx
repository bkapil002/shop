import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Popular.css';

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/product');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const Popular = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const allProducts = await fetchProducts();
      // Filter products to only include those in the "Women" category
      const womenProducts = allProducts.filter(product => product.category === 'Women');
      setProducts(womenProducts);
    };

    getProducts();
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {products.slice(0, 4).map(product => (
          <Link className='item' key={product.id} to={`/product/${product._id}`}>
            <img src={product.imageUrls[0]} alt={product.name} />
            <p>{product.name}</p>
            <div className="item-prices">
              <div className="item-price-new">
                ${product.sellingPrice}
              </div>
              <div className="item-price-old">
                ${product.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Popular;

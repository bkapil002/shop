import React, { useEffect, useState } from 'react';
import './Men.css';
import dropdown_icon from '../../Components/Assets/dropdown_icon.png';
import top from '../image/topImage (1).png';
import { Link } from 'react-router-dom';

// Mock function to fetch products
const fetchProducts = async () => {
  // Replace this with your actual API call
  const response = await fetch('http://localhost:5000/api/product');
  const data = await response.json();
  return data;
};

const Men = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const allProducts = await fetchProducts();
      // Filter products to only include those in the "men" category
      const menProducts = allProducts.filter(product => product.category === 'Men');
      setProducts(menProducts);
    };

    getProducts();
  }, []);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={top} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{products.length}</span> out of {products.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {products.map(product => (
          <Link to={`/product/${product._id}`} className='item' key={product._id}>
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
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
}

export default Men;

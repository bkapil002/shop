import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewCollections.css';

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

const NewCollections = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const allProducts = await fetchProducts();
      // Filter products to include those in the "Men" and "Kids" categories
      const menProducts = allProducts.filter(product => product.category === 'Men').slice(0, 4);
      const kidsProducts = allProducts.filter(product => product.category === 'Kids').slice(0, 4);

      setMenProducts(menProducts);
      setKidsProducts(kidsProducts);
    };

    getProducts();
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {menProducts.map(product => (
          <Link className='item' key={product.id} to={`/product/${product.id}`}>
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
      <div className="collections">
        {kidsProducts.map(product => (
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

export default NewCollections;

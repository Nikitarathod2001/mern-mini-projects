import React from 'react';
import { useEffect, useState } from 'react';
import { getProducts } from '../services/productApi';
import ProductList from '../components/ProductList';

const ProductPage = () => {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 3;

  useEffect(() => {

    const fetchProducts = async () => {
      try {

        const data = await getProducts(page, limit);
        setProducts(data.products);
        
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    };

    fetchProducts();

  }, [page]);

  return (
    <div className='min-h-screen bg-gray-200 p-6'>

      <div className='mx-auto max-w-6xl'>

        <h1 className='mb-6 text-3xl font-bold'>
          Products
        </h1>

        <ProductList products={products}/>

      </div>
      
    </div>
  )
}

export default ProductPage

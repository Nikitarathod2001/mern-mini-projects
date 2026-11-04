import React from 'react';
import { useEffect, useState } from 'react';
import { getProducts } from '../services/productApi';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';

const ProductPage = () => {

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 3;

  useEffect(() => {

    const fetchProducts = async () => {
      try {

        const data = await getProducts(page, limit);
        setProducts(data.products);
        setPagination(data.pagination);
        
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

        {
          pagination && (
            <Pagination currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={setPage}
            />
          )
        }

      </div>
      
    </div>
  )
}

export default ProductPage

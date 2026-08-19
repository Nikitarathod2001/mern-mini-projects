import React from 'react'

const ProductList = ({products}) => {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>

      {
        products.map((product) => (

          <div key={product._id} className='rounded-lg bg-white p-5 shadow'>

            <h2 className='text-xl font-semibold'>
              {product.name}
            </h2>

            <p className='mt-2 text-gray-600'>
              Category: {product.category}
            </p>

            <p className='mt-2 font-medium'>
              &#8377;{product.price}
            </p>

            <p className='mt-1 text-sm text-gray-500'>
              Stock: {product.stock}
            </p>

          </div>

        ))
      }
      
    </div>
  )
}

export default ProductList

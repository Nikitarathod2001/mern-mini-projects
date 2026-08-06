import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react'
import AppRoute from "./routes/AppRoute";

const App = () => {

  const [product, setProduct] = useState(null);

  const handleCheckout = async () => {
    try {

      const res = await axios.post("http://localhost:5000/create-checkout-session", {
        id: product.id,
        name: product.name,
        price: product.price
      });

      window.location.href = res.data.url;
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {

        const res = await axios.get("http://localhost:5000/api/product");

        setProduct(res.data);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, []);

  if(!product) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (

    <>
    
    <AppRoute/>

    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl transition hover:shadow-2xl">

        <img className="h-64 w-full object-cover" src={product.image} alt={product.name} />
        
        <div className="p-6">

          <h2 className="text-2xl font-bold text-gray-800">
            {product.name}
          </h2>

          <p className="mt-2 text-gray-600">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-3xl font-bold text-green-600">
              &#x20B9;{product.price}
            </span>

            <button onClick={handleCheckout} 
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 active:scale-95">
              Buy Now
            </button>

          </div>

        </div>

      </div>
      
    </div>

    </>
  )
}

export default App

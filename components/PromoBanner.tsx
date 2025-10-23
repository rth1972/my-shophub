'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/app/context/AppContext';

const PromoBanner = () => {
  const { getRandomProduct, addToCart } = useAppContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getRandomProduct(); // Fetch 3 random products
      if (Array.isArray(result)) {
        setProducts(result);
      } else if (result) {
        setProducts([result]); // fallback if single product is returned
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-300">
        {products.length > 0 && products.map((product) => (
          <div
            key={product.product_id}
            className="relative z-10 flex flex-col lg:flex-row justify-between items-center overflow-hidden rounded-lg bg-[#DBF4F3] py-12 lg:py-16 px-4 sm:px-8 lg:px-14 mb-8"
          >
            <div className="max-w-[550px] w-full mb-6 lg:mb-0">
              <span className="block font-medium text-xl text-gray-800 mb-3">
                {product.product_name}
              </span>

              <h2 className="font-bold text-2xl lg:text-3xl text-gray-900 mb-5">
                ${product.price}
              </h2>

              <p className="text-gray-700 dark:text-gray-200 mb-4">
                {product.description}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="inline-flex font-medium text-sm text-white bg-blue-600 py-2.5 px-6 rounded-md transition duration-200 hover:bg-blue-700"
              >
                Buy Now
              </button>
            </div>

            <div className="flex-shrink-0">
              <Image
                src={product.image_url}
                alt={product.product_name}
                width={274}
                height={350}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;

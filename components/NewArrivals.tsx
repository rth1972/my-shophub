'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";

const NewArrival = ({onAddToCart}) => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/latest?limit=4');
      const data = await response.json();
      setLatestProducts(data.products || []);
      //console.log(data.products)
    } catch (error) {
      console.error('Error fetching latest products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="overflow-hidden pt-15 py-12">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        {/* Section title */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-pink-600 mb-1.5 hidden">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Latest Treasures
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Fresh finds from our pre-loved collection
            </p>
          </div>

          <Link
            href="/all"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-pink-200 border bg-blue text-white ease-out duration-200 hover:bg-blue-dark hover:text-white hover:border-transparent shadow-sm"
          >
            View All
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading latest treasures...</p>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {/* New Arrivals items from API */}
            {latestProducts.map((item, key) => (
             item.stock_quantity !== 0 && (
      <ProductItem onAddToCart={onAddToCart} item={item} key={key}  />
    )
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useAppContext } from '@/app/context/AppContext';
import { useState, useEffect } from 'react';
// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
    const {
     products,
    categories,
    cart,
    user,
    orders,
    filteredProducts,
    isCartOpen,
    isAuthOpen,
    isCheckout,
    showOrders,
    loading,
    searchTerm,
    getRandomProducts,
    setSearchTerm,
    setIsCartOpen,
    setIsAuthOpen,
    setIsCheckout,
    setShowOrders,
    handleLogin,
    handleRegister,
    handleLogout,
    addToCart,
    updateQuantity,
    removeFromCart,
    handleCheckout,
    handleSubmitOrder,
    fetchOrders,
    getCartTotal,
    getCartCount,
  } = useAppContext();
  const [randomProducts, setRandomProducts] = useState([]);
  
  useEffect(() => {
    const fetchRandomProducts = async () => {
      const products = await getRandomProducts(3); // Get 5 random products
      setRandomProducts(products);
    };

    fetchRandomProducts();
  }, []); // Run once on mount
  
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
     <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5 mx-auto">
            {/*<div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>*/}

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              Welcome to Carol's Closet
            </h1>

            <p>
              Pre-Loved Treasures & Vintage Finds
            </p>

           {/* <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </a>*/}
            <p className="text-gray-5 mt-2 text-sm">Discover timeless charm in every piece. At Carol's Closet, we curate vintage and pre-loved treasures that tell stories—handpicked for their beauty, character, and soul. From antique books to heirloom accessories, our collection invites you to explore, rediscover, and fall in love with vintage all over again.</p>
          </div>

          <div className="py-10 sm:py-15 lg:py-16 pl-4 sm:pr-7.5 lg:pr-2.5">
            <Image
              src="/images/Gemini_Generated_Image_2kik7b2kik7b2kik-removebg-preview.png"
              alt="headphone"
              width={401}
              height={408}
            />
          </div>
        </div>
      </SwiperSlide>
      {randomProducts.map((product) => (
        <SwiperSlide key={product.product_id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row justify-between">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              {/*<div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  30%
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>*/}
              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <a href={`/products/${product.product_id}`}>
                  {product.product_name}
                </a>
              </h1>
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-2xl font-bold text-dark mb-2">
                ${product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                Add to Cart
              </button>
            </div>
            <div className="py-10 sm:py-15 lg:py-16 pl-4 sm:pr-7.5 lg:pr-7.5">
              <Image
                src={product.image_url || '/images/hero/hero-01.png'}
                alt={product.product_name}
                width={251}
                height={258}
                className="object-contain"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">True Wireless Noise Cancelling Headphone</a>
            </h1>

            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-01.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;

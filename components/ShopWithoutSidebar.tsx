'use client';
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import ProductItem from "@/components/Common/ProductItem";

export default function AllProductsPage() {
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
  const [productStyle, setProductStyle] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const options = ['All', 'Women', 'Men', 'Kids'];
  const shopData = [
    {
      product_id: 1,
      product_name: 'Vintage Denim Jacket',
      price: 49.99,
      image_url: '/images/products/jacket.jpg',
      category_name: 'Women',
    },
    {
      product_id: 2,
      product_name: 'Retro Sneakers',
      price: 69.99,
      image_url: '/images/products/sneakers.jpg',
      category_name: 'Men',
    },
    // Add more sample products as needed
  ];

  return (
    <section className="overflow-hidden relative pb-20 pt-5 lg:pt-10 xl:pt-18 bg-white bg-[#f3f4f6]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex gap-7.5">
          <div className="w-full">
            <div className="rounded-lg bg-blue shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4 text-white">
                 
                    All Products
                </div>

                {/*div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setProductStyle('grid')}
                    aria-label="grid view"
                    className={`${
                      productStyle === 'grid'
                        ? 'bg-blue border-blue text-white'
                        : 'text-dark bg-gray-1 border-gray-3'
                    } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setProductStyle('list')}
                    aria-label="list view"
                    className={`${
                      productStyle === 'list'
                        ? 'bg-blue border-blue text-white'
                        : 'text-dark bg-gray-1 border-gray-3'
                    } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                  >
                    List
                  </button>
                </div>*/}
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9">
              {products.map((item, key) => 
              item.stock_quantity !== 0 && (
      <ProductItem onAddToCart={addToCart} item={item} key={key}  />
    )
              )}
            </div>

            <div className="flex justify-center mt-15">
              <div className="bg-white shadow-1 rounded-md p-2">
                <ul className="flex items-center">
                  <li>
                    <button
                      aria-label="pagination left"
                      type="button"
                      disabled
                      className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                    >
                      ←
                    </button>
                  </li>

                  {[1, 2, 3, 4, 5, '...', 10].map((page, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                          page === 1 ? 'bg-blue text-white' : 'hover:text-white hover:bg-blue'
                        }`}
                      >
                        {page}
                      </a>
                    </li>
                  ))}

                  <li>
                    <button
                      aria-label="pagination right"
                      type="button"
                      className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                    >
                      →
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

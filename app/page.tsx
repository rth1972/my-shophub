'use client';
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import CheckoutPage from '@/components/CheckoutPage';
import OrdersPage from '@/components/OrdersPage';
import NewArrival from '@/components/NewArrivals';
import PromoBanner from '@/components/PromoBanner';
import DisclaimerModal from '@/components/DisclaimerModal';
import { AlertTriangle, HandCoins } from 'lucide-react';

export default function Home() {
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
  } = useAppContext();

  if (showOrders) {
    return <OrdersPage orders={orders} onBack={() => setShowOrders(false)} />;
  }

  if (isCheckout) {
    return (
      <CheckoutPage
        cart={cart}
        total={getCartTotal()}
        onBack={() => setIsCheckout(false)}
        onSubmitOrder={handleSubmitOrder}
        loading={loading}
      />
    );
  }
const [showModal, setShowModal] = useState(false);

const disclaimerText = (
  <div className="flex flex-col items-center space-y-4 px-4 text-center text-sm sm:text-base">
    <div className="flex items-center gap-2 text-red-600 font-semibold">
      <AlertTriangle className="w-5 h-5" />
      <span>Payment Notice</span>
    </div>

    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
      At this time, we are only able to accept <span className="font-medium text-blue-500">cash upon pickup</span> for all orders.
    </p>

    <div className="flex items-center gap-2 text-blue-500">
      <HandCoins className="w-5 h-5" />
      <span>We appreciate your understanding and support.</span>
    </div>
  </div>
);
  
  return (
    <div className="min-h-screen bg-gray-50 mb-24">
        {showModal && (
        <DisclaimerModal 
          onClose={() => setShowModal(false)} 
          text={disclaimerText} 
        />
      )}
      <Hero />
      <Categories categories={categories} />
      <NewArrival onAddToCart={addToCart} products={filteredProducts} />
      <PromoBanner />
    </div>
  );
}

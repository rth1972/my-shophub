'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface HeaderContextType {
  user: any;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cart: any[];
  cartCount: number;
  cartTotal: number;
  handleLogout: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        fetchCart(data.user.customer_id);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const fetchCart = async (customerId: string) => {
    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`);
      const data = await response.json();
      setCart(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCart([]);
      alert('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <HeaderContext.Provider
      value={{
        user,
        searchTerm,
        setSearchTerm,
        cart,
        cartCount,
        cartTotal,
        handleLogout,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) throw new Error('useHeader must be used within a HeaderProvider');
  return context;
};

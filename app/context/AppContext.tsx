'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckout, setIsCheckout] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(false);
const router = useRouter();
  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCart = async (customerId) => {
    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`);
      const data = await response.json();
      setCart(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

 const clearCart = async (customerId) => {
    try {
      setCart([]);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthOpen(false);
        fetchCart(data.user.customer_id);
        //alert('Login successful!');
        router.push('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please login.');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCart([]);
      //alert('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = async (product) => {
  if (!user) {
    alert('Please login to add items to cart');
    setIsAuthOpen(true);
    return;
  }

  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: user.customer_id,
        product_id: product.product_id,
        quantity: 1
      })
    });

    if (response.ok) {
      await fetchCart(user.customer_id); // ✅ This updates global cart state
      //alert('Added to cart!');
      toast.success('Product added to shopping cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

const getRandomProduct = async () => {
  try {
    const response = await fetch('/api/products/random');
    const data = await response.json();

    if (response.ok) {
      return data.products; // ✅ returns the product object
    } else {
      console.error('Failed to fetch random product:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching random product:', error);
    return null;
  }
};
const getRandomProducts = async (limit = 5) => {
  try {
    const response = await fetch(`/api/products/random?limit=${limit}`);
    const data = await response.json();

    if (response.ok) {
      return data.products; // ✅ expects an array of products
    } else {
      console.error('Failed to fetch random products:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching random products:', error);
    return [];
  }
};

  const updateQuantity = async (productId, delta) => {
    if (!user) return;

    const item = cart.find(c => c.product_id === productId);
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.customer_id,
          product_id: productId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        fetchCart(user.customer_id);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.customer_id,
          product_id: productId
        })
      });

      if (response.ok) {
        fetchCart(user.customer_id);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      setIsAuthOpen(true);
      return;
    }
    setIsCheckout(true);
    setIsCartOpen(false);
  };

  const handleSubmitOrder = async (formData) => {
    setLoading(true);

    try {
      const addressResponse = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.customer_id,
          address_type: 'shipping',
          ...formData
        })
      });

      const addressData = await addressResponse.json();

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.customer_id,
          shipping_address_id: addressData.address_id,
          billing_address_id: addressData.address_id,
          payment_method: formData.paymentMethod
        })
      });

      const orderData = await orderResponse.json();

      if (orderResponse.ok) {
        alert(`Order #${orderData.order_id} placed successfully!`);
        setCart([]);
        setIsCheckout(false);
      } else {
        alert(orderData.error || 'Order failed');
      }
    } catch (error) {
      alert('Order error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/orders?customer_id=${user.customer_id}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setShowOrders(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category_name === selectedCategory;
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        products,
        getRandomProduct,
        categories,
        orders,
        filteredProducts,
        isCartOpen,
        isAuthOpen,
        isCheckout,
        showOrders,
        loading,
        searchTerm,
        selectedCategory,
        setSearchTerm,
        setSelectedCategory,
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
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

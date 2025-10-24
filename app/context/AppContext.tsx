'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Define types
interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  category_id: number;
  category_name: string;
  stock_quantity: number;
  image_url: string;
}

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface User {
  customer_id: number;
  email: string;
  name: string;
}

interface Order {
  order_id: number;
  order_date: string;
  total_amount: number;
  status: string;
}

interface Category {
  category_id: number;
  category_name: string;
  description: string;
  image: string;
}

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  products: Product[];
  getRandomProduct: () => Promise<Product[] | null>;
  getRandomProducts: (limit?: number) => Promise<Product[]>;
  categories: Category[];
  orders: Order[];
  filteredProducts: Product[];
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isCheckout: boolean;
  showOrders: boolean;
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsCheckout: (checkout: boolean) => void;
  setShowOrders: (show: boolean) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (formData: any) => Promise<void>;
  handleLogout: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (productId: number, delta: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  handleCheckout: () => void;
  handleSubmitOrder: (formData: any) => Promise<void>;
  fetchOrders: () => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

// LocalStorage helper functions
const CART_STORAGE_KEY = 'shopping_cart';

const cartStorage = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  saveCart: (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_STORAGE_KEY);
  },
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckout, setIsCheckout] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = cartStorage.getCart();
    setCart(localCart);
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartLoaded) {
      cartStorage.saveCart(cart);
    }
  }, [cart, isCartLoaded]);

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
        // Merge local cart with database cart on login
        await mergeCartOnLogin(data.user.customer_id);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  // Merge localStorage cart with database cart when user logs in
  const mergeCartOnLogin = async (customerId: number) => {
    try {
      const localCart = cartStorage.getCart();
      
      // If there's a local cart, sync it to the database
      if (localCart.length > 0) {
        const response = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: customerId,
            cart: localCart
          })
        });

        if (response.ok) {
          const data = await response.json();
          setCart(data.cart || localCart);
          cartStorage.saveCart(data.cart || localCart);
        }
      } else {
        // No local cart, fetch from database
        await fetchCartFromDatabase(customerId);
      }
    } catch (error) {
      console.error('Error merging cart:', error);
    }
  };

  const fetchCartFromDatabase = async (customerId: number) => {
    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`);
      const data = await response.json();
      const dbCart = data.cart || [];
      setCart(dbCart);
      cartStorage.saveCart(dbCart);
    } catch (error) {
      console.error('Error fetching cart from database:', error);
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

  const clearCart = async () => {
    try {
      setCart([]);
      cartStorage.clearCart();
      
      // Also clear database cart if user is logged in
      if (user) {
        await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id: user.customer_id })
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  
  const handleLogin = async (email: string, password: string) => {
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
        
        // Merge carts on login
        await mergeCartOnLogin(data.user.customer_id);
        
        router.push('/');
        toast.success('Login successful!');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error: any) {
      toast.error('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Registration successful! Please login.');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error: any) {
      toast.error('Registration error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      
      // Keep cart in localStorage for guest browsing
      // Don't clear it - let them continue shopping as guest
      
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = async (product: Product) => {
    const cartItem: CartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url
    };

    // Add to local cart
    const existingIndex = cart.findIndex(item => item.product_id === product.product_id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [...cart, cartItem];
    }

    setCart(updatedCart);
    toast.success('Product added to shopping cart');

    // If user is logged in, sync to database
    if (user) {
      try {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: user.customer_id,
            product_id: product.product_id,
            quantity: 1
          })
        });
      } catch (error) {
        console.error('Error syncing cart to database:', error);
      }
    }
  };

  const getRandomProduct = async () => {
    try {
      const response = await fetch('/api/products/random');
      const data = await response.json();

      if (response.ok) {
        return data.products;
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
        return data.products;
      } else {
        console.error('Failed to fetch random products:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching random products:', error);
      return [];
    }
  };

  const updateQuantity = async (productId: number, delta: number) => {
    const itemIndex = cart.findIndex(c => c.product_id === productId);
    if (itemIndex === -1) return;

    const newQuantity = cart[itemIndex].quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update local cart
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity = newQuantity;
    setCart(updatedCart);

    // If user is logged in, sync to database
    if (user) {
      try {
        await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: user.customer_id,
            product_id: productId,
            quantity: newQuantity
          })
        });
      } catch (error) {
        console.error('Error syncing cart to database:', error);
      }
    }
  };

  const removeFromCart = async (productId: number) => {
    // Remove from local cart
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    toast.success('Item removed from cart');

    // If user is logged in, sync to database
    if (user) {
      try {
        await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: user.customer_id,
            product_id: productId
          })
        });
      } catch (error) {
        console.error('Error syncing cart to database:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      setIsAuthOpen(true);
      setIsCartOpen(false);
      return;
    }
    setIsCheckout(true);
    setIsCartOpen(false);
  };

  const handleSubmitOrder = async (formData: any) => {
    setLoading(true);

    try {
      const addressResponse = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user?.customer_id,
          address_type: 'shipping',
          ...formData
        })
      });

      const addressData = await addressResponse.json();

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user?.customer_id,
          shipping_address_id: addressData.address_id,
          billing_address_id: addressData.address_id,
          payment_method: formData.paymentMethod
        })
      });

      const orderData = await orderResponse.json();

      if (orderResponse.ok) {
        toast.success(`Order #${orderData.order_id} placed successfully!`);
        clearCart();
        setIsCheckout(false);
      } else {
        toast.error(orderData.error || 'Order failed');
      }
    } catch (error: any) {
      toast.error('Order error: ' + error.message);
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
        getRandomProducts,
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
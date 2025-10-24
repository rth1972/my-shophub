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

  const fetchCart = async (customerId: number) => {
    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`);
      const data = await response.json();
      setCart(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
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
        fetchCart(data.user.customer_id);
        router.push('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error: any) {
      alert('Login error: ' + error.message);
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
        alert('Registration successful! Please login.');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error: any) {
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      //alert('Please login to add items to cart');
      toast.custom((t) => (
  <div
    className={`${
      t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
    }  w-full bg-[#333] text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 custom`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <img
            className="h-10 w-10 rounded-full"
            src="/logo.png"
            alt=""
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            Carol's Closet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            To add something to your cart, you have to login first!
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
  </div>
),
  {
    icon: '👏',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  })

      setIsAuthOpen(false);
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
        await fetchCart(user.customer_id);
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
    if (!user) return;

    const item = cart.find(c => c.product_id === productId);
    if (!item) return;

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

  const removeFromCart = async (productId: number) => {
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
        alert(`Order #${orderData.order_id} placed successfully!`);
        setCart([]);
        setIsCheckout(false);
      } else {
        alert(orderData.error || 'Order failed');
      }
    } catch (error: any) {
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
'use client';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  // Add other properties as needed
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
   onCheckout: () => void; // Add this line
  total: number;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

function CartSidebar({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  total 
}: CartSidebarProps) {
  if (!isOpen) return null;
const router = useRouter();

const GotoCheckout = () => {
  try {
    router.push('/checkout'); 
    onClose()
    } catch (error) {
    console.error('Logout error:', error);
  }
};

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end h-full">
        <div className="w-full max-w-[500px] shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content flex flex-col h-full">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">
              Cart View
            </h2>
            <button
              onClick={onClose}
              aria-label="button for close modal"
              className="flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product_id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product_name}</h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, -1)}
                          className="p-1 bg-white rounded hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, 1)}
                          className="p-1 bg-white rounded hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.product_id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between mb-4 text-xl font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 justify-between">
              <Link onClick={onClose}
                href="/cart"
                className="w-full text-center bg-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-dark transition shadow-md"
              >
                View Cart
              </Link>
              <button
                onClick={GotoCheckout}
                className="w-full bg-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-dark transition shadow-md"
              >
                Proceed to Checkout
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;
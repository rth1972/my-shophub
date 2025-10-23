// ============================================
// FILE: components/ProductCard.jsx
// ============================================
'use client';
import { Heart, Tag } from 'lucide-react';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition">
          <Heart className="w-5 h-5 text-pink-600" />
        </button>
        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Only {product.stock_quantity} left!
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Sold Out
          </span>
        )}
        <div className="absolute bottom-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Pre-Loved
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-pink-600 mb-1 font-medium">{product.category_name}</div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.product_name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-pink-600">${product.price}</span>
            <p className="text-xs text-gray-500 mt-1">Gently used condition</p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {product.stock_quantity === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
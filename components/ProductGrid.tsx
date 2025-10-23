// ============================================
// FILE: components/ProductGrid.jsx
// ============================================
'use client';
import ProductCard from './ProductCard';

function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.product_id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
    </section>
  );
}

export default ProductGrid;

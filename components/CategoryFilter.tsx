// ============================================
// FILE: components/CategoryFilter.jsx
// ============================================
'use client';

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Browse by Category</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
              selectedCategory === category
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
// import Image from 'next/image'; // UNCOMMENT in your actual Next.js project
// import { notFound } from 'next/navigation'; // UNCOMMENT in your actual Next.js project
import ProductItem from '@/components/Common/ProductItem'; 
import Breadcrumb from "@/components/Common/Breadcrumb";
// NOTE: These Next.js imports are commented out for successful compilation in this environment.

// 1. Define the type for a Category
interface Category {
  category_id: string; 
  category_name: string;
  image: string | null;
  description: string | null;
}

// 2. Define the Product type (simplified)
interface Product {
  product_id: string;
  name: string;
  // Add other product fields as necessary
}

// Helper to determine the base URL for server-side fetching
function getBaseUrl(): string {
  // Use VERCEL_URL (for Vercel deployment) or fall back to localhost
  // Ensure NEXT_PUBLIC_BASE_URL is set in .env or config if using a custom local port
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006';
}

/**
 * Fetches the category data from the internal API route.
 */
async function getCategory(id: string): Promise<Category | null> {
  const host = getBaseUrl();
    
  try {
    const res = await fetch(`${host}/api/categories/${id}`, {
      cache: 'no-store', // Ensures fresh data
    });

    if (!res.ok) {
      // Handles 404 or other fetch errors gracefully
      if (res.status !== 404) {
        console.error(`Fetch failed with status: ${res.status}`);
      }
      return null;
    }

    const data = await res.json();
    return data.category as Category; 
  } catch (error) {
    console.error(`Error fetching category (ID: ${id}):`, error);
    return null;
  }
}

/**
 * Fetches products for this category from the internal API route.
 */
async function getCategoryProducts(id: string): Promise<Product[]> {
  const host = getBaseUrl();

  try {
    // Correctly interpolate the ID into the URL path
    const res = await fetch(`${host}/api/categories/${id}/products`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error(`Products fetch failed with status: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return data.products || []; // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Next.js Category Page component (Server Component).
 * Uses explicit promise resolution for params to avoid the "sync-dynamic-apis" warning.
 */
export default async function CategoryPage({ params }: { params: { id: string } }){
  // Explicitly resolve params in an async context to satisfy the Next.js runtime check
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  // Fetch data concurrently
  const [category, products] = await Promise.all([
    getCategory(id),
    getCategoryProducts(id),
  ]);
  
  // Use the Next.js standard notFound() helper for 404
  if (!category) {
    // notFound(); // UNCOMMENT in your actual Next.js project
    return (
        <div className="max-w-[1170px] mx-auto px-4 py-12 bg-white min-h-screen font-sans text-center">
            <h1 className="text-4xl font-bold text-red-600">404 - Category Not Found</h1>
            <p className="mt-4 text-gray-600">The category with ID "{id}" could not be located.</p>
        </div>
    );
  }

  // Fallback for if products fetching failed, but category exists
  if (!products) {
    // notFound(); // UNCOMMENT in your actual Next.js project
    return (
        <div className="max-w-[1170px] mx-auto px-4 py-12 bg-white min-h-screen font-sans text-center">
            <h1 className="text-4xl font-bold text-yellow-600">Products Unavailable</h1>
            <p className="mt-4 text-gray-600">Products for this category with ID "{id}" could not be loaded.</p>
        </div>
    );
  }

  // --- Rendering UI ---
  return (
      <>
                  <Breadcrumb title={"Category"} pages={["Category / ", category.category_name]} />
    <div className="max-w-[1170px] mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-pink-50 to-purple-50 rounded-full mb-6">
          {/* Use standard img tag as a placeholder for the commented-out Image component */}
          {category.image && (
            <img
              src={`/images/categories/${category.image}`}
              alt={category.category_name}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.category_name}
        </h1>
        {category.description && (
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No products found in this category yet.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* The ProductItem component is assumed to exist and take an 'item' prop */}
            {products.map((product: any) => (
              <ProductItem key={product.product_id} item={product} />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  )
}

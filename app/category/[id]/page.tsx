// UNCOMMENT these in your actual Next.js project
// import Image from 'next/image';
import { notFound } from 'next/navigation';

import ProductItem from '@/components/Common/ProductItem';
import Breadcrumb from '@/components/Common/Breadcrumb';

interface Category {
  category_id: string;
  category_name: string;
  image: string | null;
  description: string | null;
}

interface Product {
  product_id: string;
  name: string;
  // Add other product fields as needed
}

function getBaseUrl(): string {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006';
}

async function getCategory(id: string): Promise<Category | null> {
  const host = getBaseUrl();

  try {
    const res = await fetch(`${host}/api/categories/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
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

async function getCategoryProducts(id: string): Promise<Product[]> {
  const host = getBaseUrl();

  try {
    const res = await fetch(`${host}/api/categories/${id}/products`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Products fetch failed with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [category, products] = await Promise.all([
    getCategory(id),
    getCategoryProducts(id),
  ]);

  if (!category) {
    notFound(); // Use Next.js built-in 404
  }

  return (
    <>
      <Breadcrumb title="Category" pages={['Category / ', category.category_name]} />
      <div className="max-w-[1170px] mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-pink-50 to-purple-50 rounded-full mb-6">
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
              {products.map((product: Product) => (
                <ProductItem key={product.product_id} item={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

'use client';

import { SectionHeader } from './SectionHeader';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks';

export const OurProducts = () => {
  const { data: products, isLoading, error } = useProducts({
    limit: 8,
  });

  if (isLoading) {
    return (
      <section className="w-full max-w-[1170px] mx-auto py-16">
        <SectionHeader badge="Our Products" title="Explore Our Products" showArrows />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-full h-[350px] bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[1170px] mx-auto py-16">
      <SectionHeader badge="Our Products" title="Explore Our Products" showArrows />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <button className="bg-[#DB4444] text-white px-12 py-3 rounded hover:bg-[#c03939] transition-colors">
          View All Products
        </button>
      </div>
    </section>
  );
};



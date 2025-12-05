'use client';

import { SectionHeader } from './SectionHeader';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks';

export const BestSelling = () => {
  const { data: products, isLoading, error } = useProducts({
    bestSelling: true,
    limit: 4,
  });

  if (isLoading) {
    return (
      <section className="w-full max-w-[1170px] mx-auto py-16">
        <SectionHeader
          badge="This Month"
          title="Best Selling Products"
          actionButton={
            <button className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-[#c03939] transition-colors">
              View All
            </button>
          }
        />
        <div className="mt-10 flex gap-[30px] overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[270px] h-[350px] bg-gray-100 rounded animate-pulse" />
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
      <SectionHeader
        badge="This Month"
        title="Best Selling Products"
        actionButton={
          <button className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-[#c03939] transition-colors">
            View All
          </button>
        }
      />
      <div className="mt-10 flex gap-[30px] overflow-x-auto pb-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};



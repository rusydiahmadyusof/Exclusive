'use client';

import { SectionHeader } from './SectionHeader';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks';

export const FlashSales = () => {
  const { data: products, isLoading, error } = useProducts({
    flashSale: true,
    limit: 4,
  });

  if (isLoading) {
    return (
      <section className="w-full max-w-[1170px] mx-auto py-16">
        <SectionHeader badge="Today's" title="Flash Sales" showArrows />
        <div className="mt-12 flex gap-[30px] overflow-x-auto pb-4">
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
      <SectionHeader badge="Today's" title="Flash Sales" showArrows />
      <div className="mt-8 sm:mt-12 flex gap-4 sm:gap-[30px] overflow-x-auto pb-4 scrollbar-hide">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[270px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};



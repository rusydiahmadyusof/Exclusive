'use client';

import { SectionHeader } from './SectionHeader';
import { CategoryCard } from './CategoryCard';
import { useCategories } from '@/hooks';

export const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="w-full max-w-[1170px] mx-auto py-16">
        <SectionHeader badge="Categories" title="Browse By Category" showArrows={false} />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-[200px] sm:h-[220px] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Map category icons (you can customize this based on your category names)
  const getCategoryIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('phone')) return '📱';
    if (nameLower.includes('computer') || nameLower.includes('laptop')) return '💻';
    if (nameLower.includes('watch')) return '⌚';
    if (nameLower.includes('camera')) return '📷';
    if (nameLower.includes('headphone') || nameLower.includes('audio')) return '🎧';
    if (nameLower.includes('game')) return '🎮';
    return '📦';
  };

  // Limit to 6 categories for better visual balance
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="w-full max-w-[1170px] mx-auto py-16">
      <SectionHeader badge="Categories" title="Browse By Category" showArrows={false} />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayCategories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={getCategoryIcon(category.name)}
            label={category.name}
            href={`/?category=${category.id}`}
          />
        ))}
      </div>
    </section>
  );
};



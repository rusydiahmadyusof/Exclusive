'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Category {
  name: string;
  hasDropdown?: boolean;
  subcategories?: string[];
}

export const CategorySidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories: Category[] = [
    {
      name: "Woman's Fashion",
      hasDropdown: true,
      subcategories: [
        'Dresses',
        'Tops & Blouses',
        'Pants & Jeans',
        'Skirts',
        'Jackets & Coats',
        'Shoes',
        'Accessories',
      ],
    },
    {
      name: "Men's Fashion",
      hasDropdown: true,
      subcategories: [
        'Shirts',
        'T-Shirts',
        'Pants & Jeans',
        'Jackets & Coats',
        'Shoes',
        'Accessories',
        'Watches',
      ],
    },
    { name: 'Electronics' },
    { name: 'Home & Lifestyle' },
    { name: 'Medicine' },
    { name: 'Sports & Outdoor' },
    { name: "Baby's & Toys" },
    { name: 'Groceries & Pets' },
    { name: 'Health & Beauty' },
  ];

  const handleMouseEnter = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (category?.hasDropdown) {
      setOpenDropdown(categoryName);
    }
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="relative w-[217px] h-[344px]">
      <div className="flex flex-col gap-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between cursor-pointer hover:text-[#DB4444] transition-colors"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-base font-normal leading-6 text-black hover:text-[#DB4444] transition-colors"
            >
              {category.name}
            </Link>
            {category.hasDropdown && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${
                  openDropdown === category.name ? 'rotate-180' : ''
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
            {openDropdown === category.name && category.subcategories && (
              <div className="absolute left-full top-0 ml-2 w-[200px] bg-white border border-gray-200 rounded-[4px] shadow-lg z-50 py-2">
                {category.subcategories.map((subcategory, subIndex) => (
                  <Link
                    key={subIndex}
                    href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2 text-base font-normal leading-6 text-black hover:bg-gray-50 hover:text-[#DB4444] transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};



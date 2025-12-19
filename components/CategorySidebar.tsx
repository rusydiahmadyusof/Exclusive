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

  const handleToggleDropdown = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (category?.hasDropdown) {
      setOpenDropdown(openDropdown === categoryName ? null : categoryName);
    }
  };

  return (
    <div className="relative w-full lg:w-[217px] min-h-[200px] lg:h-[344px] hidden lg:block">
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between cursor-pointer hover:text-[#DB4444] transition-colors"
          >
            <Link
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm sm:text-base font-normal leading-6 text-black hover:text-[#DB4444] transition-colors flex-1"
            >
              {category.name}
            </Link>
            {category.hasDropdown && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleDropdown(category.name);
                }}
                className="flex items-center justify-center hover:text-[#DB4444] transition-colors"
                aria-label={`Toggle ${category.name} menu`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform sm:w-6 sm:h-6 ${
                    openDropdown === category.name ? 'rotate-180' : ''
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
            {openDropdown === category.name && category.subcategories && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-[4px] shadow-lg z-50 py-2">
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



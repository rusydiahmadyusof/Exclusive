'use client';

import Image from 'next/image';
import { useState } from 'react';

interface WishlistProductCardProps {
  image: string;
  title: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviews?: number;
  onRemove?: () => void;
  onAddToCart?: () => void;
}

export const WishlistProductCard = ({
  image,
  title,
  currentPrice,
  originalPrice,
  discount,
  rating,
  reviews,
  onRemove,
  onAddToCart,
}: WishlistProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col gap-4 w-[270px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#F5F5F5] h-[250px] rounded relative overflow-hidden group">
        {discount && (
          <div className="absolute top-3 left-3 bg-[#DB4444] px-3 py-1 rounded z-10">
            <p className="text-white text-xs font-normal leading-[18px]">-{discount}%</p>
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 z-10 transition-colors"
          aria-label="Remove from wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[190px] h-[180px] relative">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-black h-[41px] rounded-b flex items-center justify-center gap-2 z-10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <button
              onClick={onAddToCart}
              className="text-white text-xs font-normal leading-[18px]"
            >
              Add To Cart
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium leading-6 text-black">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-base font-medium leading-6 text-[#DB4444]">
            RM {currentPrice}
          </span>
          {originalPrice && (
            <span className="text-base font-medium leading-6 text-black line-through opacity-50">
              RM {originalPrice}
            </span>
          )}
        </div>
        {rating !== undefined && reviews !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={i < rating ? '#FFAD33' : 'none'}
                  stroke="#FFAD33"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold leading-[21px] text-black opacity-50">
              ({reviews})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


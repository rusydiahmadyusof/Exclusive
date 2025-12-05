'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types/database';
import { useAddToCart } from '@/hooks';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlist?.some((item) => item.product_id === product.id) || false;
  const wishlistItem = wishlist?.find((item) => item.product_id === product.id);

  const image = product.image_url || product.images?.[0] || '/images/placeholder.png';
  const title = product.name;
  const currentPrice = product.price.toString();
  const originalPrice = product.original_price?.toString();
  const discount = product.flash_sale_discount
    ? product.flash_sale_discount.toString()
    : product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100).toString()
    : undefined;
  const rating = Math.round(product.rating);
  const reviews = product.reviews_count;
  const isNew = product.is_new_arrival;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart.mutateAsync({ product_id: product.id, quantity: 1 });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist.mutateAsync(wishlistItem.id);
      } else {
        await addToWishlist.mutateAsync(product.id);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };
  return (
    <Link href={`/product/${product.id}`} className="flex flex-col gap-4 w-[270px]">
      <div className="bg-[#F5F5F5] h-[250px] rounded relative overflow-hidden group">
        {discount && (
          <div className="absolute top-3 left-3 bg-[#DB4444] px-3 py-1 rounded z-10">
            <p className="text-white text-xs font-normal leading-[18px]">
              -{discount}%
            </p>
          </div>
        )}
        {isNew && !discount && (
          <div className="absolute top-3 left-3 bg-[#00FF66] px-3 py-1 rounded z-10">
            <p className="text-white text-xs font-normal leading-[18px]">NEW</p>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleWishlistToggle}
            className={`w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors ${
              isInWishlist ? 'text-red-500' : ''
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isInWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || addToCart.isPending}
            className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Add to cart"
          >
            {isAdding || addToCart.isPending ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
          </button>
        </div>
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
      </div>
    </Link>
  );
};



'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProduct, useProducts, useAddToCart, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(params.id);
  const { data: relatedProducts } = useProducts({ category: product?.category_id || undefined, limit: 4 });
  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : product?.image_url
    ? [product.image_url]
    : ['/images/placeholder.png'];

  const colors = ['#00FF66', '#DB4444'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const isInWishlist = wishlist?.some((item) => item.product_id === product?.id) || false;
  const wishlistItem = wishlist?.find((item) => item.product_id === product?.id);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart.mutateAsync({ product_id: product.id, quantity });
      router.push('/checkout');
    } catch (error) {
      // Error handling is done by React Query mutations
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart.mutateAsync({ product_id: product.id, quantity });
    } catch (error) {
      // Error handling is done by React Query mutations
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist.mutateAsync(wishlistItem.id);
      } else {
        await addToWishlist.mutateAsync(product.id);
      }
    } catch (error) {
      // Error handling is done by React Query mutations
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl font-medium text-gray-600">Product not found</p>
            <Link href="/" className="text-[#DB4444] hover:underline mt-4 inline-block">
              Return to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <TopHeader />
      <div className="border-b border-gray-200" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
        <Header />
      </div>
      <div className="border-b border-gray-200" />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
          >
            Account
          </Link>
          <svg
            width="6"
            height="12"
            viewBox="0 0 6 12"
            fill="none"
            className="opacity-50"
          >
            <path
              d="M1 1L5 6L1 11"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Link
            href="/products?category=gaming"
            className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
          >
            Gaming
          </Link>
          <svg
            width="6"
            height="12"
            viewBox="0 0 6 12"
            fill="none"
            className="opacity-50"
          >
            <path
              d="M1 1L5 6L1 11"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-normal leading-[21px] text-black">
            Havic HV G-92 Gamepad
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
        <div className="max-w-[1170px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-[30px]">
          {/* Left Column - Product Images */}
          <div className="flex flex-row lg:flex-row gap-3 sm:gap-4 lg:gap-5">
            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-4 order-2 lg:order-1">
              {productImages.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-[#F5F5F5] h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] lg:h-[138px] lg:w-[170px] rounded relative overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'ring-2 ring-[#DB4444]' : ''
                  } transition-all`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`Product view ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="bg-[#F5F5F5] h-[300px] sm:h-[400px] lg:h-[600px] w-full lg:w-[500px] rounded relative overflow-hidden order-1 lg:order-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={productImages[selectedImage] || productImages[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight sm:leading-6 tracking-[0.5px] sm:tracking-[0.72px] text-black">
              {product.name}
            </h1>

            {/* Rating and Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(product.rating) ? '#FFAD33' : 'none'}
                    stroke="#FFAD33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span className="text-sm font-normal leading-[21px] text-black opacity-50">
                  ({product.reviews_count} Reviews)
                </span>
              </div>
              <div className="h-4 w-px bg-black opacity-50" />
              <span className={`text-sm font-normal leading-[21px] ${product.stock > 0 ? 'text-[#00FF66]' : 'text-red-500'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-2xl font-normal leading-6 tracking-[0.72px] text-black">
                RM {product.price.toFixed(2)}
              </p>
              {product.original_price && product.original_price > product.price && (
                <p className="text-xl font-normal leading-6 text-black line-through opacity-50">
                  RM {product.original_price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm font-normal leading-[21px] text-black w-[373px]">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-black/50 opacity-50 w-[400px]" />

            {/* Colors */}
            <div className="flex items-center gap-6">
              <p className="text-xl font-normal leading-5 tracking-[0.6px] text-black">
                Colours:
              </p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-5 h-5 rounded-full ${
                      selectedColor === index ? 'ring-2 ring-black' : ''
                    } transition-all`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color option ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="flex items-center gap-6">
              <p className="text-xl font-normal leading-5 tracking-[0.6px] text-black">Size:</p>
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium leading-[21px] transition-colors ${
                      selectedSize === size
                        ? 'bg-[#DB4444] text-white'
                        : 'border border-black/50 text-black hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-black/50 rounded overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-11 border-r border-black/50 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <div className="w-20 h-11 flex items-center justify-center border-r border-black/50">
                  <span className="text-xl font-medium leading-[28px] text-black">{quantity}</span>
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-[41px] h-11 bg-[#DB4444] flex items-center justify-center hover:bg-[#c03939] transition-colors"
                  aria-label="Increase quantity"
                >
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
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={addToCart.isPending || product.stock === 0}
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-[10px] rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addToCart.isPending ? 'Adding...' : 'Buy Now'}
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending || product.stock === 0}
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-8 py-[10px] rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                className={`w-10 h-10 border border-black/50 rounded flex items-center justify-center hover:bg-gray-50 transition-colors ${
                  isInWishlist ? 'text-red-500' : ''
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  width="24"
                  height="24"
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
            </div>

            {/* Delivery Information */}
            <div className="border border-black/50 rounded p-4 w-[399px] flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 3h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium leading-6 text-black">Free Delivery</p>
                  <button className="text-xs font-medium leading-[18px] text-black underline text-left">
                    Enter your postal code for Delivery Availability
                  </button>
                </div>
              </div>

              <div className="border-t border-black/50 opacity-50" />

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium leading-6 text-black">Return Delivery</p>
                  <p className="text-xs font-medium leading-[18px] text-black">
                    Free 30 Days Delivery Returns.{' '}
                    <button className="underline">Details</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex flex-col gap-[60px]">
          <div className="flex items-center gap-4">
            <div className="w-5 h-10 bg-[#DB4444] rounded" />
            <h2 className="text-base font-semibold leading-5 text-[#DB4444]">Related Item</h2>
          </div>
          <div className="flex gap-[30px] flex-wrap">
            {relatedProducts
              ?.filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


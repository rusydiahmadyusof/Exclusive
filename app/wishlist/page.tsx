'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WishlistProductCard } from '@/components/WishlistProductCard';
import { ProductCard } from '@/components/ProductCard';
import { useWishlist, useRemoveFromWishlist } from '@/hooks';
import { useAddToCart } from '@/hooks';
import { useProducts } from '@/hooks';

export default function Wishlist() {
  const { data: wishlistItems, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const { data: justForYouProducts } = useProducts({ limit: 4 });

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      await removeFromWishlist.mutateAsync(id);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart.mutateAsync({ product_id: productId, quantity: 1 });
    } catch (error) {
      // Silent error handling
    }
  };

  const handleMoveAllToBag = async () => {
    if (!wishlistItems) return;
    for (const item of wishlistItems) {
      try {
        await addToCart.mutateAsync({ product_id: item.product_id, quantity: 1 });
      } catch (error) {
        // Silent error handling
      }
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
          <Header />
        </div>
        <div className="border-b border-gray-200" />

        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 max-w-[1170px] mx-auto">
            {/* Wishlist Section */}
            <div className="flex flex-col gap-[60px]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-normal leading-[26px] text-black">
                  Wishlist ({wishlistItems?.length || 0})
                </h2>
                {wishlistItems && wishlistItems.length > 0 && (
                  <button
                    onClick={handleMoveAllToBag}
                    disabled={addToCart.isPending}
                    className="border border-black/50 rounded px-12 py-4 text-base font-medium leading-6 text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {addToCart.isPending ? 'Adding...' : 'Move All To Bag'}
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
                </div>
              ) : !wishlistItems || wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <p className="text-xl font-medium text-gray-600">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="flex gap-[30px] flex-wrap">
                  {wishlistItems.map((item) => {
                    if (!item.product) return null;
                    const product = item.product;
                    const image = product.image_url || product.images?.[0] || '/images/placeholder.png';
                    const currentPrice = product.price.toString();
                    const originalPrice = product.original_price?.toString();
                    const discount = product.flash_sale_discount
                      ? product.flash_sale_discount.toString()
                      : product.original_price
                      ? Math.round(((product.original_price - product.price) / product.original_price) * 100).toString()
                      : undefined;

                    return (
                      <WishlistProductCard
                        key={item.id}
                        image={image}
                        title={product.name}
                        currentPrice={currentPrice}
                        originalPrice={originalPrice}
                        discount={discount}
                        rating={Math.round(product.rating)}
                        reviews={product.reviews_count}
                        onRemove={() => handleRemoveFromWishlist(item.id)}
                        onAddToCart={() => handleAddToCart(product.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Just For You Section */}
            {justForYouProducts && justForYouProducts.length > 0 && (
              <div className="flex flex-col gap-[60px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-10 bg-[#DB4444] rounded" />
                    <h2 className="text-xl font-normal leading-[26px] text-black">
                      Just For You
                    </h2>
                  </div>
                  <button className="border border-black/50 rounded px-12 py-4 text-base font-medium leading-6 text-black hover:bg-gray-50 transition-colors">
                    See All
                  </button>
                </div>
                <div className="flex gap-[30px] flex-wrap">
                  {justForYouProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}


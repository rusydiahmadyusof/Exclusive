'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartItem } from '@/components/CartItem';
import { CartTotal } from '@/components/CartTotal';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks';

export default function Cart() {
  const router = useRouter();
  const { data: cartItems, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemove(id);
      return;
    }
    try {
      await updateCartItem.mutateAsync({ id, quantity: newQuantity });
    } catch (error) {
      // Silent error handling
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart.mutateAsync(id);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleApplyCoupon = () => {
    // Coupon functionality not yet implemented
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const subtotal =
    cartItems?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <ProtectedRoute>
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
              href="/"
              className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
            >
              Home
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
            <span className="text-sm font-normal leading-[21px] text-black">Cart</span>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1170px] mx-auto flex flex-col gap-8 sm:gap-12 lg:gap-20">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <p className="text-xl font-medium text-gray-600">Your cart is empty</p>
                <Link
                  href="/"
                  className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-[#c03939] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items Section */}
                <div className="flex flex-col gap-10">
                  {/* Table Header */}
                  <div className="bg-white h-[72px] rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] flex items-center px-10">
                    <div className="flex items-center gap-[284px] flex-1">
                      <p className="text-base font-normal leading-6 text-black">Product</p>
                      <p className="text-base font-normal leading-6 text-black">Price</p>
                      <p className="text-base font-normal leading-6 text-black">Quantity</p>
                      <p className="text-base font-normal leading-6 text-black">Subtotal</p>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="flex flex-col gap-10">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        image={item.product?.image_url || '/images/placeholder.png'}
                        name={item.product?.name || 'Product'}
                        price={item.product?.price || 0}
                        quantity={item.quantity}
                        onQuantityChange={(newQuantity) =>
                          handleQuantityChange(item.id, newQuantity)
                        }
                        onRemove={() => handleRemove(item.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-start">
                  <Link
                    href="/"
                    className="border border-black/50 rounded px-12 py-4 text-base font-medium leading-6 text-black hover:bg-gray-50 transition-colors"
                  >
                    Return To Shop
                  </Link>
                  <button
                    onClick={() => {}}
                    className="border border-black/50 rounded px-12 py-4 text-base font-medium leading-6 text-black hover:bg-gray-50 transition-colors"
                  >
                    Update Cart
                  </button>
                </div>

                {/* Coupon and Cart Total Section */}
                <div className="flex gap-[173px] items-start">
                  {/* Coupon Section */}
                  <div className="flex gap-4 items-end">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="border border-black rounded h-14 px-6 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:border-[#DB4444] transition-colors w-[300px]"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors h-14"
                    >
                      Apply Coupon
                    </button>
                  </div>

                  {/* Cart Total */}
                  <CartTotal subtotal={subtotal} onCheckout={handleCheckout} />
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}


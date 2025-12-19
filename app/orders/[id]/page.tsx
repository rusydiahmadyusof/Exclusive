'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';
import { useOrder } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-white">
          <TopHeader />
          <div className="border-b border-gray-200" />
          <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
            <Header />
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-xl font-medium text-gray-600 mb-4">
                {error?.message || 'Order not found'}
              </p>
              <Link href="/account/orders" className="text-[#DB4444] hover:underline">
                View Order History
              </Link>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

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
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="opacity-50">
              <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Link
              href="/account/orders"
              className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
            >
              Orders
            </Link>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="opacity-50">
              <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-normal leading-[21px] text-black">Order Confirmation</span>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1170px] mx-auto">
            {/* Success Message */}
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-medium text-green-800 mb-1">Order Confirmed!</h1>
                  <p className="text-green-600">Thank you for your purchase. Your order has been received.</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-black">Order Details</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-lg font-medium text-black">{order.order_number || order.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Order Date</p>
                  <p className="text-base font-medium text-black">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                  <p className="text-base font-medium text-black capitalize">
                    {order.payment_method || 'Cash on delivery'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <p className="text-base font-medium text-[#DB4444] capitalize">
                    {order.status || 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-[#DB4444]">${order.total?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-black mb-4">Order Items</h3>
                <div className="space-y-4">
                  {(order.items || (order as any).order_items)?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-20 h-20 relative shrink-0">
                        <Image
                          src={item.product_image_url || '/images/placeholder.png'}
                          alt={item.product_name || 'Product'}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium text-black">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-base font-medium text-black">
                        RM {((item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-base text-black">
                    <span>Subtotal:</span>
                    <span>RM {order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-base text-black">
                    <span>Shipping:</span>
                    <span>RM {order.shipping?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Discount:</span>
                      <span>-RM {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-[#DB4444] pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span>RM {order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/account/orders"
                className="bg-white border-2 border-[#DB4444] text-[#DB4444] text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#DB4444] hover:text-white transition-colors"
              >
                View Order History
              </Link>
              <Link
                href="/"
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}


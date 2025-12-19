'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';
import { useOrders } from '@/hooks';

export default function OrderHistory() {
  const { data: orders, isLoading } = useOrders();

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
              href="/account"
              className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
            >
              My Account
            </Link>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="opacity-50">
              <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-normal leading-[21px] text-black">Order History</span>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1170px] mx-auto">
            <h1 className="text-xl sm:text-2xl font-medium text-black mb-6 sm:mb-8">Order History</h1>

            {orders && orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-6"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="text-lg font-medium text-black">{order.order_number || order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="text-base font-medium text-black">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-base font-medium text-[#DB4444] capitalize">
                          {order.status || 'Pending'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-[#DB4444]">
                          RM {order.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mb-4">
                        <div className="flex gap-4 overflow-x-auto">
                          {order.order_items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 shrink-0">
                              <div className="w-16 h-16 relative">
                                <Image
                                  src={item.product_image_url || '/images/placeholder.png'}
                                  alt={item.product_name || 'Product'}
                                  fill
                                  className="object-contain rounded"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-black">{item.product_name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="flex items-center text-sm text-gray-600">
                              +{order.order_items.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-[#DB4444] text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link
                  href="/"
                  className="bg-[#DB4444] text-white text-base font-medium leading-6 px-6 py-3 rounded hover:bg-[#c03939] transition-colors inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}


'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout';
import { useCart, useCreateOrder, useAddresses, useCreateAddress } from '@/hooks';

export default function Checkout() {
  const router = useRouter();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: addresses } = useAddresses();
  const createOrder = useCreateOrder();
  const createAddress = useCreateAddress();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cash',
      saveInfo: true,
    },
  });

  const paymentMethod = watch('paymentMethod');

  const subtotal =
    cartItems?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('Invalid coupon code');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cartItems || cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    try {
      let addressId: string | undefined = undefined;

      // If using saved address
      if (!useNewAddress && selectedAddressId) {
        addressId = selectedAddressId;
      } else if (useNewAddress && data.saveInfo) {
        // Save new address if "save info" is checked
        try {
          const addressResult = await createAddress.mutateAsync({
            firstName: data.firstName,
            lastName: data.lastName,
            companyName: data.companyName,
            streetAddress: data.streetAddress,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            postcode: data.postcode,
            phoneNumber: data.phoneNumber,
            emailAddress: data.emailAddress,
            isDefault: false,
          });
          addressId = addressResult.address.id;
        } catch (error) {
          // Continue with order even if address save fails
          // Error is handled silently to not expose sensitive information
        }
      }

      // Prepare order items
      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product?.name || 'Product',
        product_image_url: item.product?.image_url || null,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      // Create order
      const result = await createOrder.mutateAsync({
        items,
        shipping_address_id: addressId,
        payment_method: data.paymentMethod,
        coupon_code: couponCode || undefined,
        subtotal,
        shipping,
        discount,
        total,
      });

      // Redirect to order confirmation
      router.push(`/orders/${result.order.id}`);
    } catch (error) {
      // Error handling is done by React Query mutations
    }
  };

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-[135px] py-6">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
        </div>
      </main>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-[135px] py-6">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl font-medium text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/cart" className="text-[#DB4444] hover:underline">
              Go to cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white">
        <TopHeader />
        <div className="border-b border-gray-200" />
        <div className="px-[135px] py-6">
          <Header />
        </div>
        <div className="border-b border-gray-200" />

      {/* Breadcrumb */}
      <div className="px-[135px] py-4">
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
            href="/account"
            className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
          >
            My Account
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
            href="/product"
            className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
          >
            Product
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
            href="/cart"
            className="text-sm font-normal leading-[21px] text-black opacity-50 hover:opacity-100 transition-opacity"
          >
            View Cart
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
          <span className="text-sm font-normal leading-[21px] text-black">CheckOut</span>
        </div>
      </div>

      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex gap-[173px] items-start">
          {/* Left Column - Billing Details */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-[36px] font-medium leading-[30px] tracking-[1.44px] text-black mb-6">
              Billing Details
            </h1>

            {/* Saved Addresses Selection */}
            {addresses && addresses.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="radio"
                    id="useSaved"
                    checked={!useNewAddress}
                    onChange={() => {
                      setUseNewAddress(false);
                      const defaultAddress = addresses.find((a: any) => a.is_default) || addresses[0];
                      if (defaultAddress) setSelectedAddressId(defaultAddress.id);
                    }}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor="useSaved" className="text-base font-medium text-black cursor-pointer">
                    Use Saved Address
                  </label>
                </div>
                {!useNewAddress && (
                  <div className="ml-9 space-y-3">
                    {addresses.map((address: any) => (
                      <div
                        key={address.id}
                        className={`p-4 border-2 rounded cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-[#DB4444] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="mt-1 w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-black">
                                {address.first_name} {address.last_name}
                              </p>
                              {address.is_default && (
                                <span className="text-xs bg-[#DB4444] text-white px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.street_address}</p>
                            {address.apartment && <p className="text-sm text-gray-600">{address.apartment}</p>}
                            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postcode}</p>
                            <p className="text-sm text-gray-600">{address.phone_number}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <input
                    type="radio"
                    id="useNew"
                    checked={useNewAddress}
                    onChange={() => {
                      setUseNewAddress(true);
                      setSelectedAddressId(null);
                    }}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor="useNew" className="text-base font-medium text-black cursor-pointer">
                    Use New Address
                  </label>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              {/* Address Form - Only show if using new address or no saved addresses */}
              {(useNewAddress || !addresses || addresses.length === 0) && (
                <>
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  First Name<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.firstName ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Last Name<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.lastName ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Company Name
                </label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors"
                />
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Street Address<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="text"
                  {...register('streetAddress')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.streetAddress ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.streetAddress && (
                  <p className="text-sm text-red-600">{errors.streetAddress.message}</p>
                )}
              </div>

              {/* Apartment */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Apartment, floor, etc. (optional)
                </label>
                <input
                  type="text"
                  {...register('apartment')}
                  className="bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors"
                />
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  City<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.city ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  State<span className="text-[#DB4444]">*</span>
                </label>
                <select
                  {...register('state')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.state ? 'border-2 border-red-500' : ''
                  }`}
                >
                  <option value="">Select State</option>
                  <option value="Johor">Johor</option>
                  <option value="Kedah">Kedah</option>
                  <option value="Kelantan">Kelantan</option>
                  <option value="Kuala Lumpur">Kuala Lumpur</option>
                  <option value="Labuan">Labuan</option>
                  <option value="Malacca">Malacca</option>
                  <option value="Negeri Sembilan">Negeri Sembilan</option>
                  <option value="Pahang">Pahang</option>
                  <option value="Penang">Penang</option>
                  <option value="Perak">Perak</option>
                  <option value="Perlis">Perlis</option>
                  <option value="Putrajaya">Putrajaya</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Sarawak">Sarawak</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Terengganu">Terengganu</option>
                </select>
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              {/* Postcode */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Postcode<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="text"
                  {...register('postcode')}
                  maxLength={5}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.postcode ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="e.g., 50000"
                />
                {errors.postcode && (
                  <p className="text-sm text-red-600">{errors.postcode.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Phone Number<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.phoneNumber ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-black opacity-40">
                  Email Address<span className="text-[#DB4444]">*</span>
                </label>
                <input
                  type="email"
                  {...register('emailAddress')}
                  className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                    errors.emailAddress ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.emailAddress && (
                  <p className="text-sm text-red-600">{errors.emailAddress.message}</p>
                )}
              </div>

              {/* Save Info Checkbox */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  {...register('saveInfo')}
                  id="saveInfo"
                  className="w-6 h-6 rounded border-2 border-[#DB4444] bg-[#DB4444] checked:bg-[#DB4444] cursor-pointer"
                />
                <label
                  htmlFor="saveInfo"
                  className="text-base font-normal leading-6 text-black cursor-pointer"
                >
                  Save this information for faster check-out next time
                </label>
              </div>
              </>
              )}
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-[470px] flex flex-col gap-8">
            {/* Order Items */}
            <div className="flex flex-col gap-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-[54px] h-[54px] relative shrink-0">
                    <Image
                      src={item.product?.image_url || '/images/placeholder.png'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between flex-1 gap-[210px]">
                    <p className="text-base font-normal leading-6 text-black">
                      {item.product?.name || 'Product'} x{item.quantity}
                    </p>
                    <p className="text-base font-normal leading-6 text-black">
                      RM {((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-base font-normal leading-6 text-black">Subtotal:</p>
                  <p className="text-base font-normal leading-6 text-black">RM {subtotal.toFixed(2)}</p>
                </div>
                <div className="border-t border-black/40 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base font-normal leading-6 text-black">Shipping:</p>
                    <p className="text-base font-normal leading-6 text-black">Free</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/40 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-base font-normal leading-6 text-black">Total:</p>
                  <p className="text-base font-normal leading-6 text-black">RM {total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-[155px]">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    id="bank"
                    value="bank"
                    className="w-6 h-6 cursor-pointer"
                  />
                  <label
                    htmlFor="bank"
                    className="text-base font-normal leading-6 text-black cursor-pointer"
                  >
                    Bank
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[42px] h-[28px] relative">
                    <Image
                      src="/images/cfb0a6ee01b240273b40dab07f8246ef98aed88a.png"
                      alt="Bkash"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-[42px] h-[28px] relative">
                    <Image
                      src="/images/cfb0a6ee01b240273b40dab07f8246ef98aed88a.png"
                      alt="Visa"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-[42px] h-[28px] relative">
                    <Image
                      src="/images/6eefb61d27c754abac218d25d8ea4360de61f8e8.png"
                      alt="Mastercard"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-[42px] h-[28px] relative">
                    <Image
                      src="/images/b28e31b9c88d0c9b038b82deeb0523d82cffe267.png"
                      alt="Nagad"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  id="cash"
                  value="cash"
                  className="w-6 h-6 cursor-pointer"
                />
                <label
                  htmlFor="cash"
                  className="text-base font-normal leading-6 text-black cursor-pointer"
                >
                  Cash on delivery
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Coupon Code */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border border-black rounded h-14 px-6 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:border-[#DB4444] transition-colors w-full"
                />
                {couponError && (
                  <p className="text-sm text-red-600">{couponError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors h-14"
              >
                Apply Coupon
              </button>
              <input type="hidden" {...register('couponCode')} value={couponCode} />
            </div>

            {/* Place Order Button - Submit button for the form */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={createOrder.isPending}
              className="bg-[#DB4444] text-white text-base font-medium leading-6 py-4 rounded hover:bg-[#c03939] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
    </ProtectedRoute>
  );
}


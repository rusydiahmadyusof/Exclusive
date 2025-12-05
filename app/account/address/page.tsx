'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountAddressSchema, type AccountAddressFormData } from '@/lib/validations/account';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks';

export default function AddressBook() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<AccountAddressFormData>({
    resolver: zodResolver(accountAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      postcode: '',
      phoneNumber: '',
      emailAddress: '',
      isDefault: false,
    },
  });

  const handleEdit = (address: any) => {
    setEditingId(address.id);
    form.reset({
      firstName: address.first_name,
      lastName: address.last_name,
      companyName: address.company_name || '',
      streetAddress: address.street_address,
      apartment: address.apartment || '',
      city: address.city || address.town_city || '',
      state: address.state || '',
      postcode: address.postcode || '',
      phoneNumber: address.phone_number,
      emailAddress: address.email_address,
      isDefault: address.is_default,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setErrorMessage(null);
      await deleteAddress.mutateAsync(id);
      setSuccessMessage('Address deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete address');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    form.reset();
    setErrorMessage(null);
  };

  const onSubmit = async (data: AccountAddressFormData) => {
    try {
      setErrorMessage(null);
      
      if (editingId) {
        await updateAddress.mutateAsync({ id: editingId, data });
        setSuccessMessage('Address updated successfully!');
      } else {
        await createAddress.mutateAsync(data);
        setSuccessMessage('Address added successfully!');
      }
      
      setTimeout(() => setSuccessMessage(null), 5000);
      handleCancel();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save address');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
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
            <span className="text-sm font-normal leading-[21px] text-black">Address Book</span>
          </div>
        </div>

        <div className="px-[135px] py-16">
          <div className="max-w-[1170px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-medium text-black">Address Book</h1>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  form.reset();
                }}
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-6 py-3 rounded hover:bg-[#c03939] transition-colors"
              >
                Add New Address
              </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Address Form */}
            {showForm && (
              <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-10 mb-8">
                <h2 className="text-xl font-medium text-[#DB4444] mb-6">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">First Name *</label>
                      <input
                        type="text"
                        {...form.register('firstName')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          form.formState.errors.firstName ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">Last Name *</label>
                      <input
                        type="text"
                        {...form.register('lastName')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          form.formState.errors.lastName ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">Company Name</label>
                    <input
                      type="text"
                      {...form.register('companyName')}
                      className="bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">Street Address *</label>
                    <input
                      type="text"
                      {...form.register('streetAddress')}
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                        form.formState.errors.streetAddress ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {form.formState.errors.streetAddress && (
                      <p className="text-sm text-red-600">{form.formState.errors.streetAddress.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">Apartment, floor, etc.</label>
                    <input
                      type="text"
                      {...form.register('apartment')}
                      className="bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">City *</label>
                    <input
                      type="text"
                      {...form.register('city')}
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                        form.formState.errors.city ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {form.formState.errors.city && (
                      <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">State *</label>
                    <select
                      {...form.register('state')}
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                        form.formState.errors.state ? 'border-2 border-red-500' : ''
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
                    {form.formState.errors.state && (
                      <p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">Postcode *</label>
                      <input
                        type="text"
                        {...form.register('postcode')}
                        maxLength={5}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          form.formState.errors.postcode ? 'border-2 border-red-500' : ''
                        }`}
                        placeholder="e.g., 50000"
                      />
                      {form.formState.errors.postcode && (
                        <p className="text-sm text-red-600">{form.formState.errors.postcode.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">Phone Number *</label>
                      <input
                        type="tel"
                        {...form.register('phoneNumber')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          form.formState.errors.phoneNumber ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-black">Email Address *</label>
                    <input
                      type="email"
                      {...form.register('emailAddress')}
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                        form.formState.errors.emailAddress ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {form.formState.errors.emailAddress && (
                      <p className="text-sm text-red-600">{form.formState.errors.emailAddress.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      {...form.register('isDefault')}
                      id="isDefault"
                      className="w-6 h-6 rounded border-2 border-[#DB4444] bg-[#DB4444] checked:bg-[#DB4444] cursor-pointer"
                    />
                    <label htmlFor="isDefault" className="text-base font-normal leading-6 text-black cursor-pointer">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-base font-normal leading-6 text-black hover:opacity-70 transition-opacity"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createAddress.isPending || updateAddress.isPending}
                      className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createAddress.isPending || updateAddress.isPending
                        ? 'Saving...'
                        : editingId
                        ? 'Update Address'
                        : 'Add Address'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses List */}
            {!showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses && addresses.length > 0 ? (
                  addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-6 relative"
                    >
                      {address.is_default && (
                        <span className="absolute top-4 right-4 bg-[#DB4444] text-white text-xs font-medium px-3 py-1 rounded">
                          Default
                        </span>
                      )}
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-black mb-2">
                          {address.first_name} {address.last_name}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          {address.company_name && <p>{address.company_name}</p>}
                          <p>{address.street_address}</p>
                          {address.apartment && <p>{address.apartment}</p>}
                          <p>{address.city || address.town_city}, {address.state} {address.postcode}</p>
                          <p>{address.phone_number}</p>
                          <p>{address.email_address}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-[#DB4444] text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          disabled={deleteAddress.isPending}
                          className="text-red-600 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        form.reset();
                      }}
                      className="bg-[#DB4444] text-white text-base font-medium leading-6 px-6 py-3 rounded hover:bg-[#c03939] transition-colors"
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}


'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountProfileSchema, accountPasswordSchema, type AccountProfileFormData, type AccountPasswordFormData } from '@/lib/validations/account';
import { useProfile, useUpdateProfile, useUpdatePassword } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';

export default function Account() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const profileForm = useForm<AccountProfileFormData>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
    },
  });

  const passwordForm = useForm<AccountPasswordFormData>({
    resolver: zodResolver(accountPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user?.email || '',
        address: profile.address || '',
      });
    }
  }, [profile, user, profileForm]);

  const onProfileSubmit = async (data: AccountProfileFormData) => {
    try {
      setErrorMessage(null);
      await updateProfile.mutateAsync(data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: AccountPasswordFormData) => {
    try {
      setErrorMessage(null);
      await updatePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccessMessage('Password updated successfully!');
      passwordForm.reset();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  const handleCancel = () => {
    if (activeTab === 'profile') {
      profileForm.reset();
    } else {
      passwordForm.reset();
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const displayName = profile 
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'User'
    : user?.email?.split('@')[0] || 'User';

  if (profileLoading) {
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

        {/* Breadcrumb and Welcome Message */}
        <div className="px-[135px] py-4">
          <div className="flex items-center justify-between">
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
              <span className="text-sm font-normal leading-[21px] text-black">My Account</span>
            </div>
            <p className="text-sm font-normal leading-[21px] text-black">
              Welcome! <span className="text-[#DB4444]">{displayName}</span>
            </p>
          </div>
        </div>

        <div className="px-[135px] py-16">
          <div className="max-w-[1170px] mx-auto flex gap-[75px] items-start">
            {/* Left Sidebar - Account Navigation */}
            <div className="w-[200px] flex flex-col gap-12">
              {/* Manage My Account Section */}
              <div className="flex flex-col gap-6">
                <h2 className="text-base font-medium leading-6 text-black">Manage My Account</h2>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account"
                    className="text-base font-normal leading-6 text-[#DB4444] hover:opacity-80 transition-opacity"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/account/address"
                    className="text-base font-normal leading-6 text-black opacity-50 hover:opacity-100 transition-opacity"
                  >
                    Address Book
                  </Link>
                  <Link
                    href="/account/payment"
                    className="text-base font-normal leading-6 text-black opacity-50 hover:opacity-100 transition-opacity"
                  >
                    My Payment Options
                  </Link>
                </div>
              </div>

              {/* My Orders Section */}
              <div className="flex flex-col gap-6">
                <h2 className="text-base font-medium leading-6 text-black">My Orders</h2>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account/orders"
                    className="text-base font-normal leading-6 text-black opacity-50 hover:opacity-100 transition-opacity"
                  >
                    Order History
                  </Link>
                </div>
              </div>

              {/* My WishList */}
              <div className="flex flex-col gap-6">
                <Link
                  href="/wishlist"
                  className="text-base font-medium leading-6 text-black hover:opacity-80 transition-opacity"
                >
                  My WishList
                </Link>
              </div>
            </div>

            {/* Right Section - Edit Your Profile Form */}
            <div className="flex-1 bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-10">
              <h1 className="text-xl font-medium leading-[28px] text-[#DB4444] mb-10">
                Edit Your Profile
              </h1>

              {/* Tab Navigation */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 px-4 text-base font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-[#DB4444] border-b-2 border-[#DB4444]'
                      : 'text-black opacity-50 hover:opacity-100'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className={`pb-4 px-4 text-base font-medium transition-colors ${
                    activeTab === 'password'
                      ? 'text-[#DB4444] border-b-2 border-[#DB4444]'
                      : 'text-black opacity-50 hover:opacity-100'
                  }`}
                >
                  Password Changes
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

              {/* Profile Form */}
              {activeTab === 'profile' && (
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-8">
                  {/* Personal Information - Two Columns */}
                  <div className="flex gap-[50px]">
                    {/* First Name */}
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...profileForm.register('firstName')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          profileForm.formState.errors.firstName ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...profileForm.register('lastName')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          profileForm.formState.errors.lastName ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email and Address - Two Columns */}
                  <div className="flex gap-[50px]">
                    {/* Email */}
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">Email</label>
                      <input
                        type="email"
                        {...profileForm.register('email')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          profileForm.formState.errors.email ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-base font-normal leading-6 text-black">Address</label>
                      <input
                        type="text"
                        {...profileForm.register('address')}
                        className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black outline-none focus:bg-gray-100 transition-colors ${
                          profileForm.formState.errors.address ? 'border-2 border-red-500' : ''
                        }`}
                      />
                      {profileForm.formState.errors.address && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-8 mt-8">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-base font-normal leading-6 text-black hover:opacity-70 transition-opacity"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Form */}
              {activeTab === 'password' && (
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-8">
                  {/* Current Password */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      {...passwordForm.register('currentPassword')}
                      placeholder="Current Password"
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                        passwordForm.formState.errors.currentPassword ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-600">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      {...passwordForm.register('newPassword')}
                      placeholder="New Password"
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                        passwordForm.formState.errors.newPassword ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-600">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      placeholder="Confirm New Password"
                      className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                        passwordForm.formState.errors.confirmPassword ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-8 mt-8">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-base font-normal leading-6 text-black hover:opacity-70 transition-opacity"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatePassword.isPending}
                      className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}

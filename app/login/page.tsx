'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

export default function LogIn() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await signIn(data);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <TopHeader />
      <div className="border-b border-gray-200" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
        <Header />
      </div>
      <div className="border-b border-gray-200" />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[129px] items-center w-full max-w-[1440px]">
          {/* Left Side - Image */}
          <div className="bg-[#cbe4e8] rounded-tr-[4px] rounded-br-[4px] w-full lg:w-[805px] h-[400px] sm:h-[500px] lg:h-[781px] relative overflow-hidden flex items-center justify-center shrink-0 hidden lg:flex">
            <div className="absolute left-[-8px] top-[75px] w-[919px] h-[706px]">
              <Image
                src="/images/75f394c0a1c7dc5b68a42239311e510f54d8cd59.png"
                alt="Shopping illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 sm:gap-10 items-start shrink-0 w-full lg:w-[370px]">
            <div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-medium leading-tight lg:leading-[30px] tracking-[0.5px] sm:tracking-[1px] lg:tracking-[1.44px] text-black">
                Log in to Exclusive
              </h1>
              <p className="text-base font-normal leading-6 text-black">
                Enter your details below
              </p>
            </div>

            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-10 items-start w-full">
              {/* Email Field */}
              <div className="flex flex-col gap-2 items-start w-full">
                <label
                  htmlFor="email"
                  className="text-base font-normal leading-6 text-black opacity-40"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full border-b border-black/50 pb-2 outline-none focus:border-black transition-colors bg-transparent"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2 items-start w-full">
                <label
                  htmlFor="password"
                  className="text-base font-normal leading-6 text-black opacity-40"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="w-full border-b border-black/50 pb-2 outline-none focus:border-black transition-colors bg-transparent"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-[87px] items-center w-full">
              {/* Log In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#DB4444] text-white text-base font-medium leading-6 px-12 py-4 rounded-[4px] hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>

              {/* Forget Password Link */}
              <Link
                href="/forgot-password"
                className="text-base font-normal leading-6 text-[#DB4444] hover:underline transition-all"
              >
                Forget Password?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}


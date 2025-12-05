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
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';

export default function SignUp() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await signUp(data);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    }
  };

  const handleGoogleSignUp = () => {
    // Google OAuth integration pending
  };

  return (
    <main className="min-h-screen bg-white">
      <TopHeader />
      <div className="border-b border-gray-200" />
      <div className="px-[135px] py-6">
        <Header />
      </div>
      <div className="border-b border-gray-200" />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-[135px] py-12">
        <div className="flex gap-[129px] items-center w-full max-w-[1440px]">
          {/* Left Side - Image */}
          <div className="bg-[#cbe4e8] rounded-tr-[4px] rounded-br-[4px] w-[805px] h-[781px] relative overflow-hidden flex items-center justify-center shrink-0">
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
          <div className="flex flex-col gap-12 items-start shrink-0">
            <div className="flex flex-col gap-6 items-start">
              <h1 className="text-[36px] font-medium leading-[30px] tracking-[1.44px] text-black">
                Create an account
              </h1>
              <p className="text-base font-normal leading-6 text-black">
                Enter your details below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 items-start w-[370px]">
              {error && (
                <div className="w-full p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-10 items-start w-full">
                {/* Name Field */}
                <div className="flex flex-col gap-2 items-start w-full">
                  <label
                    htmlFor="name"
                    className="text-base font-normal leading-6 text-black opacity-40"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full border-b border-black/50 pb-2 outline-none focus:border-black transition-colors bg-transparent"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

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

              <div className="flex flex-col gap-4 items-start w-full">
                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#DB4444] text-white text-base font-medium leading-6 py-4 rounded-[4px] hover:bg-[#c03939] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="flex flex-col gap-8 items-center w-full mt-4">
                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="border border-black/40 rounded-[4px] px-[86px] py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-base font-normal leading-6 text-black">
                      Sign up with Google
                    </span>
                  </button>

                  {/* Login Link */}
                  <div className="flex items-center gap-4">
                    <p className="text-base font-normal leading-6 text-black opacity-70">
                      Already have account?
                    </p>
                    <Link
                      href="/login"
                      className="text-base font-medium leading-6 text-black opacity-70 hover:opacity-100 hover:underline transition-all relative group"
                    >
                      Log in
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black/50 group-hover:w-full transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


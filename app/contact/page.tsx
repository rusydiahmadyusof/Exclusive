'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
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
          <span className="text-sm font-normal leading-[21px] text-black">Contact</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-8 sm:py-12 lg:py-16">
        <div className="max-w-[1170px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-[25px]">
          {/* Left Panel - Contact Information */}
          <div className="w-full lg:w-[340px] bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-6 sm:p-8 lg:p-9 flex flex-col gap-6 lg:gap-8">
            {/* Call To Us Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium leading-6 text-black">Call To Us</h3>
              </div>
              <div className="flex flex-col gap-4 text-sm font-normal leading-[21px] text-black">
                <p className="w-[262px]">
                  We are available 24/7, 7 days a week.
                </p>
                <p>Phone: +8801611112222</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/50 opacity-50" />

            {/* Write To US Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#DB4444] rounded-full flex items-center justify-center">
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="text-base font-medium leading-6 text-black">Write To US</h3>
              </div>
              <div className="flex flex-col gap-4 text-sm font-normal leading-[21px] text-black">
                <p className="w-[250px]">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p>Emails: customer@exclusive.com</p>
                <p>Emails: support@exclusive.com</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <div className="flex-1 bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-6 sm:p-8 lg:p-10">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                Message sent successfully! We'll get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 sm:gap-8 items-end">
              {/* Top Row - Name, Email, Phone */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Your Name *"
                    className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                      errors.name ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="Your Email *"
                    className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                      errors.email ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="Your Phone *"
                    className={`bg-[#F5F5F5] h-[50px] rounded px-4 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors ${
                      errors.phone ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="w-full flex flex-col gap-2">
                <textarea
                  {...register('message')}
                  placeholder="Your Message"
                  rows={8}
                  className="bg-[#F5F5F5] rounded px-4 py-3 text-base font-normal leading-6 text-black placeholder:opacity-50 outline-none focus:bg-gray-100 transition-colors resize-none"
                />
              </div>

              {/* Send Message Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#DB4444] text-white text-base font-medium leading-6 px-8 sm:px-12 py-3 sm:py-4 rounded hover:bg-[#c03939] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}


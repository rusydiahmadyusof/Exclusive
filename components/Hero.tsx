'use client';

import Image from 'next/image';

const heroImage = '/images/dc40ba897215f42e5883a64157f0aa3a4d1a866a.png';
const appleLogo = '/images/1126a357e5011a6f245df4c38eae015c7c9ccbe7.png';

export const Hero = () => {
  return (
    <div className="bg-black w-full max-w-[892px] h-[200px] sm:h-[280px] lg:h-[344px] rounded-lg relative overflow-hidden">
      <div className="absolute right-0 top-2 sm:top-4 w-[200px] sm:w-[300px] lg:w-[496px] h-[196px] sm:h-[276px] lg:h-[352px]">
        <Image
          src={heroImage}
          alt="iPhone 14 Series"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute left-4 sm:left-8 lg:left-16 top-4 sm:top-8 lg:top-[58px] flex items-center gap-3 sm:gap-4 lg:gap-6">
        <div className="w-6 h-8 sm:w-8 sm:h-10 lg:w-10 lg:h-[49px] relative">
          <Image
            src={appleLogo}
            alt="Apple Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-white text-xs sm:text-sm lg:text-base font-normal leading-5 sm:leading-6">
          iPhone 14 Series
        </p>
      </div>
      <div className="absolute left-4 sm:left-8 lg:left-16 top-12 sm:top-16 lg:top-[127px]">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[48px] font-semibold leading-tight sm:leading-[40px] lg:leading-[60px] tracking-[0.5px] sm:tracking-[1px] lg:tracking-[1.92px] max-w-[200px] sm:max-w-[250px] lg:w-[294px]">
          Up to 10% off Voucher
        </h1>
      </div>
      <div className="absolute left-4 sm:left-8 lg:left-[67px] top-32 sm:top-40 lg:top-[269px] flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <a
            href="#"
            className="text-white text-xs sm:text-sm lg:text-base font-medium leading-5 sm:leading-6 hover:underline"
          >
            Shop Now
          </a>
          <div className="h-px w-[60px] sm:w-[70px] lg:w-[81px] bg-white" />
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="cursor-pointer sm:w-6 sm:h-6"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="#FAFAFA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="absolute left-1/2 sm:left-auto sm:left-[200px] lg:left-[353px] top-[180px] sm:top-[260px] lg:top-[319px] flex gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full ${
              dot === 1 ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};



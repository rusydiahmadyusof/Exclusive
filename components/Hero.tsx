'use client';

import Image from 'next/image';

const heroImage = '/images/dc40ba897215f42e5883a64157f0aa3a4d1a866a.png';
const appleLogo = '/images/1126a357e5011a6f245df4c38eae015c7c9ccbe7.png';

export const Hero = () => {
  return (
    <div className="bg-black w-full max-w-[892px] h-[344px] rounded-lg relative overflow-hidden">
      <div className="absolute right-0 top-4 w-[496px] h-[352px]">
        <Image
          src={heroImage}
          alt="iPhone 14 Series"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute left-16 top-[58px] flex items-center gap-6">
        <div className="w-10 h-[49px] relative">
          <Image
            src={appleLogo}
            alt="Apple Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-white text-base font-normal leading-6">
          iPhone 14 Series
        </p>
      </div>
      <div className="absolute left-16 top-[127px]">
        <h1 className="text-white text-[48px] font-semibold leading-[60px] tracking-[1.92px] w-[294px]">
          Up to 10% off Voucher
        </h1>
      </div>
      <div className="absolute left-[67px] top-[269px] flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <a
            href="#"
            className="text-white text-base font-medium leading-6 hover:underline"
          >
            Shop Now
          </a>
          <div className="h-px w-[81px] bg-white" />
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="cursor-pointer"
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
      <div className="absolute left-[353px] top-[319px] flex gap-3">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-3 h-3 rounded-full ${
              dot === 1 ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};



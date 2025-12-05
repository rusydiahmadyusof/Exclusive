'use client';

import { Timer } from './Timer';

export const FlashSaleBanner = () => {
  return (
    <div className="w-full max-w-[1170px] mx-auto bg-[#000000] rounded-lg relative overflow-hidden h-[500px]">
      <div className="absolute right-0 top-0 w-[504px] h-[500px]">
        <div className="w-full h-full bg-gradient-to-l from-[#000000] to-transparent" />
      </div>
      <div className="absolute left-14 top-[121px] flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-10 bg-[#DB4444] rounded" />
          <p className="text-base font-normal leading-6 text-[#DB4444]">
            Categories
          </p>
        </div>
        <h2 className="text-[48px] font-semibold leading-[60px] text-white max-w-[443px]">
          Enhance Your Music Experience
        </h2>
        <div className="flex gap-6">
          <Timer value={3} label="Days" />
          <Timer value={23} label="Hours" />
          <Timer value={19} label="Minutes" />
          <Timer value={56} label="Seconds" />
        </div>
        <button className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-[#c03939] transition-colors w-[171px]">
          Buy Now
        </button>
      </div>
    </div>
  );
};



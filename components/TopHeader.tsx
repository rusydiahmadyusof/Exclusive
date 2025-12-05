'use client';

export const TopHeader = () => {
  return (
    <div className="bg-black w-full h-12 flex items-center justify-between px-[136px]">
      <div className="flex items-center gap-2 text-white text-sm">
        <p className="font-normal leading-[21px]">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </p>
        <a
          href="#"
          className="font-semibold leading-6 underline cursor-pointer hover:opacity-80"
        >
          ShopNow
        </a>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-white text-sm font-normal leading-[21px]">English</p>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="cursor-pointer"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};



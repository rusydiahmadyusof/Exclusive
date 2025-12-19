'use client';

export const TopHeader = () => {
  return (
    <div className="bg-black w-full h-10 sm:h-12 flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-[136px]">
      <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm flex-1 min-w-0">
        <p className="font-normal leading-[21px] truncate">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </p>
        <a
          href="#"
          className="font-semibold leading-6 underline cursor-pointer hover:opacity-80 whitespace-nowrap flex-shrink-0"
        >
          ShopNow
        </a>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        <p className="text-white text-xs sm:text-sm font-normal leading-[21px] hidden sm:block">English</p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="cursor-pointer sm:w-6 sm:h-6"
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



'use client';

interface SectionHeaderProps {
  badge: string;
  title: string;
  showArrows?: boolean;
  actionButton?: React.ReactNode;
}

export const SectionHeader = ({
  badge,
  title,
  showArrows = false,
  actionButton,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-10 bg-[#DB4444] rounded" />
          <p className="text-base font-normal leading-6 text-[#DB4444]">
            {badge}
          </p>
        </div>
        <h2 className="text-[36px] font-semibold leading-[48px] text-black">
          {title}
        </h2>
      </div>
      {showArrows && (
        <div className="flex items-center gap-3">
          <button
            className="w-[46px] h-[46px] rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Previous"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="w-[46px] h-[46px] rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Next"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};



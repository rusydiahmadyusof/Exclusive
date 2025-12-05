'use client';

import Link from 'next/link';

interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export const CategoryCard = ({ icon, label, href }: CategoryCardProps) => {
  const content = (
    <div className="w-full h-[200px] sm:h-[220px] flex flex-col items-center justify-center gap-4 bg-[#F5F5F5] rounded-lg border-2 border-transparent hover:border-[#DB4444] hover:bg-white transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-base font-medium leading-6 text-black group-hover:text-[#DB4444] transition-colors duration-300">
        {label}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};



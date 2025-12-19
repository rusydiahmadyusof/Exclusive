import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { CategorySidebar } from '@/components/CategorySidebar';
import { Hero } from '@/components/Hero';
import { FlashSales } from '@/components/FlashSales';
import { Categories } from '@/components/Categories';
import { BestSelling } from '@/components/BestSelling';
import { OurProducts } from '@/components/OurProducts';
import { NewArrival } from '@/components/NewArrival';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopHeader />
      <div className="border-b border-gray-200" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-6">
        <Header />
      </div>
      <div className="border-b border-gray-200" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px] py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 xl:gap-[78px]">
          <CategorySidebar />
          <Hero />
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[135px]">
        <FlashSales />
        <Categories />
        <BestSelling />
        <NewArrival />
        <OurProducts />
      </div>
      <Footer />
    </main>
  );
}


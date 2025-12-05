'use client';

import Image from 'next/image';
import Link from 'next/link';

const ps5Image = '/images/5e634682db5174aff99bb9337d2dc9598a0b44e4.png';
const womenImage = '/images/e59d9f348cc24eeff489863523b63971c3ff8e4a.png';
const speakerImage = '/images/288da330273c46e1c3dc0a8915c4b031d0345347.png';
const perfumeImage = '/images/5e634682db5174aff99bb9337d2dc9598a0b44e4.png';

export const NewArrival = () => {
  return (
    <section className="w-full max-w-[1170px] mx-auto py-16">
      <div className="flex flex-col gap-5 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-10 bg-[#DB4444] rounded" />
          <p className="text-base font-normal leading-6 text-[#DB4444]">
            Featured
          </p>
        </div>
        <h2 className="text-[36px] font-semibold leading-[48px] text-black">
          New Arrival
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1 bg-[#000000] rounded-lg relative overflow-hidden h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full h-full relative">
              <Image
                src={ps5Image}
                alt="PlayStation 5"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute bottom-16 left-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold text-white">PlayStation 5</h3>
              <p className="text-white/80 text-sm max-w-[242px]">
                Black and White version of the PS5 coming out on sale.
              </p>
              <Link
                href="#"
                className="text-white text-base font-medium hover:underline inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#000000] rounded-lg relative overflow-hidden h-[284px]">
            <div className="absolute inset-0">
              <Image
                src={womenImage}
                alt="Women's Collections"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-white">
                  Women's Collections
                </h3>
                <p className="text-white/80 text-sm max-w-[255px]">
                  Featured woman collections that give you another vibe.
                </p>
                <Link
                  href="#"
                  className="text-white text-base font-medium hover:underline inline-block"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#000000] rounded-lg relative overflow-hidden h-[284px]">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full h-full relative">
                  <Image
                    src={speakerImage}
                    alt="Speakers"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-white">Speakers</h3>
                  <p className="text-white/80 text-sm">Amazon wireless speakers</p>
                  <Link
                    href="#"
                    className="text-white text-base font-medium hover:underline inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-[#000000] rounded-lg relative overflow-hidden h-[284px]">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full h-full relative">
                  <Image
                    src={perfumeImage}
                    alt="Perfume"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-white">Perfume</h3>
                  <p className="text-white/80 text-sm">GUCCI INTENSE OUD EDP</p>
                  <Link
                    href="#"
                    className="text-white text-base font-medium hover:underline inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



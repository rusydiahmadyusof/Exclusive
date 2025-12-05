'use client';

import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  const statistics = [
    {
      icon: '🏢',
      value: '10.5k',
      description: 'Sallers active our site',
      highlight: false,
    },
    {
      icon: '💰',
      value: '33k',
      description: 'Mopnthly Produduct Sale',
      highlight: true,
    },
    {
      icon: '👥',
      value: '45.5k',
      description: 'Customer active in our site',
      highlight: false,
    },
    {
      icon: '💼',
      value: '25k',
      description: 'Anual gross sale in our site',
      highlight: false,
    },
  ];

  const teamMembers = [
    {
      image: '/images/088149fd5afc043392ee3cbb529f429b3e2098d3.png',
      name: 'Tom Cruise',
      title: 'Founder & Chairman',
    },
    {
      image: '/images/8438eab9a2fe88af0272adecd83422d0cb7e20d7.png',
      name: 'Emma Watson',
      title: 'Managing Director',
    },
    {
      image: '/images/ede48f2b5df8103b281240ce5bafe5dd7d215ab8.png',
      name: 'Will Smith',
      title: 'Product Designer',
    },
  ];

  const services = [
    {
      icon: (
        <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M1 3h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M5 7h14" />
          </svg>
        </div>
      ),
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
    },
    {
      icon: (
        <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
      ),
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
    },
    {
      icon: (
        <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      ),
      title: 'MONEY BACK GUARANTEE',
      description: 'We reurn money within 30 days',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <TopHeader />
      <div className="border-b border-gray-200" />
      <div className="px-[135px] py-6">
        <Header />
      </div>
      <div className="border-b border-gray-200" />

      {/* Breadcrumb */}
      <div className="px-[135px] py-4">
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
          <span className="text-sm font-normal leading-[21px] text-black">About</span>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex gap-[30px] items-start">
          {/* Left Column - Text */}
          <div className="flex-1 flex flex-col gap-10">
            <h1 className="text-[54px] font-semibold leading-[64px] tracking-[3.24px] text-black">
              Our Story
            </h1>
            <div className="flex flex-col gap-6 text-base font-normal leading-[26px] text-black">
              <p className="w-[525px]">
                Launced in 2015, Exclusive is South Asia's premier online shopping makterplace
                with an active presense in Bangladesh. Supported by wide range of tailored
                marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands
                and serves 3 millioons customers across the region.
              </p>
              <p className="w-[505px]">
                Exclusive has more than 1 Million products to offer, growing at a very fast.
                Exclusive offers a diverse assotment in categories ranging from consumer.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="w-[705px] h-[609px] relative rounded-tl rounded-bl overflow-hidden bg-[#eb7ea8]">
            <div className="absolute inset-0">
              <Image
                src="/images/fcc89aaa7b85f8c1dcce81e71e2eb178be13bd4d.png"
                alt="Two women with shopping bags"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex gap-[30px]">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 h-[230px] rounded border ${
                stat.highlight
                  ? 'bg-[#DB4444] border-transparent shadow-[0px_2px_10px_2px_rgba(0,0,0,0.2)]'
                  : 'bg-white border-black/30'
              } flex flex-col items-center justify-center gap-6`}
            >
              <div className="w-20 h-20 flex items-center justify-center text-4xl">
                {stat.icon}
              </div>
              <div className="flex flex-col gap-3 items-center">
                <p
                  className={`text-[32px] font-bold leading-[30px] tracking-[1.28px] ${
                    stat.highlight ? 'text-white' : 'text-black'
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-base font-normal leading-6 text-center ${
                    stat.highlight ? 'text-white' : 'text-black'
                  }`}
                >
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex gap-[30px]">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex-1 flex flex-col gap-8">
              <div className="bg-[#F5F5F5] h-[430px] rounded relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[32px] font-medium leading-[30px] tracking-[1.28px] text-black">
                    {member.name}
                  </h3>
                  <p className="text-base font-normal leading-6 text-black">{member.title}</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                    aria-label="Twitter"
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
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                    aria-label="Instagram"
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
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="black"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="px-[135px] py-16">
        <div className="max-w-[1170px] mx-auto flex gap-[88px] justify-center">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col gap-6 items-center">
              <div className="w-20 h-20 flex items-center justify-center">{service.icon}</div>
              <div className="flex flex-col gap-2 items-center text-center">
                <h3 className="text-xl font-semibold leading-[28px] text-black">
                  {service.title}
                </h3>
                <p className="text-sm font-normal leading-[21px] text-black">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}


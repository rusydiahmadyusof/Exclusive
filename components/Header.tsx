'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks';

const CartBadge = () => {
  const { data: cartItems } = useCart();
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DB4444] rounded-full flex items-center justify-center">
      <span className="text-[10px] text-white font-medium">{totalItems}</span>
    </span>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <div className="w-full max-w-[1170px] mx-auto min-h-[38px] flex items-center justify-between relative">
        <div className="flex items-center gap-4 lg:gap-8 xl:gap-[190px] flex-1">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-black tracking-[0.72px] flex-shrink-0">
            Exclusive
          </Link>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-12">
            <Link
              href="/"
              className={`text-base font-normal text-black leading-6 whitespace-nowrap ${
                pathname === '/' ? 'underline decoration-black' : 'hover:underline hover:decoration-black'
              }`}
            >
              Home
            </Link>
            <Link
              href="/contact"
              className={`text-base font-normal text-black leading-6 whitespace-nowrap ${
                pathname === '/contact' ? 'underline decoration-black' : 'hover:underline hover:decoration-black'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`text-base font-normal text-black leading-6 whitespace-nowrap ${
                pathname === '/about' ? 'underline decoration-black' : 'hover:underline hover:decoration-black'
              }`}
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link
                href="/signup"
                className={`text-base font-normal text-black leading-6 whitespace-nowrap ${
                  pathname === '/signup' ? 'underline decoration-black' : 'hover:underline hover:decoration-black'
                }`}
              >
                Sign Up
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 lg:ml-8">
          <div className="hidden sm:flex bg-[#F5F5F5] rounded px-3 sm:px-5 py-2 flex items-center gap-2 sm:gap-[34px] min-w-[150px] sm:min-w-[200px]">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-transparent text-xs text-black placeholder:text-black placeholder:opacity-50 outline-none flex-1"
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="cursor-pointer flex-shrink-0 sm:w-6 sm:h-6"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/wishlist"
            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer hover:opacity-70"
            aria-label="Wishlist"
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer hover:opacity-70 relative"
            aria-label="Cart"
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
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <CartBadge />
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer hover:opacity-70"
              aria-label="Account"
              aria-expanded={isDropdownOpen}
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            {isDropdownOpen && isAuthenticated && (
              <div className="absolute right-0 top-10 w-[225px] bg-white border border-gray-200 rounded-[4px] shadow-lg z-50">
                <div className="flex flex-col py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.email || 'User'}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="px-4 py-3 text-base font-normal leading-6 text-black hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Manage My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="px-4 py-3 text-base font-normal leading-6 text-black hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Order
                  </Link>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-base font-normal leading-6 text-black hover:bg-gray-50 transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            {isDropdownOpen && !isAuthenticated && (
              <div className="absolute right-0 top-10 w-[225px] bg-white border border-gray-200 rounded-[4px] shadow-lg z-50">
                <div className="flex flex-col py-2">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-base font-normal leading-6 text-black hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-3 text-base font-normal leading-6 text-black hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-70"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
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
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 mt-2">
            <nav className="flex flex-col py-4">
            <Link
              href="/"
              className={`px-4 py-3 text-base font-normal text-black ${
                pathname === '/' ? 'bg-gray-50 underline decoration-black' : 'hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-3 text-base font-normal text-black ${
                pathname === '/contact' ? 'bg-gray-50 underline decoration-black' : 'hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`px-4 py-3 text-base font-normal text-black ${
                pathname === '/about' ? 'bg-gray-50 underline decoration-black' : 'hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link
                href="/signup"
                className={`px-4 py-3 text-base font-normal text-black ${
                  pathname === '/signup' ? 'bg-gray-50 underline decoration-black' : 'hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
            <div className="px-4 py-3 border-t border-gray-200 mt-2">
              <div className="bg-[#F5F5F5] rounded px-3 py-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-xs text-black placeholder:text-black placeholder:opacity-50 outline-none flex-1"
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="cursor-pointer flex-shrink-0"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            </nav>
          </div>
        )}
    </div>
  );
};



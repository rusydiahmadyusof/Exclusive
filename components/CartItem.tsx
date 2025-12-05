'use client';

import Image from 'next/image';

interface CartItemProps {
  image: string;
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export const CartItem = ({
  image,
  name,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const subtotal = price * quantity;

  return (
    <div className="bg-white h-[102px] rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] flex items-center relative px-10">
      <button
        onClick={onRemove}
        className="absolute left-[30px] top-5 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
        aria-label="Remove item"
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
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </button>

      <div className="flex items-center flex-1 gap-[284px]">
        {/* Product Section */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="w-[54px] h-[54px] relative shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-base font-normal leading-6 text-black truncate">{name}</p>
        </div>

        {/* Price */}
        <div className="w-[100px] shrink-0">
          <p className="text-base font-normal leading-6 text-black">RM {price.toFixed(2)}</p>
        </div>

        {/* Quantity */}
        <div className="w-[72px] shrink-0">
          <div className="border-[1.5px] border-black/40 rounded h-11 flex items-center justify-between px-3">
            <button
              onClick={handleIncrease}
              className="w-4 h-4 flex items-center justify-center hover:opacity-70"
              aria-label="Increase quantity"
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 2v4M2 4h4" />
              </svg>
            </button>
            <span className="text-base font-normal leading-6 text-black">
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              onClick={handleDecrease}
              className="w-4 h-4 flex items-center justify-center hover:opacity-70 rotate-180"
              aria-label="Decrease quantity"
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 2v4M2 4h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="w-[100px] shrink-0 text-right">
          <p className="text-base font-normal leading-6 text-black">RM {subtotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};


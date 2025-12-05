'use client';

interface CartTotalProps {
  subtotal: number;
  shipping?: number;
  onCheckout: () => void;
}

export const CartTotal = ({
  subtotal,
  shipping = 0,
  onCheckout,
}: CartTotalProps) => {
  const total = subtotal + shipping;

  return (
    <div className="border-[1.5px] border-black rounded p-6 w-[470px]">
      <h3 className="text-xl font-medium leading-[28px] text-black mb-6">
        Cart Total
      </h3>

      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-base font-normal leading-6 text-black">Subtotal:</p>
          <p className="text-base font-normal leading-6 text-black">RM {subtotal.toFixed(2)}</p>
        </div>

        <div className="border-t border-black/40 pt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-base font-normal leading-6 text-black">Shipping:</p>
            <p className="text-base font-normal leading-6 text-black">
              {shipping === 0 ? 'Free' : `RM ${shipping.toFixed(2)}`}
            </p>
          </div>
        </div>

        <div className="border-t border-black/40 pt-6">
          <div className="flex justify-between items-center">
            <p className="text-base font-normal leading-6 text-black">Total:</p>
            <p className="text-base font-normal leading-6 text-black">RM {total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-[#DB4444] text-white text-base font-medium leading-6 py-4 rounded hover:bg-[#c03939] transition-colors"
      >
        Proceed to checkout
      </button>
    </div>
  );
};


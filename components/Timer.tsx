'use client';

interface TimerProps {
  value: number;
  label: string;
}

export const Timer = ({ value, label }: TimerProps) => {
  return (
    <div className="w-[62px] h-[62px] bg-[#000000] rounded flex flex-col items-center justify-center">
      <span className="text-2xl font-bold text-white leading-[30px]">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs font-normal text-white leading-[18px]">
        {label}
      </span>
    </div>
  );
};



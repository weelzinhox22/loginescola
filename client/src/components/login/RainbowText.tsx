import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RainbowTextProps {
  children: ReactNode;
  className?: string;
}

export default function RainbowText({ children, className }: RainbowTextProps) {
  return (
    <span className={cn('rainbow-text font-semibold', className)}>
      {children}
    </span>
  );
}

export function RainbowArc() {
  return (
    <div className="relative w-full h-32 mt-4 mb-6 overflow-hidden">
      <div className="absolute w-[300%] h-48 left-[50%] -translate-x-1/2 rounded-[50%] rainbow-gradient opacity-25" />
    </div>
  );
}

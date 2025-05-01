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

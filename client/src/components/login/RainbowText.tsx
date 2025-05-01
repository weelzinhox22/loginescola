import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'accent' | 'secondary';
}

export default function GradientText({ 
  children, 
  className, 
  variant = 'accent' 
}: GradientTextProps) {
  return (
    <span className={cn('gradient-text font-semibold', className)}>
      {children}
    </span>
  );
}

export function GradientDivider({ className }: { className?: string }) {
  return (
    <div className={cn("h-1 w-24 my-4 primary-gradient rounded-full", className)} />
  );
}

export function GradientBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-sky-50" />
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>
  );
}

export function GradientCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("glass-effect rounded-xl p-6 shadow-lg", className)}>
      {children}
    </div>
  );
}

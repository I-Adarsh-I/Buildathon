'use client';

import { Loader as SpinnerIcon } from 'lucide-react';

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export const Loader = ({ size = 24, text = "Loading...", className }: LoaderProps) => {
  return (
    <div className={`flex items-center justify-center gap-2 py-6 text-muted-foreground ${className}`}>
      <SpinnerIcon className={`animate-spin`} width={size} height={size} />
      <span className="text-sm">{text}</span>
    </div>
  );
};
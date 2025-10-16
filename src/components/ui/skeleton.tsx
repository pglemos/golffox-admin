import { type HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/60', className)} {...props} />;
}

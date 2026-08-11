import React from 'react';
import { twMerge } from 'tailwind-merge';

export const SkeletonLoader = ({ className }) => {
  return (
    <div
      className={twMerge(
        'animate-pulse bg-gray-200 rounded-md',
        className
      )}
    />
  );
};

export const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <SkeletonLoader className="h-64 w-full rounded-2xl" />
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
    </div>
  </div>
);

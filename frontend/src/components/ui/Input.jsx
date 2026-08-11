import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={twMerge(
          "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

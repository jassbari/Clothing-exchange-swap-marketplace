import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-emerald-100 text-emerald-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    outline: 'border border-gray-200 text-gray-700 bg-white'
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

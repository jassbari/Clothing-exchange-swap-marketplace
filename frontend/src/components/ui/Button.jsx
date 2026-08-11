import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-soft hover:shadow-hover",
    secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
    outline: "border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-emerald-500 hover:border-gray-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-soft",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-60 cursor-not-allowed active:scale-100",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;

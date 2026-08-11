import React from 'react';
import { twMerge } from 'tailwind-merge';

const Avatar = ({ src, alt = "User", size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  return (
    <div
      className={twMerge(
        "relative rounded-full flex-shrink-0 bg-emerald-500 text-white flex items-center justify-center font-semibold border-2 border-white shadow-sm",
        sizes[size],
        className
      )}
    >
      <span className="uppercase">
        {alt ? alt.charAt(0) : 'U'}
      </span>
    </div>
  );
};

export default Avatar;

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <img
          src="/Cuxsnacklogo.png"
          alt="Cuxsnack Logo"
          className="w-24 h-24 animate-pulse"
        />
        <div className="absolute inset-0 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

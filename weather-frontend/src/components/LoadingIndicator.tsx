// src/components/LoadingIndicator.tsx
import React from 'react';

// Simple SVG Sun for the loader - you can get more creative here
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-16 h-16 text-yellow-300 animate-pulse" // Tailwind's pulse animation
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01-.75.75V21a.75.75 0 011.5 0v-2.25a.75.75 0 01-.75-.75zM5.166 17.834a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.06L5.106 5.106z" />
  </svg>
);

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-250px)] text-sky-200" aria-live="polite" aria-busy="true">
      <SunIcon />
      <p className="mt-4 text-xl animate-pulse">Fetching weather magic...</p>
    </div>
  );
};

export default LoadingIndicator;
// src/components/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  message: string | null; // The error message to display, or null if no error
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  // If no message is provided, don't render anything
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert" // Accessibility: informs assistive technologies this is an alert
      className="alert alert-error shadow-lg my-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100" // RippleUI alert classes + custom styling for better visibility
    >
      {/* Error Icon (Heroicon: x-circle) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {/* Error Message Text */}
      <span className="font-medium">Error!</span> {/* Added "Error!" prefix for clarity */}
      <span>{message}</span>
    </div>
  );
};

// CRUCIAL: Ensure the component is default exported
export default ErrorDisplay;
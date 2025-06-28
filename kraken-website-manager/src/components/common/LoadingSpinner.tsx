import React from "react";

export const LoadingSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeStyles = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-4 border-secondary border-opacity-100 ${sizeStyles[size]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
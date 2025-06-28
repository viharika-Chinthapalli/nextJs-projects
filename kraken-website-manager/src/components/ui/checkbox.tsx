import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  id,
  disabled,
  className,
}: CheckboxProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnimating(true);
    onCheckedChange(e.target.checked);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex items-center justify-center w-5 h-5 rounded cursor-pointer transition-all duration-200 relative",
          "border-[0.93px] border-border bg-transparent",
          isAnimating && "border-[0.9px] border-checkbox-border-focus",
          checked && !isAnimating && "bg-secondary border-secondary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {checked && (
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "text-white transition-all duration-200 z-10 relative",
              isAnimating ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <path
              d="M1 4.5L4.5 8L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {isAnimating && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "#613FDD1C",
              animation: "ripple 0.4s ease-out forwards",
            }}
          />
        )}
      </label>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
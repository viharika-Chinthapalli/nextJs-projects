import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  fontColor?: string;
  placeholderColor?: string;
  placeholderSize?: string;
  placeholderWeight?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className = '', 
  fontSize = '14px',
  fontWeight = '500',
  fontColor = '#0F0C1B',
  placeholderColor = '#0F0C1B66',
  placeholderSize = '14px',
  placeholderWeight = '500',
  error = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={`
          px-3 py-2 
          border rounded-md 
          outline-none 
          transition-all duration-200
          w-full
          bg-white
          min-h-[44px]
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        style={{
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: fontColor,
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLInputElement;
          if (!error && !target.matches(':focus')) {
            target.style.boxShadow = '0px 0px 0px 2px #613FDD20';
          }
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLInputElement;
          if (!target.matches(':focus')) {
            target.style.boxShadow = 'none';
          }
        }}
        onFocus={(e) => {
          const target = e.target as HTMLInputElement;
          if (error) {
            target.style.borderColor = '#FF4D4F';
          } else {
            target.style.boxShadow = '0px 1px 2px 0px #0000000D, 0px 0px 5.5px 0px #0000001A inset';
          }
        }}
        onBlur={(e) => {
          const target = e.target as HTMLInputElement;
          target.style.boxShadow = 'none';
          target.style.borderColor = error ? '#FF4D4F' : '#D1D5DB';
        }}
        {...props}
      />
      <style jsx>{`
        input::placeholder {
          color: ${placeholderColor};
          font-size: ${placeholderSize};
          font-weight: ${placeholderWeight};
        }
      `}</style>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
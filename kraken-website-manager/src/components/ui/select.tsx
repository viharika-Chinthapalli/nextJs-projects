import React, { memo, useState } from 'react';

const Select = memo(({
  children,
  value,
  onValueChange,
  ...props
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  [key: string]: any;
}) => (
  <div className="relative w-full" {...props}>
    {children}
  </div>
));

const SelectTrigger = memo(({
  children,
  className = '',
  onClick,
  isActive = false,
  error,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  error?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full px-3 py-2 text-left rounded-md bg-white focus:outline-none flex items-center justify-between transition-all duration-200 min-h-[44px] ${
          error ? 'border border-red-500' : 'border'
        } hover:bg-white ${className}`}
        style={{
          boxShadow: isHovered 
            ? error 
              ? '0px 0px 0px 2px #EF444420'
              : '0px 0px 0px 2px #613FDD20'
            : isActive 
              ? error 
                ? '0px 1px 2px 0px #0000000D, 0px 0px 5.5px 0px #0000001A inset'
                : '0px 1px 2px 0px #0000000D, 0px 0px 5.5px 0px #0000001A inset'
              : 'none',
          color: "var(--color-primary-foreground)",
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        <div className="flex-1 min-w-0">
          {children}
        </div>
        <svg
          className="w-4 h-4 ml-2 flex-shrink-0"
          style={{ 
            stroke: error ? '#EF4444' : '#667085', 
            strokeWidth: '1.67px' 
          }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <div className="text-sm text-red-500 mt-1 truncate">
          {error}
        </div>
      )}
    </div>
  );
});


const SelectValue = memo(({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const hasValue = Boolean(children);
  return (
    <span
      className="truncate block text-left"
      style={{ color: hasValue ? 'var(--color-primary-foreground)' : 'var(--color-primary-foreground)', fontSize: "14px", fontWeight: "500"}}
    >
      {hasValue ? children : placeholder}
    </span>
  );
});

const SelectContent = memo(({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}) =>
  isOpen ? (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className="absolute z-20 w-full mt-1 rounded-md overflow-y-auto left-0 right-0"
        style={{
          background: '#FEFEFF',
          boxShadow:
            '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
          maxHeight: '180px',
        }}
      >
        {children}
      </div>
    </>
  ) : null
);

const SelectItem = memo(({
  children,
  value,
  onClick,
}: {
  children: React.ReactNode;
  value: string;
  onClick: (value: string) => void;
}) => (
  <div
    onClick={() => onClick(value)}
    className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm transition-colors min-h-[40px] flex items-center"
    style={{ color: 'text-primary' }}
  >
    <div className="w-full min-w-0">
      {children}
    </div>
  </div>
));

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectValue.displayName = 'SelectValue';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
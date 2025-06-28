import React from 'react';

interface TextareaProps {
  className?: string;
  label?: string;
  state?: string;
  errorMessage?: string;
  filledText?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

export const Textarea = ({ 
  className = '', 
  label = 'Description of Website',
  state = 'default',
  errorMessage = 'This field is required',
  filledText = 'We sell backlink on our website',
  error = '',
  value = '',
  ...props 
}: TextareaProps) => {
  const currentLength = value?.length || 0;
  const minLength = 150;
  const showCharacterCount = currentLength > 0 || error;

  return (
    <div className="w-full">
      <textarea
        className={`
          w-full 
          rounded-md 
          px-3 
          py-2 
          outline-none 
          resize-none 
          transition-all 
          duration-200
          ${error ? 'border border-destructive' : 'border '}
          ${className}
        `}
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#333333',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (!error) {
            target.style.boxShadow = '0px 0px 0px 2px #613FDD20';
            target.style.backgroundColor = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (!target.matches(':focus')) {
            target.style.boxShadow = 'none';
          }
        }}
        onFocus={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (error) {
            target.style.boxShadow = '0px 0px 0px 2px #EF444420';
          } else {
            target.style.borderColor = 'border';
            target.style.boxShadow = '0px 1px 2px 0px #0000000D, 0px 0px 5.5px 0px #0000001A inset';
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.boxShadow = 'none';
          target.style.borderColor = error ? 'destructive' : 'border';
          props.onBlur?.(e);
        }}
        value={value}
        {...props}
      />
      
      {showCharacterCount && (
        <div className="flex justify-between items-center mt-1">
          {error && (
            <p 
              style={{
                color: 'var(--color-destructive)',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {error}
            </p>
          )}
          <p 
            className={`text-sm ml-auto ${currentLength < minLength ? 'text-red-500' : 'text-gray-500'}`}
            style={{
              fontSize: '12px',
              fontWeight: '400',
            }}
          >
            {currentLength}/{minLength} characters minimum
          </p>
        </div>
      )}
      
      {error && !showCharacterCount && (
        <p 
          className="mt-1"
          style={{
            color: 'var(--color-destructive)',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {error || errorMessage}
        </p>
      )}
    </div>
  );
};
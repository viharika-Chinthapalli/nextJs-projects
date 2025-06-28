export const Button = ({ 
  children, 
  variant = 'purple', 
  size = 'default', 
  className = '', 
  onClick,
  disabled = false,
  type = 'button'
}: { 
  children: React.ReactNode; 
  variant?: 'purple' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const variants = {  
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    purple: 'bg-secondary text-white hover:bg-hover-button-bg'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  return (
    <button 
      type={type}
      className={`inline-flex text-[12px] items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
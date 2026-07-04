import React from 'react';

/**
 * Props for the Button component.
 * 
 * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button.
   * @type {'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'}
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  /**
   * The size variant of the button.
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Indicates whether the button is in a loading state. When true, it shows a spinner and disables user interaction.
   * @type {boolean}
   * @default false
   */
  isLoading?: boolean;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: "px-4 py-1.5 text-xs font-semibold tracking-wide",
  md: "px-6 py-2.5 text-sm font-semibold tracking-wide",
  lg: "px-8 py-3.5 text-base font-semibold tracking-wide",
};

const variantStyles: Record<'primary' | 'secondary' | 'ghost' | 'glass' | 'danger', string> = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg focus:ring-primary",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300",
  glass: "glass-effect text-slate-800 hover:bg-white/90 border border-white/60 shadow-sm focus:ring-primary",
  danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-lg focus:ring-rose-500",
};

/**
 * A reusable Button component supporting various shapes, loading states, and theme colors.
 * 
 * @param {ButtonProps} props - Props for configuring the button behavior and aesthetics.
 * @returns {React.ReactElement} The rendered button element.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-medium rounded-full overflow-hidden transition-all duration-300 transform active:scale-98 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none disabled:transform-none";
  
  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
export default Button;

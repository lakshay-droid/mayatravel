import React, { useId } from 'react';

/**
 * Props for the Input component.
 * 
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The text label displayed above the input field.
   * @type {string}
   */
  label?: string;
  /**
   * Validation error message. If provided, the input displays a red border and this message is shown below the input.
   * @type {string}
   */
  error?: string;
  /**
   * Supporting descriptive text shown below the input field when there is no validation error.
   * @type {string}
   */
  helperText?: string;
}

/**
 * A highly accessible, custom-styled input field supporting labels, error validation states, and helper descriptions.
 * 
 * @param {InputProps} props - The input properties.
 * @param {React.ForwardedRef<HTMLInputElement>} ref - Forwarded reference to the DOM input element.
 * @returns {React.ReactElement} The rendered Input component.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold tracking-wider text-slate-500 uppercase select-none"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
        className={`w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm font-medium transition-all duration-300 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:bg-slate-50 ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span 
          id={errorId} 
          className="text-xs font-medium text-rose-500 pl-1 select-none animate-fade-in"
          role="alert"
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span 
          id={helperId} 
          className="text-xs text-slate-400 pl-1 select-none"
        >
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

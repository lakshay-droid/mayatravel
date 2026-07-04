import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyle = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide select-none";
  
  const variants = {
    primary: "bg-primary/10 text-primary-dark border border-primary/20",
    secondary: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    neutral: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

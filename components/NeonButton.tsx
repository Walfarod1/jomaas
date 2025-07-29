import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-white text-gray-800 hover:bg-slate-100 shadow-md border border-gray-200',
    secondary: 'bg-[#f97216] text-white hover:bg-[#dd6614] shadow-md shadow-[#f97216]/30 border border-[#dd6614]',
  };

  return (
    <button
      className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#fdba74] ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
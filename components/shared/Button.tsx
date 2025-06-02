
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  iconClass?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  iconClass,
  ...props
}) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-primary-600 hover:bg-primary-500 focus:ring-primary-500';
      break;
    case 'secondary':
      variantStyle = 'bg-secondary-600 hover:bg-secondary-500 focus:ring-secondary-500';
      break;
    case 'danger':
      variantStyle = 'bg-danger hover:bg-red-500 focus:ring-red-500';
      break;
    case 'success':
      variantStyle = 'bg-success hover:bg-green-500 focus:ring-green-500';
      break;
    default:
      variantStyle = 'bg-primary-600 hover:bg-primary-500 focus:ring-primary-500';
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className || ''}`}
      {...props}
    >
      {iconClass && <i className={`${iconClass}`}></i>}
      <span>{children}</span>
    </button>
  );
};

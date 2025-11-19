import React from 'react';
import { ClickSpark } from '../utils/reactbits-wrappers';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  withSpark?: boolean;
  sparkColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  withSpark = true,
  sparkColor,
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  const defaultSparkColor = variant === 'primary' ? '#3b82f6' : '#6b7280';
  const finalSparkColor = sparkColor || defaultSparkColor;

  const button = (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      type={type}
    >
      {children}
    </button>
  );

  if (withSpark) {
    return (
      <ClickSpark sparkColor={finalSparkColor} sparkCount={8}>
        {button}
      </ClickSpark>
    );
  }

  return button;
}; 
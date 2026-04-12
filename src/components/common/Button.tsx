import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'outline' | 'success' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    fullWidth ? styles.fullWidth : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

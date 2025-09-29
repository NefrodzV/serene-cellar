import React from 'react'
export function Button({
  variant = 'primary',
  children,
  onClick,
  className = '',
  props,
}) {
  const variants = {
    primary: 'button-primary',
    card: 'button-card',
    neutral: 'button-neutral',
    secondary: 'button-secondary',
    accent: 'button-accent',
  }

  return (
    <button
      className={`button ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

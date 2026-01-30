import React from 'react'
export function Button({
  variant = 'primary',
  children,
  onClick,
  className = '',
  ...props
}) {
  const variants = {
    transparent: 'transparent',
  }

  return (
    <button
      className={`button ${variants[variant] ?? ''} ${className ?? ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

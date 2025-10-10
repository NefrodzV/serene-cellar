import React from 'react'
export function Card({
  as: Component = 'div',
  variant = 'neutral',
  className = '',
  children,
  ...props
}) {
  const variants = {
    neutral: 'card-neutral',
    primary: 'card-primary',
    secondary: 'card-secondary',
  }
  return (
    <Component className={`card ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

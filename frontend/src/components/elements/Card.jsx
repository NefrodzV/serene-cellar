import React from 'react'
export function Card({
  as: Component = 'div',
  variant = 'neutral',
  className = '',
  children,
}) {
  const variants = {
    neutral: 'card-neutral',
    primary: 'card-primary',
  }
  return (
    <Component className={`card ${variants[variant]} ${className}`}>
      {children}
    </Component>
  )
}

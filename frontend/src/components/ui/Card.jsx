import React from 'react'
export function Card({
  as: Component = 'div',
  variant,
  className = '',
  children,
  ...props
}) {
  return (
    <Component className={`card ${className}`} {...props}>
      {children}
    </Component>
  )
}

import React from 'react'
export function Button({ variant = 'primary', children, onClick }) {
  const variants = {
    primary: 'button-primary',
    card: 'button-card',
  }

  return (
    <button className={`button ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}

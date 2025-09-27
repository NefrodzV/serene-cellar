import React from 'react'
export function Button({ variant = 'primary', children, onClick }) {
  const variants = {
    primary: 'button-primary',
  }

  return (
    <button className={variants[variant]} onClick={onClick}>
      {children}
    </button>
  )
}

import React from 'react'
export function Card({ variant = 'card', children }) {
  const variants = {
    card: 'card rounded shadow3',
    primary: 'card primary-bg rounded',
  }
  return <div className={variants[variant]}>{children}</div>
}

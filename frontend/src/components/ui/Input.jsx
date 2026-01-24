import React from 'react'
export function Input({ children, id, label, error, ...props }) {
  const variants = {
    primary: 'input-primary',
  }
  return (
    <div className="input-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-wrapper">
        <input
          className={`input`}
          id={id}
          name={id}
          aria-invalid={!!error}
          aria-describedby={`error-${id}`}
          {...props}
        />
        {children}
      </div>
      {error && (
        <div className="error" id={`error-${id}`}>
          {error}
        </div>
      )}
    </div>
  )
}

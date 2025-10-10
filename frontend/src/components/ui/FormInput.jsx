import React from 'react'
export function FormInput({
  variant = 'primary',
  id,
  label,
  type,
  value,
  onChangeHandler,
  error,
  children,
  ...props
}) {
  const variants = {
    primary: 'input-primary',
  }
  return (
    <div className="input-container">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={`input ${variants[variant]}`}
        id={id}
        value={value}
        onChange={onChangeHandler}
        type={type}
        name={id}
        aria-invalid={!!error}
        aria-describedby={`error-${id}`}
        {...props}
      />
      {error && (
        <div className="error" id={`error-${id}`}>
          {error}
        </div>
      )}
      {children}
    </div>
  )
}

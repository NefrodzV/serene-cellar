import React from 'react'
export function Input({ id, label, type, value, onChangeHandler, error }) {
  return (
    <div className="input container">
      <label htmlFor={id}>{label}</label>
      <input
        className="input primary"
        id={id}
        value={value}
        onChange={onChangeHandler}
        type={type}
        name={id}
        aria-invalid={!!error}
        aria-describedby={`error-${id}`}
      />
      {error && (
        <div className="error" id={`error-${id}`}>
          {error}
        </div>
      )}
    </div>
  )
}

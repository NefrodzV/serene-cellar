import React from 'react'

export function Spinner({ message, ...props }) {
  return (
    <div className="loader-container" {...props}>
      <div className="loader"></div>
      {message && <p>{message}</p>}
    </div>
  )
}

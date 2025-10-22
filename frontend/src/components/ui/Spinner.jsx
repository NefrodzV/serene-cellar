import React from 'react'

export function Spinner({ ...props }) {
  return (
    <div className="loader-container" {...props}>
      <div className="loader"></div>
    </div>
  )
}

import React from 'react'
export function Error({ text, parentId }) {
  return (
    text && (
      <div className="error" id={`error-${parentId}`}>
        {text}
      </div>
    )
  )
}

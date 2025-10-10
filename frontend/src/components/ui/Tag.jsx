import React from 'react'
import { Card } from './Card'
export function Tag({ id, value, onChange, children }) {
  if (onChange) {
    return (
      <Card
        as="label"
        variant="secondary"
        className="selectable-card rounded"
        htmlFor={id}
      >
        <input id={id} type="checkbox" value={value} onChange={onChange} />
        <span className="checkmark"></span>
        <span>{children}</span>
      </Card>
    )
  }
  return <span>{children}</span>
}

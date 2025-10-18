import { useState } from 'react'
import { Input } from './Input'
import React from 'react'
export function PasswordInput({ id, label, variant, ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      id={id}
      label={label}
      variant={variant}
      type={visible ? 'text' : 'password'}
      children={
        <button
          className="toggle-password-button"
          type="button"
          onClick={() => setVisible((v) => !v)}
        >
          <i class={`fa-solid fa-eye${visible ? '-slash' : ''}`}></i>
        </button>
      }
      {...props}
    />
  )
}

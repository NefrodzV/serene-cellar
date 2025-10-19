import React from 'react'
import { Input } from './Input'
export function TextInput({ id, label, variant, ...props }) {
  return (
    <Input id={id} label={label} type={'text'} variant={variant} {...props} />
  )
}

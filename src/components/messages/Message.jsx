import { useMessages } from '../../hooks'
import React from 'react'
export function MessageView({ message }) {
  const { removeMessage } = useMessages()
  return (
    <li>
      {message.text}
      <button type="button" onClick={() => removeMessage(message.id)}>
        Close
      </button>
    </li>
  )
}

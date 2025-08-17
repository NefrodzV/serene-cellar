import { useMessages } from '../../hooks'
import React from 'react'
export function MessageView({ message, type = 'notify' }) {
  const { removeMessage } = useMessages()
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  const isError = type === 'error'
  return (
    <li
      className="message"
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      role={isError ? 'alert' : 'status'}
      onKeyDown={(e) => {
        if (e.key === 'Escape') removeMessage(message.id)
      }}
    >
      <div className="header">
        <button
          aria-label="Dismiss notification"
          className="button"
          type="button"
          onClick={() => removeMessage(message.id)}
        >
          x
        </button>
      </div>

      <div className="content">
        <div className={`icon ${type}`} aria-hidden>
          {messageType[type]}
        </div>
        <p className="text">{message.text}</p>
      </div>
    </li>
  )
}

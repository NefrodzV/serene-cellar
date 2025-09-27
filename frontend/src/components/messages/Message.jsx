import { useMessages } from '../../hooks'
import React from 'react'
export function Message({ message }) {
  const { removeMessage } = useMessages()
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  const isError = message.type === 'error'
  return (
    <div
      className="message"
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      role={isError ? 'alert' : 'status'}
      onKeyDown={(e) => {
        if (e.key === 'Escape') removeMessage(message.id)
      }}
    >
      <div className="content">
        <div className="icon-container">
          <div className={`icon message-${message?.type}`} aria-hidden>
            {messageType[message?.type]}
          </div>
        </div>

        <p className="text">{message.text}</p>
      </div>
    </div>
  )
}

import { useMessages } from '../../hooks'
import React, { useEffect } from 'react'
export function Message({ message, removeMessage, updateAnimation }) {
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  const isError = message.type === 'error'
  useEffect(() => {
    updateAnimation(message.id, true)
    const id = setTimeout(() => {
      updateAnimation(message.id, false)
    }, 3000)
    setTimeout(() => {
      removeMessage(message.id)
    }, 4000)

    return () => {
      clearTimeout(id)
    }
  }, [])
  console.log(message)
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

import { useMessages } from '../../hooks'
import React from 'react'
export function MessageView({ message, type = 'notify' }) {
  const { removeMessage } = useMessages()
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  return (
    <li className="message">
      <div className={`icon ${type}`} aria-hidden>
        {messageType[type]}
      </div>
      <div className="content">
        <button
          className="button"
          type="button"
          onClick={() => removeMessage(message.id)}
        >
          x
        </button>
        <div>{message.text}</div>
      </div>
    </li>
  )
}

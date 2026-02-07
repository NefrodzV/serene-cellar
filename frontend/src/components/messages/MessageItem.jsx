import { useMessages } from '../../hooks'
import React, { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
export function MessageItem({ message, onDelete, onExit }) {
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  const isError = message.type === 'error'

  return (
    <Card
      as="li"
      className={`message ${message.status ?? 'idle'}`}
      onTransitionEnd={() => {
        if (message.status === 'exit') {
          onExit(message.id)
        }
      }}
    >
      <div className="msg-icon-wrapper">
        <div className={`msg-icon msg-icon--${message?.type}`} aria-hidden>
          {messageType[message?.type]}
        </div>
      </div>
      <div
        className="message-content"
        aria-live={isError ? 'assertive' : 'polite'}
        aria-atomic="true"
        role={isError ? 'alert' : 'status'}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onDelete(message.id)
        }}
      >
        <div className="message-title">{message.title}</div>

        <p className="message-text">{message.text}</p>
      </div>

      <Button
        className=" align-right align-top"
        variant="transparent"
        onClick={() => onDelete(message.id)}
      >
        <div className="button-icon-container">x</div>
      </Button>
    </Card>
  )
}
